import express from "express";
import Expense from "../models/Expense.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Add new expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { category, subcategory, amount } = req.body;

    if (!category || !subcategory || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({
      user: req.user.id,
      category,
      subcategory,
      amount,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all expenses for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update expense
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { category, subcategory, amount } = req.body;
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    expense.category = category || expense.category;
    expense.subcategory = subcategory || expense.subcategory;
    expense.amount = amount || expense.amount;

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
