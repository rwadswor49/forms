import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import {
  BlobServiceClient,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  SASProtocol
} from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

type ClientPrincipal = {
  userId?: string;
  userDetails?: string;
  identityProvider?: string;
  userRoles?: string[];
};

function getClientPrincipal(req: HttpRequest): ClientPrincipal | null {
  const header = req.headers.get("x-ms-client-principal");
  if (!header) return null;

  try {
    const decoded = Buffer.from(header, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function safeFileName(name: string) {
  // keep it simple: replace anything sketchy
  return name.replace(/[^\w.\-() ]+/g, "_");
}

app.http("get-upload-sas", {
  methods: ["POST"],
  authLevel: "anonymous", // SWA auth is handled by route rules; API receives principal header
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await req.json() as { fileName: string; contentType?: string; area?: string };
      if (!body?.fileName) {
        return { status: 400, jsonBody: { error: "fileName is required" } };
      }

      const principal = getClientPrincipal(req);
      if (!principal?.userId) {
        return { status: 401, jsonBody: { error: "Not authenticated" } };
      }

      const storageUrl = process.env.BLOB_ACCOUNT_URL; // e.g. https://mystorage.blob.core.windows.net
      const containerName = process.env.BLOB_CONTAINER_NAME || "documents";
      if (!storageUrl) {
        return { status: 500, jsonBody: { error: "Missing BLOB_ACCOUNT_URL config" } };
      }

      const credential = new DefaultAzureCredential();
      const blobServiceClient = new BlobServiceClient(storageUrl, credential);
      const containerClient = blobServiceClient.getContainerClient(containerName);

      // Folder per user in this app. MS notes SWA userId is unique per app and persists per user. [5](https://learn.microsoft.com/en-us/azure/static-web-apps/user-information)
      const area = body.area || "sow";
      const fileName = safeFileName(body.fileName);
      const blobPath = `users/${principal.userId}/${area}/${Date.now()}-${fileName}`;

      const blobClient = containerClient.getBlockBlobClient(blobPath);

      // User Delegation Key (Entra) — recommended over account keys. [2](https://learn.microsoft.com/en-us/azure/storage/blobs/sas-service-create-dotnet)[3](https://github.com/Azure-Samples/azure-typescript-upload-file-storage-blob)
      const startsOn = new Date(Date.now() - 2 * 60 * 1000);
      const expiresOn = new Date(Date.now() + 15 * 60 * 1000);

      const userDelegationKey = await blobServiceClient.getUserDelegationKey(startsOn, expiresOn);

      const sas = generateBlobSASQueryParameters(
        {
          containerName,
          blobName: blobPath,
          permissions: BlobSASPermissions.parse("cw"), // create + write
          startsOn,
          expiresOn,
          protocol: SASProtocol.Https
        },
        userDelegationKey,
        blobServiceClient.accountName
      ).toString();

      const uploadUrl = `${blobClient.url}?${sas}`;

      return {
        status: 200,
        jsonBody: {
          uploadUrl,               // PUT to this from the browser
          blobUrl: blobClient.url, // stable URL (no SAS)
          blobPath,
          expiresOn
        }
      };
    } catch (e: any) {
      context.error(e);
      return { status: 500, jsonBody: { error: "Failed to generate SAS" } };
    }
  }
});