import express from "express";
import { get } from "../mongo.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET all products
router.get("/products", async (req, res) => {
  try {
    const db = get();
    const products = await db.collection("products").find({}).toArray();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});
router.get("/transactions", async (req, res) => {
  try {
    console.log('heyyy');
    
    const db = get()
    const transactions = await db.collection("sales").find().sort({ date: -1 }).toArray();

    res.send({transactions})
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching transactions");
  }
});
// POST /sales - process a sale
router.post("/sales", async (req, res) => {
  try {
    console.log('hey');
    
    const db = get();
    const { items, customerName,
          customerPhone,
          paymentMethod, } = req.body; // [{ productId, quantity }]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "❌ No items provided" });
    }

    const salesRecords = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await db
        .collection("products")
        .findOne({ _id: new ObjectId(item.productId) });

      if (!product)
        return res
          .status(404)
          .json({ message: `❌ Product not found: ${item.productId}` });

      if (product.quantity < item.quantity)
        return res.status(400).json({
          message: `⚠️ Not enough stock for ${product.name}. Available: ${product.quantity}`,
        });

      const price = product.price || 0;
      const subtotal = price * item.quantity;
      totalAmount += subtotal;

      // Update product quantity
      await db.collection("products").updateOne(
        { _id: product._id },
        { $inc: { quantity: -item.quantity } }
      );

      salesRecords.push({
        customerName,
          customerPhone,
          paymentMethod,
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price,
        subtotal,
        createdAt: new Date(),
      });
    }

    // Insert all sale records
    const saleEntry = {
      items: salesRecords,
      totalAmount,
      date: new Date(),
    };

    await db.collection("sales").insertOne(saleEntry);

    res.json({
      message: "✅ Sale recorded successfully",
      totalAmount,
      sale: saleEntry,
    });
  } catch (err) {
    console.error("❌ Error in /sales:", err);
    res.status(500).json({ message: "Sale processing failed", error: err.message });
  }
});
router.get("/analytics", async (req, res) => {
  try {
    const db = get();

    // Fetch all sales records
    // Assuming sales documents have structure: { totalAmount, date, items: [{ name, quantity, subtotal }] }
    const allSales = await db.collection("sales").find({}).toArray();

    if (allSales.length === 0) {
      return res.json({ message: "No sales data found", analytics: null });
    }

    let totalRevenue = 0;
    let totalItemsSold = 0;
    const productAggregation = {};
    const dailySales = {};
    const monthlySales = {}; // New metric

    // Process all sales records
    for (const sale of allSales) {
      const amount = sale.totalAmount || 0;
      totalRevenue += amount;
      
      // Use the 'date' field from the sale document, falling back to 'createdAt' if necessary
      const saleDate = new Date(sale.date || sale.createdAt);

      // 1. Daily Trend (YYYY-MM-DD)
      const dayKey = saleDate.toISOString().split('T')[0];
      if (!dailySales[dayKey]) dailySales[dayKey] = { date: dayKey, total: 0 };
      dailySales[dayKey].total += amount;

      // 2. Monthly Trend (YYYY-MM)
      const monthKey = saleDate.getFullYear() + '-' + String(saleDate.getMonth() + 1).padStart(2, '0');
      if (!monthlySales[monthKey]) monthlySales[monthKey] = { month: monthKey, total: 0 };
      monthlySales[monthKey].total += amount;

      // 3. Product Aggregation (from nested items)
      if (sale.items && Array.isArray(sale.items)) {
        for (const item of sale.items) {
          const itemQuantity = item.quantity || 0;
          const itemSubtotal = item.subtotal || 0;
          totalItemsSold += itemQuantity;
          const productName = item.name || 'Unknown Product';
          
          if (!productAggregation[productName]) {
            productAggregation[productName] = { name: productName, quantity: 0, total: 0 };
          }
          productAggregation[productName].quantity += itemQuantity;
          productAggregation[productName].total += itemSubtotal;
        }
      }
    }

    // --- Top 5 selling products ---
    const topProducts = Object.values(productAggregation)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // --- Daily Trend & Monthly Trend ---
    const dailyTrend = Object.values(dailySales).sort((a, b) => a.date.localeCompare(b.date));
    const monthlyTrend = Object.values(monthlySales).sort((a, b) => a.month.localeCompare(b.month)); // Sort by month key

    // Return analytics data
    res.json({
      message: "Sales analytics generated successfully",
      analytics: {
        totalRevenue,
        totalItemsSold,
        totalOrders: allSales.length, // Renamed for clarity
        topProducts,
        dailyTrend,
        monthlyTrend, // New data point
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate analytics", error: err.message });
  }
});

export default router;
