import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const result =
      await sql`select * from transactions where user_id = ${userId} `;
    if (result.length == 0) {
      res.status(404).send({ message: "No transactions found for this user" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error while retrieving info" });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction id" });
    }
    const result =
      await sql`delete  from transactions where id = ${id} returning *`;
    if (result.length == 0) {
      return res.status(404).send({ message: "No transactions found" });
    }
    res.status(200).json({ message: "Deleted successfully", deleted: result });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting info" });
  }
}

export async function postTransaction(req, res) {
  try {
    const { user_id, title, category, amount } = req.body;
    if (!user_id || !title || !category || amount === undefined) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const transaction =
      await sql`INSERT INTO transactions (user_id,title,category,amount) VALUES (${user_id},${title},${category},${amount})
            returning *`;
    res.status(201).json(transaction[0]);
    console.log(transaction);
  } catch (error) {
    console.log("Error while processing request", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSummary(req, res) {
  try {
    const { userid } = req.params;
    if (!userid) {
      return res.status(404).send({ message: "user not found" });
    }
    const balance =
      await sql`select coalesce(sum(amount),0) as balance from transactions where user_id = ${userid}`;
    const income =
      await sql`select coalesce(sum(amount),0) as income from transactions where user_id = ${userid} and category = 'income'`;
    const expense =
      await sql`select coalesce(sum(amount),0) as expense from transactions where user_id = ${userid} and category = 'expense'`;
    res.status(200).json({
      balance: balance[0].balance,
      income: income[0].income,
      expense: expense[0].expense,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while deleting info", errormsg: error });
  }
}
