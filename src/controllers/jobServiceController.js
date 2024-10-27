// ../src/controllers/jobServiceController
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all job services by job ID
router.get("/:jobId", async (req, res) => {
  const { jobId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM JobServices WHERE job_id = $1",
      [jobId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new job service
router.post("/", async (req, res) => {
  const {
    job_id,
    service_id,
    custom_service_name,
    custom_service_price,
    quantity,
    price,
    employee_id,
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO JobServices (job_id, service_id, custom_service_name, custom_service_price, quantity, price, employee_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        job_id,
        service_id,
        custom_service_name,
        custom_service_price,
        quantity,
        price,
        employee_id,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a job service by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    service_id,
    custom_service_name,
    custom_service_price,
    quantity,
    price,
    employee_id,
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE JobServices SET service_id = $1, custom_service_name = $2, custom_service_price = $3, quantity = $4, price = $5, employee_id = $6, updated_date = NOW() WHERE job_service_id = $7 RETURNING *",
      [
        service_id,
        custom_service_name,
        custom_service_price,
        quantity,
        price,
        employee_id,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job service not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a job service by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM JobServices WHERE job_service_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job service not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
