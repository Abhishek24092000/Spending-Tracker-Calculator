let displayValue = '';
let totalSpending = 0;
let personTotals = {};
let personLimits = {}; // New object to store spending limits for each person

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
    
    // Check for new or existing person name
    const newPersonName = document.getElementById('newPersonName').value.trim();
    const existingPersonName = document.getElementById('existingPersonName').value.trim();
    const personName = newPersonName || existingPersonName; // Prefer new person if provided
    
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    if (description && !isNaN(amount)) {
        const transaction = { personName, description, amount, date, time };
        addToHistory(transaction);
        updateTotalSpending(amount);
        updatePersonTotal(transaction);
        saveTransaction(transaction);
        
        // Clear inputs
        document.getElementById('newPersonName').value = '';
        document.getElementById('existingPersonName').value = '';
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('date').value = '';
        document.getElementById('time').value = '';
        
        // Add new person to dropdown if a new person was entered
        if (newPersonName && !personTotals.hasOwnProperty(newPersonName)) {
            updatePersonDropdown();
        }
    }
});

function addToHistory(transaction, id = null) {
    const historyTable = document.getElementById('transactionHistory');
    const row = document.createElement('tr');
    const transactionId = id || new Date().getTime().toString();

    row.innerHTML = `
        <td>${transaction.personName || 'N/A'}</td>
        <td>${transaction.description}</td>
        <td>₹${transaction.amount.toFixed(2)}</td>
        <td>${transaction.date || 'N/A'}</td>
        <td>${transaction.time || 'N/A'}</td>
        <td><button onclick="deleteTransaction('${transactionId}', ${transaction.amount}, '${transaction.personName}')">Delete</button></td>
    `;
    row.id = transactionId;
    historyTable.appendChild(row);
}

function updateTotalSpending(amount) {
    totalSpending += amount;
    document.getElementById('totalSpending').textContent = totalSpending.toFixed(2);
}

function updatePersonTotal(transaction) {
    if (transaction.personName) {
        if (!personTotals[transaction.personName]) {
            personTotals[transaction.personName] = 0;
        }
        personTotals[transaction.personName] += transaction.amount;
        renderPersonTotals();
        updatePersonDropdown(); // Update dropdown only when totals change
        checkExceededLimits();  // Check if any limits are exceeded
    }
}

function renderPersonTotals() {
    const personTotalTable = document.getElementById('personTotalHistory');
    personTotalTable.innerHTML = ''; // Clear existing content
    for (const person in personTotals) {
        const total = personTotals[person];
        const limit = personLimits[person] || "No Limit Set";
        const status = limit === "No Limit Set" ? '😊' : total > limit ? '😡' : '😊'; // Red angry emoji: 😡

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${person}</td>
            <td><input type="number" value="${limit === "No Limit Set" ? '' : limit}" min="0" onchange="setSpendingLimit('${person}', this.value)"></td>
            <td>₹${total.toFixed(2)}</td>
            <td>${status}</td>
        `;
        personTotalTable.appendChild(row);
    }
}

function setSpendingLimit(person, limit) {
    if (limit) {
        personLimits[person] = parseFloat(limit);
    } else {
        delete personLimits[person];
    }
    renderPersonTotals();
    saveLimitsToLocalStorage();
    checkExceededLimits();  // Re-check limits when they are set or changed
}

function saveLimitsToLocalStorage() {
    localStorage.setItem('personLimits', JSON.stringify(personLimits));
}

function saveTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transaction.id = new Date().getTime().toString();
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactionHistory() {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    personLimits = JSON.parse(localStorage.getItem('personLimits')) || {}; // Load limits
    transactions.forEach(transaction => {
        addToHistory(transaction, transaction.id);
        updateTotalSpending(transaction.amount);
        updatePersonTotal(transaction);
    });
}

function updatePersonDropdown() {
    const personSelect = document.getElementById('existingPersonName');
    personSelect.innerHTML = '<option value="">Select Existing Person (Optional)</option>'; // Reset dropdown
    
    for (const person in personTotals) {
        const option = document.createElement('option');
        option.value = person;
        option.textContent = person;
        personSelect.appendChild(option);
    }
}

function deleteTransaction(id, amount, personName) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Remove from display
    const row = document.getElementById(id);
    if (row) {
        row.remove();
    }

    // Update total spending
    totalSpending -= amount;
    document.getElementById('totalSpending').textContent = totalSpending.toFixed(2);

    // Update person total
    if (personName && personTotals[personName]) {
        personTotals[personName] -= amount;
        if (personTotals[personName] <= 0) {
            delete personTotals[personName];
        }
        renderPersonTotals();
        updatePersonDropdown(); // Update dropdown when a person is removed
        checkExceededLimits();  // Re-check limits when a transaction is deleted
    }
}

function checkExceededLimits() {
    const exceededLimitsDisplay = document.getElementById('exceededLimitsDisplay');
    exceededLimitsDisplay.innerHTML = ''; // Clear existing content

    for (const person in personTotals) {
        const total = personTotals[person];
        const limit = personLimits[person];

        if (limit && total > limit) {
            const exceededAmount = total - limit;
            const bigEmojiDiv = document.createElement('div');
            bigEmojiDiv.className = 'emoji';
            bigEmojiDiv.innerHTML = `😡 ${person} (-₹${exceededAmount.toFixed(2)})`;
            exceededLimitsDisplay.appendChild(bigEmojiDiv);
        }
    }
}
