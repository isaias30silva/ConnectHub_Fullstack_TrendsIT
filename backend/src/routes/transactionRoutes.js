const express = require("express");
const router = express.Router();

const {
  getAllTransactions,
  createTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

router.get("/", getAllTransactions);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

module.exports = router;
