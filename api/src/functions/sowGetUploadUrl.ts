import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import crypto from "crypto";
import * as sql from "mssql";
import {
  BlobServiceClient,
  BlobSASPermissions,
  SASProtocol,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters
} from "@azure/storage-blob";

// uploadToken payload created by /api/sow/start
type UploadTokenPayload = {
  submissionRef: string;
  submissionId?: string; 
  exp: number;
  nonce: string;
};

function verifyToken(token: string, secret: string): UploadTokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [bodyB64, sigB64] = parts;

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(bodyB64)
    .digest("base64url");

  try {
    if (!crypto.timingSafeEqual(Buffer.from(sigB64), Buffer.from(expectedSig))) return null;
  } catch {
    return null;
  }

  let payload: UploadTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(bodyB64, "base64url").toString("utf-8"));
  } catch {
    return null;
  }

  if (!payload?.submissionRef || !payload?.exp) return null;
  if (Date.now() > payload.exp) return null;

  return payload;
}

function safeFileName(name: string) {
  return (name || "file")
    .replace(/[^\w.\-() ]+/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

/* ---------- SQL pool reuse ---------- */

const sqlConnStr = process.env.SQL_CONNECTION_STRING;
let poolPromise: Promise<any> | null = null;

function getPool() {
  if (!sqlConnStr) throw new Error("SQL_CONNECTION_STRING is not configured");
  if (!poolPromise) poolPromise = sql.connect(sqlConnStr);
  return poolPromise;
}

/* ---------- Function ---------- */

app.http("sowGetUploadUrl", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "sow/get-upload-url", // => /api/sow/get-upload-url

  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = (await req.json()) as {
        uploadToken: string;
        fileName: string;
        kind: "doc" | "json";
        fileSizeBytes?: number;
        contentType?: string;
        documentType?: string; // optional - you can also save this later
      };

      const uploadToken = body?.uploadToken;
      const fileName = body?.fileName;
      const kind = body?.kind;

      if (!uploadToken || !fileName || !kind) {
        return { status: 400, jsonBody: { error: "uploadToken, fileName and kind are required" } };
      }

      const tokenSecret = process.env.TOKEN_SECRET;
      if (!tokenSecret) {
        return { status: 500, jsonBody: { error: "Server not configured (TOKEN_SECRET missing)" } };
      }

      const tokenPayload = verifyToken(uploadToken, tokenSecret);
      if (!tokenPayload) {
        return { status: 401, jsonBody: { error: "Invalid or expired uploadToken" } };
      }

      const accountName = process.env.BLOB_ACCOUNT_NAME;
      const accountKey = process.env.BLOB_ACCOUNT_KEY;
      const containerName = process.env.BLOB_CONTAINER_NAME || "sow";

      if (!accountName || !accountKey) {
        return {
          status: 500,
          jsonBody: { error: "Server not configured (BLOB_ACCOUNT_NAME / BLOB_ACCOUNT_KEY missing)" }
        };
      }

      // ---- Build blob path under submissionRef folder ----
      const subFolder = kind === "json" ? "json" : "docs";
      const blobName = `${tokenPayload.submissionRef}/${subFolder}/${isoStamp()}-${safeFileName(fileName)}`;

      // ---- Create SAS URL for that blob ----
      const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
      const serviceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential
      );

      const containerClient = serviceClient.getContainerClient(containerName);
      // Optional but helpful: ensure container exists
      await containerClient.createIfNotExists();

      const blobClient = containerClient.getBlockBlobClient(blobName);

      const startsOn = new Date(Date.now() - 2 * 60 * 1000);   // clock skew buffer
      const expiresOn = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      const sas = generateBlobSASQueryParameters(
        {
          containerName,
          blobName,
          permissions: BlobSASPermissions.parse("cw"), // create + write
          startsOn,
          expiresOn,
          protocol: SASProtocol.Https
        },
        sharedKeyCredential
      ).toString();

      const blobPath = `${containerName}/${blobName}`;
      const uploadUrl = `${blobClient.url}?${sas}`;

      // ---- Persist document row (docs only) ----
      // For JSON uploads, we typically store the path inside DataJson later, or add a column if you want.
      let documentId: string | null = null;

      if (kind === "doc") {
        const submissionId = tokenPayload.submissionId;

        if (!submissionId) {
          // If you haven't included submissionId in token yet, you can fall back to lookup by submissionRef.
          // But submissionId-in-token is best.
          return {
            status: 400,
            jsonBody: { error: "uploadToken missing submissionId (update /sow/start to include it)" }
          };
        }

        const fileSizeBytes = Number(body.fileSizeBytes ?? 0);
        const contentType = body.contentType || "application/octet-stream";

        // Insert a new document row as queued (or uploading).
        // Your TSX can treat this as queued until PUT starts; either is fine.
        const pool = await getPool();
        const res = await pool.request()
          .input("submissionId", sql.UniqueIdentifier, submissionId)
          .input("fileName", sql.NVarChar(255), fileName)
          .input("fileSizeBytes", sql.BigInt, fileSizeBytes)
          .input("contentType", sql.NVarChar(100), contentType)
          .input("documentType", sql.NVarChar(50), body.documentType ?? null)
          .input("uploadStatus", sql.NVarChar(20), "queued")
          .input("blobPath", sql.NVarChar(500), blobPath)
          .query(`
            INSERT INTO dbo.SourceOfWealthDocument (
              SubmissionId,
              FileName,
              FileSizeBytes,
              ContentType,
              DocumentType,
              UploadStatus,
              BlobPath
            )
            OUTPUT inserted.DocumentId
            VALUES (
              @submissionId,
              @fileName,
              @fileSizeBytes,
              @contentType,
              @documentType,
              @uploadStatus,
              @blobPath
            );
          `);

        documentId = res.recordset?.[0]?.DocumentId ?? null;
      }

      return {
        status: 200,
        jsonBody: {
          uploadUrl,
          blobPath,
          expiresOn: expiresOn.toISOString(),
          submissionRef: tokenPayload.submissionRef,
          submissionId: tokenPayload.submissionId ?? null,
          documentId // ✅ TSX should store this against the file item
        }
      };
    } catch (e: any) {
      context.error(e);
      return { status: 500, jsonBody: { error: e?.message || "Failed to generate upload URL" } };
    }
  }
});
