import express from "express";
import multer from "multer";
import { ObjectId } from "mongodb";
import { get } from "../mongo.js";

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/**
 * POST /products/add
 * Add a new product (name, quantity, image)
 */
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const db = get();
    const { name, quantity,price } = req.body;
    
    if (!name || !quantity || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity)) {
      return res.status(400).json({ message: "Quantity must be an integer" });
    }

const newProduct = {
  name,
  quantity: parsedQuantity,
  price:parseInt(price),
  image: `/uploads/${req.file.filename}`, // always forward slash
  createdAt: new Date(),
};


    await db.collection("products").insertOne(newProduct);
console.log('good')
    res.status(201).json({ message: "✅ Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product" });
  }
});

/**
 * PUT /products/update/:id
 * Update the quantity of an existing product
 */
router.put("/update/:id", async (req, res) => {
  try {
    const db = get();
    const { id } = req.params;
    const { quantity } = req.body;
    const { price } = req.body;
    if (!quantity) {
      return res.status(400).json({ message: "Quantity is required" });
    }
    console.log(price,quantity);
    

    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity)) {
      return res.status(400).json({ message: "Quantity must be an integer" });
    }

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: { quantity: parsedQuantity,price:price, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "✅ Quantity updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating quantity" });
  }
});
// GET all products
router.get("/", async (req, res) => {
  try {
    const db = get();
    const products = await db.collection("products").find({}).toArray();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// DELETE a product
router.delete("/:id", async (req, res) => {
  try {
    const db = get();
    const { id } = req.params;
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "✅ Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting product" });
  }
});

export default router;



// await fetch(`http://localhost:3000/products/update/${productId}`, {
//   method: "PUT",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ quantity: 25 }),
// });
