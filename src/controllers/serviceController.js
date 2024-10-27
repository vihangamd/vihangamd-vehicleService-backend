// ../src/controllers/serviceController
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all services
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Services");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a service by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Services WHERE service_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new service
router.post("/", async (req, res) => {
  const { name, description, default_price } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Services (name, description, default_price) VALUES ($1, $2, $3) RETURNING *",
      [name, description, default_price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a service by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, default_price } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Services SET name = $1, description = $2, default_price = $3, updated_date = NOW() WHERE service_id = $4 RETURNING *",
      [name, description, default_price, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a service by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM Services WHERE service_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
