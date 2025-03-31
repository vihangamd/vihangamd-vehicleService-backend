// ../src/app.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import customerRoutes from "./controllers/customerController.js";
import employeeRoutes from "./controllers/employeeController.js";
import invoiceRoutes from "./controllers/invoiceController.js";
import jobRoutes from "./controllers/jobController.js";
import jobServiceRoutes from "./controllers/jobServiceController.js";
import paymentRoutes from "./controllers/paymentController.js";
import serviceRoutes from "./controllers/serviceController.js";
import vehicleRoutes from "./controllers/vehicleController.js";
import inventoryRoutes from "./controllers/inventoryController.js";

const app = express();
import { auth } from "express-openid-connect";

// Hardcoded configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "",
  baseURL: "http://localhost:3000",
  clientID: "",
  issuerBaseURL: "",
};

app.use(auth(config));

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Vehicle Service API is running!");
});

app.use("/customers", customerRoutes);
app.use("/employees", employeeRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/jobs", jobRoutes);
app.use("/jobservices", jobServiceRoutes);
app.use("/payments", paymentRoutes);
app.use("/services", serviceRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/inventory", inventoryRoutes);

export default app;
