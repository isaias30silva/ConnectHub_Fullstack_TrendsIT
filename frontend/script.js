const transactionForm = document.querySelector("#transaction-form");
const transactionNameInput = document.querySelector("#transaction-name");
const transactionAmountInput = document.querySelector("#transaction-amount");
const formMessage = document.querySelector("#form-message");
const transactionList = document.querySelector("#transaction-list");
const incomeDisplay = document.querySelector("#income-display");
const expenseDisplay = document.querySelector("#expense-display");
const balanceDisplay = document.querySelector("#balance-display");
const transactionSubmitButton = document.querySelector(
  "#transaction-submit-button",
);

let transactions = [];

let editingTransactionId = null;

function convertAmountToNumber(value) {
  return Number(value);
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function validateForm(name, amount) {
  clearInputErrors();

  hideFormMessage();

  if (name.trim() === "") {
    addInputError(transactionNameInput);

    showFormMessage("Por favor, informe uma descrição.", "error");

    return false;
  }

  if (transactionAmountInput.value.trim() === "") {
    addInputError(transactionAmountInput);

    showFormMessage("Por favor, informe um valor.", "error");

    return false;
  }

  if (isNaN(amount)) {
    addInputError(transactionAmountInput);

    showFormMessage("O valor informado é inválido.", "error");

    return false;
  }

  if (amount === 0) {
    addInputError(transactionAmountInput);

    showFormMessage("O valor não pode ser zero.", "error");

    return false;
  }

  return true;
}

function createTransaction(name, amount) {
  return {
    id: Date.now(),
    name: name,
    amount: amount,
  };
}

async function addTransaction(transaction) {
  try {
    const createdTransaction = await apiRequest("/transactions", {
      method: "POST",
      body: JSON.stringify({
        description: transaction.name,
        amount: transaction.amount,
      }),
    });

    transactions.push({
      id: createdTransaction.id,
      name: createdTransaction.description,
      amount: Number(createdTransaction.amount),
    });

    updateUI();

    return true;
  } catch (error) {
    console.error(error);

    showFormMessage("Erro ao salvar transação.", "error");

    return false;
  }
}

async function removeTransaction(transactionId) {
  try {
    await apiRequest(`/transactions/${transactionId}`, {
      method: "DELETE",
    });

    transactions = transactions.filter(
      (transaction) => transaction.id !== transactionId,
    );

    updateUI();

    showFormMessage("Transação removida com sucesso.", "success");
  } catch (error) {
    console.error(error);

    showFormMessage("Erro ao remover transação.", "error");
  }
}

function calculateIncome() {
  return transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

function calculateExpenses() {
  return transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

function calculateBalance() {
  return transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );
}

async function loadTransactions() {
  try {
    const data = await apiRequest("/transactions");

    transactions = data.map((transaction) => ({
      id: transaction.id,
      name: transaction.description,
      amount: Number(transaction.amount),
    }));

    updateUI();
  } catch (error) {
    console.error(error);

    showFormMessage("Erro ao carregar transações.", "error");
  }
}

async function initializeApplication() {
  if (!isAuthenticated()) {
    return;
  }

  await loadTransactions();
}

function createTransactionElement(transaction) {
  const transactionItem = document.createElement("li");

  transactionItem.classList.add("transaction-item");

  const transactionTypeClass = transaction.amount > 0 ? "income" : "expense";

  transactionItem.innerHTML = `
        <div class="transaction-info">
            <h3 class="transaction-name">
                ${transaction.name}
            </h3>

            <p class="transaction-type">
                ${transaction.amount > 0 ? "Receita" : "Despesa"}
            </p>
        </div>

        <div class="transaction-details">

            <span class="transaction-amount ${transactionTypeClass}">
                ${formatCurrency(transaction.amount)}
            </span>

            <button
 class="edit-button"
 data-id="${transaction.id}"
 aria-label="Editar transação"
>
✏️
</button>

            <button
                class="delete-button"
                data-id="${transaction.id}"
                aria-label="Remover transação"
            >
                ✕
            </button>

        </div>
    `;

  return transactionItem;
}

function renderTransactions() {
  transactionList.innerHTML = "";

  if (transactions.length === 0) {
    transactionList.innerHTML = `
            <li class="empty-state">
                Nenhuma transação cadastrada.
            </li>
        `;

    return;
  }

  transactions.forEach((transaction) => {
    const transactionElement = createTransactionElement(transaction);

    transactionList.appendChild(transactionElement);
  });
}

function showFormMessage(message, type) {
  formMessage.textContent = message;

  formMessage.className = `form-message ${type}`;
}

function hideFormMessage() {
  formMessage.className = "form-message";
}

function addInputError(input) {
  input.classList.add("input-error");
}

function removeInputError(input) {
  input.classList.remove("input-error");
}

function clearInputErrors() {
  removeInputError(transactionNameInput);

  removeInputError(transactionAmountInput);
}

function updateSummaryCards() {
  const income = calculateIncome();

  const expenses = calculateExpenses();

  const balance = calculateBalance();

  incomeDisplay.textContent = formatCurrency(income);

  expenseDisplay.textContent = formatCurrency(expenses);

  balanceDisplay.textContent = formatCurrency(balance);
}

function updateBalanceStyle() {
  const balance = calculateBalance();

  balanceDisplay.classList.remove("balance-positive", "balance-negative");

  if (balance > 0) {
    balanceDisplay.classList.add("balance-positive");
  } else if (balance < 0) {
    balanceDisplay.classList.add("balance-negative");
  }
}

function updateUI() {
  renderTransactions();

  updateSummaryCards();

  updateBalanceStyle();
}

function clearFormInputs() {
  transactionNameInput.value = "";

  transactionAmountInput.value = "";

  editingTransactionId = null;

  transactionSubmitButton.textContent = "Adicionar Transação";

  clearInputErrors();

  transactionNameInput.focus();
}

function editTransaction(transactionId) {
  const transaction = transactions.find(
    (transaction) => transaction.id === transactionId,
  );

  if (!transaction) {
    return;
  }

  transactionNameInput.value = transaction.name;

  transactionAmountInput.value = transaction.amount;

  editingTransactionId = transactionId;

  transactionSubmitButton.textContent = "Salvar Alteração";

  showFormMessage("Editando transação.", "success");

  transactionNameInput.focus();
}

async function updateTransaction(transactionId, transactionData) {
  try {
    const updatedTransaction = await apiRequest(
      `/transactions/${transactionId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          description: transactionData.name,
          amount: transactionData.amount,
        }),
      },
    );

    transactions = transactions.map((transaction) => {
      if (transaction.id === transactionId) {
        return {
          id: updatedTransaction.id,
          name: updatedTransaction.description,
          amount: Number(updatedTransaction.amount),
        };
      }

      return transaction;
    });

    updateUI();

    return true;
  } catch (error) {
    console.error(error);

    showFormMessage("Erro ao atualizar transação.", "error");

    return false;
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const transactionName = transactionNameInput.value;

  const transactionAmount = convertAmountToNumber(transactionAmountInput.value);

  const isFormValid = validateForm(transactionName, transactionAmount);

  if (!isFormValid) {
    return;
  }

  let success;

  if (editingTransactionId) {
    success = await updateTransaction(editingTransactionId, {
      name: transactionName,
      amount: transactionAmount,
    });

    editingTransactionId = null;

    transactionSubmitButton.textContent = "Adicionar Transação";
  } else {
    const newTransaction = createTransaction(
      transactionName,
      transactionAmount,
    );

    success = await addTransaction(newTransaction);
  }

  if (!success) {
    return;
  }

  showFormMessage("Transação salva com sucesso.", "success");

  clearFormInputs();
}

transactionList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-button");

  const editButton = event.target.closest(".edit-button");

  if (deleteButton) {
    const transactionId = Number(deleteButton.dataset.id);

    removeTransaction(transactionId);

    return;
  }

  if (editButton) {
    const transactionId = Number(editButton.dataset.id);

    editTransaction(transactionId);
  }
});

transactionNameInput.addEventListener("input", () => {
  removeInputError(transactionNameInput);
  hideFormMessage();
});

transactionAmountInput.addEventListener("input", () => {
  removeInputError(transactionAmountInput);
  hideFormMessage();
});

transactionForm.addEventListener("submit", handleFormSubmit);

initializeApplication();
