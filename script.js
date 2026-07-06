let display = document.getElementById('display');
let expression = '';

function appendNumber(num) {
    expression += num;
    updateDisplay();
}

function appendOperator(operator) {
    if (expression && !isLastCharOperator()) {
        expression += operator;
        updateDisplay();
    } else if (expression === '' && operator === '-') {
        expression = '-';
        updateDisplay();
    }
}

function appendDecimal() {
    const lastNumber = expression.split(/[+\-*/]/).pop();
    if (!lastNumber.includes('.')) {
        if (expression === '' || isLastCharOperator()) {
            expression += '0.';
        } else {
            expression += '.';
        }
        updateDisplay();
    }
}

function isLastCharOperator() {
    const lastChar = expression[expression.length - 1];
    return ['+', '-', '*', '/'].includes(lastChar);
}

function clearDisplay() {
    expression = '';
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    display.value = expression;
}

function calculate() {
    try {
        if (expression && !isLastCharOperator()) {
            // Replace display symbols with actual operators for calculation
            let calculation = expression;
            
            // Evaluate the expression safely
            const result = Function('"use strict"; return (' + calculation + ')')();
            
            // Handle floating point precision
            expression = Math.round(result * 100000000) / 100000000;
            updateDisplay();
        }
    } catch (error) {
        display.value = 'Error';
        expression = '';
        setTimeout(() => {
            display.value = '';
        }, 1500);
    }
}

// Keyboard Support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendDecimal();
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});