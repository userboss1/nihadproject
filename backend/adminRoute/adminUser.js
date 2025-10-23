import express from "express";
import { get } from "../mongo.js";
import { ObjectId } from "mongodb";

const router = express.Router();

/**
 * GET /users
 * Retrieve all users
 */
router.get("/", async (req, res) => {
  try {
    const db = get();
    const users = await db.collection("users").find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

/**
 * POST /users/add
 * Add a new user
 * Fields: name, email, phone, password
 */
router.post("/add", async (req, res) => {
  try {
    const db = get();
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = {
      name,
      email,
      phone,
      password, // For production, hash this with bcrypt!
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(newUser);

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding user" });
  }
});

/**
 * PUT /users/update/:id
 * Update user details (name, email, phone, password)
 */
router.put("/update/:id", async (req, res) => {
  try {
    const db = get();
    const { id } = req.params;
    const { name, email, phone, password } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    if (password) updateFields.password = password;

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateFields, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
});

/**
 * DELETE /users/delete/:id
 * Delete a user
 */
router.delete("/delete/:id", async (req, res) => {
  try {
    const db = get();
    const { id } = req.params;

    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

export default router;
