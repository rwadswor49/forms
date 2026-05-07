import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import crypto from "crypto";
import * as sql from "mssql";

/* ---------- helpers ---------- */

function createSubmissionRef() {
  return `SOW-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
}

function signToken(payload: any, secret: string) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
}

/* ---------- function ---------- */

app.http("sowStart", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "sow/start",

  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    let body: any = {};
    try {
      const raw = await req.text();
      body = raw ? JSON.parse(raw) : {};
    } catch {
      body = {};
    }

    const planNumber = body?.planNumber ?? null;
    const dob = body?.dob ?? null;

    const submissionRef =
      body?.submissionRef ?? createSubmissionRef();

    const exp = Date.now() + 15 * 60 * 1000;

    /* ---------- secrets ---------- */

    const tokenSecret = process.env.TOKEN_SECRET;
    const sqlConnStr = process.env.SQL_CONNECTION_STRING;

    if (!tokenSecret) {
      return {
        status: 500,
        jsonBody: { error: "TOKEN_SECRET is not configured" }
      };
    }

    if (!sqlConnStr) {
      return {
        status: 500,
        jsonBody: { error: "SQL_CONNECTION_STRING is not configured" }
      };
    }

    /* ---------- persist submission ---------- */

    let submissionId: string;

    const pool = await sql.connect(sqlConnStr);
    const result = await pool
      .request()
      .input("submissionRef", sql.NVarChar(50), submissionRef)
      .input("status", sql.NVarChar(30), "draft")
      .input("planNumber", sql.NVarChar(50), planNumber)
      .input("dob", sql.Date, dob)
      .input("dataJson", sql.NVarChar(sql.MAX), "{}")
      .query(`
        INSERT INTO dbo.SourceOfWealthSubmission (
          SubmissionRef,
          Status,
          PlanNumber,
          ApplicantDob,
          DataJson
        )
        OUTPUT inserted.SubmissionId
        VALUES (
          @submissionRef,
          @status,
          @planNumber,
          @dob,
          @dataJson
        );
      `);

    submissionId = result.recordset[0].SubmissionId;

    /* ---------- upload token ---------- */

    const uploadToken = signToken(
      { submissionRef, submissionId, exp, nonce: crypto.randomUUID() },
      tokenSecret
    );

    /* ---------- response ---------- */

    return {
      status: 200,
      jsonBody: {
        submissionId,
        submissionRef,
        uploadToken,
        expiresOn: exp,
        planNumber,
        dob
      }
    };
  }
});
``