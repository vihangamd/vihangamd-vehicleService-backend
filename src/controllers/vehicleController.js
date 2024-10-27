// ../src/controllers/vehicleController
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get all vehicles
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Vehicles");
    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve vehicles: " + error.message });
  }
});

// Get a vehicle by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Vehicles WHERE vehicle_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve vehicle: " + error.message });
  }
});

// Get vehicles by customer ID
router.get("/customer/:customerId", async (req, res) => {
  const { customerId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Vehicles WHERE customer_id = $1",
      [customerId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve vehicles by customer ID: " + error.message,
    });
  }
});

// Create a new vehicle
router.post("/", async (req, res) => {
  const { customer_id, make, model, year, mileage, color } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Vehicles (customer_id, make, model, year, mileage, color) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [customer_id, make, model, year, mileage, color]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create vehicle: " + error.message });
  }
});

// Update a vehicle by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { make, model, year, mileage, color } = req.body;
  try {
    const result = await pool.query(
      "UPDATE Vehicles SET make = $1, model = $2, year = $3, mileage = $4, color = $5, updated_date = NOW() WHERE vehicle_id = $6 RETURNING *",
      [make, model, year, mileage, color, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update vehicle: " + error.message });
  }
});

// Delete a vehicle by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM Vehicles WHERE vehicle_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete vehicle: " + error.message });
  }
});

export default router;
