const { Transaction } = require("../../models");

async function getAllTransactions(req, res, next) {
  try {
    const transactions = await Transaction.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
}

async function createTransaction(req, res, next) {
  try {
    const { description, amount } = req.body;

    if (
      !description ||
      description.trim() === "" ||
      typeof amount !== "number" ||
      amount === 0
    ) {
      return res.status(400).json({
        message: "Descrição e valor válidos são obrigatórios",
      });
    }

    const newTransaction = await Transaction.create({
      description,
      amount,
      userId: 1,
    });

    return res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
}

async function updateTransaction(req, res, next) {
  try {
    const transactionId = Number(req.params.id);

    const { description, amount } = req.body;

    if (
      !description ||
      description.trim() === "" ||
      typeof amount !== "number" ||
      amount === 0
    ) {
      return res.status(400).json({
        message: "Descrição e valor válidos são obrigatórios",
      });
    }

    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json({
        message: "Transação não encontrada",
      });
    }

    await transaction.update({
      description,
      amount,
    });

    return res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
}

async function deleteTransaction(req, res, next) {
  try {
    const transactionId = Number(req.params.id);

    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json({
        message: "Transação não encontrada",
      });
    }

    await transaction.destroy();

    return res.status(200).json({
      message: "Transação removida com sucesso",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
