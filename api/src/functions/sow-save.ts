console.log("sow-save file executed");

import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import * as sql from "mssql";

/* ---------- config ---------- */

const sqlConnStr = process.env.SQL_CONNECTION_STRING;

let poolPromise: Promise<any> | null = null;
function getPool() {
  if (!sqlConnStr) throw new Error("SQL_CONNECTION_STRING is not configured");
  if (!poolPromise) poolPromise = sql.connect(sqlConnStr);
  return poolPromise;
}

function safeParse(raw: string) {
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function ensureRoot(existing: any) {
  if (existing?.pages && typeof existing.pages === "object") return existing;
  return { pages: {} };
}

function pageKey(page: number) {
  if (!Number.isInteger(page) || page < 1 || page > 14) return null;
  return `page${page}`;
}

/* ---------- function ---------- */

app.http("sowSave", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "sow/save",

  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    let body: any = {};
    try {
      body = safeParse(await req.text());
    } catch {}

    const submissionId = body?.submissionId;
    if (!submissionId) {
      return { status: 400, jsonBody: { error: "submissionId is required" } };
    }

    const page = body?.page;
    const values = body?.values;
    const pagesPatch = body?.pages;

    if (!values && !pagesPatch) {
      return {
        status: 400,
        jsonBody: { error: "Provide { page, values } or { pages }" }
      };
    }

    const pool = await getPool();

    /* ---------- load existing ---------- */

    const existingRes = await pool
      .request()
      .input("submissionId", sql.UniqueIdentifier, submissionId)
      .query(`
        SELECT DataJson
        FROM dbo.SourceOfWealthSubmission
        WHERE SubmissionId = @submissionId
      `);

    if (existingRes.recordset.length === 0) {
      return { status: 404, jsonBody: { error: "Submission not found" } };
    }

    const existingJson = ensureRoot(
      safeParse(existingRes.recordset[0].DataJson)
    );

    /* ---------- apply patch ---------- */

    if (pagesPatch && typeof pagesPatch === "object") {
      for (const [k, v] of Object.entries(pagesPatch)) {
        if (/^page([1-9]|1[0-4])$/.test(k)) {
          existingJson.pages[k] = v ?? {};
        }
      }
    } else {
      const key = pageKey(Number(page));
      if (!key) {
        return {
          status: 400,
          jsonBody: { error: "page must be a number between 1 and 14" }
        };
      }
      existingJson.pages[key] = values ?? {};
    }

    /* ---------- save ---------- */

    await pool
      .request()
      .input("submissionId", sql.UniqueIdentifier, submissionId)
      .input("dataJson", sql.NVarChar(sql.MAX), JSON.stringify(existingJson))
      .query(`
        UPDATE dbo.SourceOfWealthSubmission
        SET
          DataJson = @dataJson,
          LastUpdatedAtUtc = SYSUTCDATETIME()
        WHERE SubmissionId = @submissionId
      `);

    return { status: 200, jsonBody: { success: true } };
  }
});
