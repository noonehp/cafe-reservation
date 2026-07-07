import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // در محیط پروداکشن معمولا نیاز به SSL داریم، در دولوپمنت لوکال خاموش می‌مونه
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false,
});

export async function checkDbConnection() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT NOW() as now");
    return { ok: true, time: result.rows[0].now };
  } finally {
    client.release();
  }
}
