import express from "express";
import admin from "./adminRoute/ProductRoute.js";
import cors from "cors";
import userRoute from "./adminRoute/adminUser.js";
import path, { join } from "path";
import { connect } from "./mongo.js";
import sales from "./salesRoute/user.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database connection
connect((err) => {
  if (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
  console.log("✅ MongoDB connected successfully");
});

// Uploads and public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(join(__dirname, "public")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(express.urlencoded({ extended: true }));

// -------------------
// ✅ Serve React Apps
// -------------------
const frontend1Path = path.join(
  __dirname,
  "../frontend/root/dist" // or build if CRA
);

const frontend2Path = path.join(
  __dirname,
  "../frontend2/my-project/dist" // or build if CRA
);

// Frontend 1 (Main site)
app.use("/", express.static(frontend1Path));
app.get("/", (req, res) => {
  res.sendFile(path.join(frontend1Path, "index.html"));
});

// Frontend 2 (Admin or POS)
app.use("/admin", express.static(frontend2Path));
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(frontend2Path, "index.html"));
});

// -------------------
// ✅ API Routes
// -------------------
app.use("/products", admin);
app.use("/sales", sales);
app.use("/users", userRoute);

// -------------------
// ✅ Start Server
// -------------------
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`🌐 Frontend 1 → http://localhost:${port}/`);
  console.log(`🌐 Frontend 2 → http://localhost:${port}/app2`);
});
