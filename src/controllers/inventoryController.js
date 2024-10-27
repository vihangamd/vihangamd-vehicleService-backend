// ../src/controllers/inventoryController.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all non-expirable inventory items
router.get("/non-expirable", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM NonExpirableInventory");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a non-expirable inventory item by ID
router.get("/non-expirable/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM NonExpirableInventory WHERE inventory_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Non-expirable inventory item not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all expirable inventory items
router.get("/expirable", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ExpirableInventory");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an expirable inventory item by ID
router.get("/expirable/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM ExpirableInventory WHERE inventory_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Expirable inventory item not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new non-expirable inventory item
router.post("/non-expirable", async (req, res) => {
  const { name, description, quantity, unit_price } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO NonExpirableInventory (name, description, quantity, unit_price) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, quantity, unit_price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new expirable inventory item
router.post("/expirable", async (req, res) => {
  const { name, description, batch_code, quantity, unit_price, expiry_date } =
    req.body;
  try {
    const result = await pool.query(
      "INSERT INTO ExpirableInventory (name, description, batch_code, quantity, unit_price, expiry_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, description, batch_code, quantity, unit_price, expiry_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a non-expirable inventory item by ID
router.put("/non-expirable/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, quantity, unit_price } = req.body;
  try {
    const result = await pool.query(
      "UPDATE NonExpirableInventory SET name = $1, description = $2, quantity = $3, unit_price = $4, updated_date = NOW() WHERE inventory_id = $5 RETURNING *",
      [name, description, quantity, unit_price, id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Non-expirable inventory item not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an expirable inventory item by ID
router.put("/expirable/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, batch_code, quantity, unit_price, expiry_date } =
    req.body;
  try {
    const result = await pool.query(
      "UPDATE ExpirableInventory SET name = $1, description = $2, batch_code = $3, quantity = $4, unit_price = $5, expiry_date = $6, updated_date = NOW() WHERE inventory_id = $7 RETURNING *",
      [name, description, batch_code, quantity, unit_price, expiry_date, id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Expirable inventory item not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a non-expirable inventory item by ID
router.delete("/non-expirable/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM NonExpirableInventory WHERE inventory_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Non-expirable inventory item not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an expirable inventory item by ID
router.delete("/expirable/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM ExpirableInventory WHERE inventory_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Expirable inventory item not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
