import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import sql from "mssql";

/* ---------- SQL pool reuse ---------- */

const sqlConnStr = process.env.SQL_CONNECTION_STRING;

let poolPromise: Promise<sql.ConnectionPool> | null = null;

function getPool() {
  if (!sqlConnStr) {
    throw new Error("SQL_CONNECTION_STRING is not configured");
  }
  if (!poolPromise) {
    poolPromise = sql.connect(sqlConnStr);
  }
  return poolPromise;
}

/* ---------- Function ---------- */

app.http("sowUpdateDocumentStatus", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "sow/update-document-status",

  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {

    type UpdateDocumentStatusBody = {
         documentId: string;
         status: "uploaded" | "failed"; 
         error?: string;
    };

    const body = (await req.json()) as UpdateDocumentStatusBody;

    const { documentId, status, error = null } = body;

      if (!documentId || !status) {
        return {
          status: 400,
          jsonBody: { error: "documentId and status are required" }
        };
      }

      if (!["uploaded", "failed"].includes(status)) {
        return {
          status: 400,
          jsonBody: { error: "status must be 'uploaded' or 'failed'" }
        };
      }

      const pool = await getPool();

      const result = await pool
        .request()
        .input("documentId", sql.UniqueIdentifier, documentId)
        .input("status", sql.NVarChar(20), status)
        .input("error", sql.NVarChar(sql.MAX), error)
        .query(`
          UPDATE dbo.SourceOfWealthDocument
          SET
            UploadStatus = @status,
            UploadedAtUtc = CASE WHEN @status = 'uploaded'
                                 THEN SYSUTCDATETIME()
                                 ELSE UploadedAtUtc
                            END,
            Error = @error
          WHERE DocumentId = @documentId;
        `);

      if (result.rowsAffected[0] === 0) {
        return {
          status: 404,
          jsonBody: { error: "Document not found" }
        };
      }

      return {
        status: 200,
        jsonBody: { success: true }
      };
    } catch (e: any) {
      context.error(e);
      return {
        status: 500,
        jsonBody: { error: e?.message || "Failed to update document status" }
      };
    }
  }
});
``