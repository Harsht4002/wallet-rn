import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import rateLimiter from "./middleware/RateLimiter.js";
import transactionroutes from "./routes/transactionsroutes.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();
if (process.env.NODE_ENV === "production") job.start(); // Start the cron job only in production

app.use(rateLimiter);
app.use(express.json());
app.use("/api/transactions", transactionroutes);
const PORT = process.env.PORT;

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Ok" });
});

async function initdb() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
         )`;

    console.log("DB initialized");
  } catch (error) {
    console.log("Error while initializing DB", error);
    process.exit(0);
  }
}

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

initdb().then(() => {
  app.listen(PORT, () => {
    console.log("server is running on port 5001");
  });
});
