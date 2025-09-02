import express from "express";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test route to run SELECT NOW()
app.get("/test-time", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]); // returns { now: '2025-09-01T...' }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const PORT = process.env.SERVER_PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
