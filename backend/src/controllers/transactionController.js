let transactions = [];

function getAllTransactions(req, res) {
  return res.status(200).json(transactions);
}

function createTransaction(req, res) {
  const { description, amount } = req.body;

  if (!description || typeof amount !== "number") {
    return res.status(400).json({
      message: "Descrição e valor são obrigatórios",
    });
  }

  const newTransaction = {
    id: Date.now(),
    description,
    amount,
  };

  transactions.push(newTransaction);

  return res.status(201).json(newTransaction);
}

function updateTransaction(req, res) {
  const transactionId = Number(req.params.id);

  const { description, amount } = req.body;

  const transactionIndex = transactions.findIndex(
    (transaction) => transaction.id === transactionId,
  );

  if (!description || typeof amount !== "number") {
    return res.status(400).json({
      message: "Descrição e valor são obrigatórios",
    });
  }

  if (transactionIndex === -1) {
    return res.status(404).json({
      message: "Transação não encontrada",
    });
  }

  transactions[transactionIndex] = {
    ...transactions[transactionIndex],
    description,
    amount,
  };

  return res.status(200).json(transactions[transactionIndex]);
}

function deleteTransaction(req, res) {
  const transactionId = Number(req.params.id);

  transactions = transactions.filter(
    (transaction) => transaction.id !== transactionId,
  );

  return res.status(200).json({
    message: "Transação removida com sucesso",
  });
}

module.exports = {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
