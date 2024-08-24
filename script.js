let displayValue = '';
let totalSpending = 0;

// Load transaction history from local storage on page load
window.onload = function () {
    loadTransactionHistory();
};

function appendNumber(number) {
    displayValue += number;
    updateDisplay();
}

function appendOperator(operator) {
    displayValue += operator;
    updateDisplay();
}

function clearDisplay() {
    displayValue = '';
    updateDisplay();
}

function deleteLast() {
    displayValue = displayValue.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('display').value = displayValue;
}

function calculate() {
    try {
        displayValue = eval(displayValue).toString();
        updateDisplay();
    } catch {
        displayValue = 'Error';
        updateDisplay();
    }
}

document.getElementById('spendingForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (description && !isNaN(amount)) {
        addToHistory(description, amount);
        updateTotalSpending(amount);
        saveTransaction(description, amount);
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
    }
});

function addToHistory(description, amount, id = null) {
    const historyList = document.getElementById('transactionHistory');
    const listItem = document.createElement('li');
    const transactionId = id || new Date().getTime().toString();
    
    listItem.innerHTML = `${description}: ₹${amount.toFixed(2)} 
        <button onclick="deleteTransaction('${transactionId}', ${amount})">Delete</button>`;
    listItem.id = transactionId;
    historyList.appendChild(listItem);
}

function updateTotalSpending(amount) {
    totalSpending += amount;
    document.getElementById('totalSpending').textContent = totalSpending.toFixed(2);
}

function saveTransaction(description, amount) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transaction = {
        id: new Date().getTime().toString(),
        description: description,
        amount: amount
    };
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactionHistory() {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.forEach(transaction => {
        addToHistory(transaction.description, transaction.amount, transaction.id);
        updateTotalSpending(transaction.amount);
    });
}

function deleteTransaction(id, amount) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Remove from display
    const listItem = document.getElementById(id);
    if (listItem) {
        listItem.remove();
    }

    // Update total spending
    totalSpending -= amount;
    document.getElementById('totalSpending').textContent = totalSpending.toFixed(2);
}
