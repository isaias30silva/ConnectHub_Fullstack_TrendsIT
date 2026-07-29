let transactions = [];

function getAllTransactions(req, res) {
  return res.status(200).json(transactions);
}

function createTransaction(req, res) {
  const { description, amount } = req.body;

  const newTransaction = {
    id: Date.now(),
    description,
    amount,
  };

  transactions.push(newTransaction);

  return res.status(201).json(newTransaction);
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
  deleteTransaction,
};
