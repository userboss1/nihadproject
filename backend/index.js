import express from "express";
import admin from './adminRoute/ProductRoute.js'
import cors from "cors";
import userRoute from './adminRoute/adminUser.js'
import path, { join } from "path";
import {connect} from './mongo.js'
import sales from './salesRoute/user.js'
import { fileURLToPath } from "url";
import { dirname } from "path";
const app=express();
const port=3000;

app.use(express.json()); 
app.use(cors());
const __filename = fileURLToPath(import.meta.url);

// Current directory
const __dirname = dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(join(__dirname, "public")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Parse URL-encoded form data
connect(async (err) => {
  if (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
    console.log("✅ MongoDB connected successfully");
})
app.use(express.urlencoded({ extended: true }));
app.get('/',(req,res)=>{
    res.send('hello')
})
app.use('/products',admin)
app.use('/sales',sales)
app.use('/users',userRoute)

app.listen(port,()=>{
    console.log(`server started at http://localhost:${port}`);
    })
