// ../src/controllers/employeeController

import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all employees
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Employees");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an employee by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Employees WHERE employee_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an employee by name
router.get("/name/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Employees WHERE UPPER(name) = $1",
      [name.toUpperCase()]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new employee
router.post("/", async (req, res) => {
  const { name, position, email, phone_number, address } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Employees (name, position, email, phone_number, address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, position, email, phone_number, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an employee by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, position, email, phone_number, address } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Employees SET name = $1, position = $2, email = $3, phone_number = $4, address = $5, updated_date = NOW() WHERE employee_id = $6 RETURNING *",
      [name, position, email, phone_number, address, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an employee by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM Employees WHERE employee_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
