// ../src/controllers/paymentController

import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all payments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Payments");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a payment by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Payments WHERE payment_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payments by invoice ID
router.get("/invoice/:invoiceId", async (req, res) => {
  const { invoiceId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Payments WHERE invoice_id = $1",
      [invoiceId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new payment
router.post("/", async (req, res) => {
  const { invoice_id, amount, payment_date, payment_method } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Payments (invoice_id, amount, payment_date, payment_method) VALUES ($1, $2, $3, $4) RETURNING *",
      [invoice_id, amount, payment_date, payment_method]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a payment by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { amount, payment_date, payment_method } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Payments SET amount = $1, payment_date = $2, payment_method = $3, updated_date = NOW() WHERE payment_id = $4 RETURNING *",
      [amount, payment_date, payment_method, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a payment by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM Payments WHERE payment_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
