const express = require("express");
const router = express.Router();

const {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", getAllTransactions);

router.post("/", createTransaction);

router.put("/:id", updateTransaction);

router.delete("/:id", deleteTransaction);

module.exports = router;
