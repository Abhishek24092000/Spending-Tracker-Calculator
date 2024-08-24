body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #121212;
    color: #e0e0e0;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.container {
    width: 90%;
    max-width: 800px;
    text-align: center;
    background-color: #1e1e1e;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    margin: 20px;
}

.calculator {
    margin-bottom: 20px;
}

#display {
    width: 100%;
    height: 50px;
    margin-bottom: 10px;
    text-align: right;
    padding: 10px;
    font-size: 24px;
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 5px;
    box-shadow: inset 0 0 5px #000;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

button.btn {
    padding: 15px 0;
    font-size: 18px;
    cursor: pointer;
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px #000;
    transition: all 0.1s ease;
}

button.btn.number {
    background: linear-gradient(to bottom, #4a4a4a, #333);
    color: #fff;
}

button.btn.operator {
    background: linear-gradient(to bottom, #d35400, #e67e22);
    color: white;
}

button.btn.equals {
    background: linear-gradient(to bottom, #27ae60, #2ecc71);
    color: white;
}

button.btn:hover {
    box-shadow: 0 2px #111;
    transform: translateY(-2px);
}

button.btn:active {
    box-shadow: 0 1px #111;
    transform: translateY(1px);
}

form {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

form input, form select {
    width: calc(100% - 24px);
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin: 5px 0;
}

form button {
    background-color: #2980b9;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: calc(100% - 24px);
    margin-top: 10px;
}

form button:hover {
    background-color: #3498db;
}

.history, .person-totals, .exceeded-limits {
    max-width: 100%;
    text-align: left;
    background-color: #1e1e1e;
    padding: 10px;
    border-radius: 5px;
    margin-top: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #333;
}

th {
    background-color: #333;
}

td {
    background-color: #444;
    color: #e0e0e0;
}

.exceeded-limits {
    text-align: center;
    color: #e74c3c;
}

.exceeded-limits .emoji {
    font-size: 50px;
    margin: 20px 0;
}

.exceeded-limits .exceeded-amount {
    font-size: 30px;
    color: #e74c3c;
}

h1, h2, h3 {
    margin: 0 0 10px 0;
}

/* Responsive Styles */
@media (max-width: 600px) {
    .container {
        max-width: 100%;
        padding: 15px;
    }

    button.btn {
        padding: 10px 0;
        font-size: 16px;
    }

    #display {
        font-size: 20px;
        height: 40px;
    }
}
