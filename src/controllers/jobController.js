// ../src/controllers/jobController
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Jobs");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a job by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM Jobs WHERE job_id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get jobs by customer ID
router.get("/customer/:customerId", async (req, res) => {
  const { customerId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Jobs WHERE customer_id = $1",
      [customerId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new job
router.post("/", async (req, res) => {
  const { customer_id, vehicle_id, status } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Jobs (customer_id, vehicle_id, status) VALUES ($1, $2, $3) RETURNING *",
      [customer_id, vehicle_id, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a job by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { customer_id, vehicle_id, status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Jobs SET customer_id = $1, vehicle_id = $2, status = $3, updated_date = NOW() WHERE job_id = $4 RETURNING *",
      [customer_id, vehicle_id, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a job by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM Jobs WHERE job_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
