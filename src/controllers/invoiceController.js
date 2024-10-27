// ../src/controllers/invoiceController
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all invoices
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Invoices");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an invoice by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Invoices WHERE invoice_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an invoice by invoice_code (case sensitive)
router.get("/code/:code", async (req, res) => {
  const { code } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Invoices WHERE invoice_code = $1",
      [code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get invoices by job ID
router.get("/job/:jobId", async (req, res) => {
  const { jobId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Invoices WHERE job_id = $1",
      [jobId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new invoice with Cals

router.post("/", async (req, res) => {
  const { job_id, services, is_paid } = req.body;
  const totalAmount = services.reduce(
    (acc, service) => acc + (service.price ?? 0) * service.quantity,
    0
  );

  try {
    const result = await pool.query(
      "INSERT INTO Invoices (job_id, total_amount, is_paid) VALUES ($1, $2, $3) RETURNING *",
      [job_id, totalAmount, is_paid]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // Create a new invoice
// router.post("/", async (req, res) => {
//   const { job_id, total_amount, is_paid } = req.body;
//   try {
//     const result = await pool.query(
//       "INSERT INTO Invoices (job_id, total_amount, is_paid) VALUES ($1, $2, $3) RETURNING *",
//       [job_id, total_amount, is_paid]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Update an invoice by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { total_amount, is_paid } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Invoices SET total_amount = $1, is_paid = $2, updated_date = NOW() WHERE invoice_id = $3 RETURNING *",
      [total_amount, is_paid, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an invoice by invoice_code (case sensitive)
router.put("/code/:code", async (req, res) => {
  const { code } = req.params;
  const { total_amount, is_paid } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Invoices SET total_amount = $1, is_paid = $2, updated_date = NOW() WHERE invoice_code = $3 RETURNING *",
      [total_amount, is_paid, code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an invoice by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM Invoices WHERE invoice_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an invoice by invoice_code (case sensitive)
router.delete("/code/:code", async (req, res) => {
  const { code } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM Invoices WHERE invoice_code = $1 RETURNING *",
      [code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
