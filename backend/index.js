import express from "express";
import cors from "cors";
import path, { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { connect } from "./mongo.js";
import admin from "./adminRoute/ProductRoute.js";
import userRoute from "./adminRoute/adminUser.js";
import sales from "./salesRoute/user.js";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MongoDB connect
connect((err) => {
  if (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
  console.log("✅ MongoDB connected successfully");
});

// Static folders for uploads
app.use("/uploads", express.static(join(__dirname, "uploads")));

// --- 🧩 API ROUTES (Define these BEFORE static file serving) ---
app.use("/products", admin);
app.use("/sales", sales);
app.use("/users", userRoute);

// --- 🧩 FRONTEND SERVING ---

// ⚙️ ADMIN FRONTEND
app.use("/", express.static(join(__dirname, "../frontend2/my-project/dist")));

// Admin catch-all route for React Router
app.get(/^\/(?:\/.*)?$/, (req, res) => {
  res.sendFile(join(__dirname, "../frontend2/my-project/dist", "index.html"));
});

// 🏠 MAIN FRONTEND (User side)
app.use(express.static(join(__dirname, "../frontend/root/dist")));

// Main frontend catch-all (must be LAST) - using regex instead of "*"
app.get(/^\/admin(?!admin|products|sales|users|uploads).*/, (req, res) => {
  res.sendFile(join(__dirname, "../frontend/root/dist", "index.html"));
});

// --- START SERVER ---
app.listen(port, () => {
  console.log(`✅ Server started at http://localhost:${port}`);
});