import express from "express";
import { sql } from "../config/db.js";
const router = express.Router();
import { getTransactionsByUserId } from "../controllers/transactioncontrollers.js";
import { deleteTransaction } from "../controllers/transactioncontrollers.js";
import { postTransaction } from "../controllers/transactioncontrollers.js";
import { getSummary } from "../controllers/transactioncontrollers.js";

router.get("/:userId", getTransactionsByUserId);

router.delete("/:id", deleteTransaction);

router.post("/", postTransaction);

router.get("/summary/:userid", getSummary);

export default router;
