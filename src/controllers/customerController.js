// ../src/controllers/customerController
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all customers
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Customers");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a customer by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Customers WHERE customer_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a customer by customer_code
router.get("/code/:customer_code", async (req, res) => {
  const { customer_code } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Customers WHERE customer_code = $1",
      [customer_code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new customer
router.post("/", async (req, res) => {
  const { name, phone_number, email, address } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Customers (name, phone_number, email, address) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, phone_number, email, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a customer by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phone_number, email, address } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Customers SET name = $1, phone_number = $2, email = $3, address = $4, updated_date = NOW() WHERE customer_id = $5 RETURNING *",
      [name, phone_number, email, address, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a customer by customer_code
router.put("/code/:customer_code", async (req, res) => {
  const { customer_code } = req.params;
  const { name, phone_number, email, address } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Customers SET name = $1, phone_number = $2, email = $3, address = $4, updated_date = NOW() WHERE customer_code = $5 RETURNING *",
      [name, phone_number, email, address, customer_code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a customer by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM Customers WHERE customer_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a customer by customer_code
router.delete("/code/:customer_code", async (req, res) => {
  const { customer_code } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM Customers WHERE customer_code = $1 RETURNING *",
      [customer_code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
