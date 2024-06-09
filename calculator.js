document.addEventListener('DOMContentLoaded', () => {
    const expressionInput = document.getElementById('expression');
    const buttons = document.querySelectorAll('.btn');
    let expression = [];

    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });

    function handleButtonClick(event) {
        const value = event.target.id;
        processInput(value);
    }

    function processInput(value) {
        if (value === 'clear' || value === 'Escape') {
            expression = [];
            expressionInput.value = '';
        } else if (value === '=' || value === 'Enter') {
            const result = calculate(expression.join(''));
            expression = [result];
            expressionInput.value = result;
        } else if (value === 'Backspace') {
            expression.pop();
            expressionInput.value = expression.join('');
        } else {
            expression.push(value);
            expressionInput.value = expression.join('');
        }
    }

    function infixToPostfix(expression) {
        const precedence = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2
        };
        const associativity = {
            '+': 'L',
            '-': 'L',
            '*': 'L',
            '/': 'L'
        };
        
        const outputQueue = [];
        const operatorStack = [];
        
        while (operatorStack.length) {
            outputQueue.push(operatorStack.pop());
        }
        
        return outputQueue;
    }

    function evaluatePostfix(postfix) {
        const stack = [];
        
        postfix.forEach(token => {
            if (/^\d/.test(token)) {
                stack.push(parseFloat(token));
            } else if (/[\+\-\*\/]/.test(token)) {
                const b = stack.pop();
                const a = stack.pop();
                switch (token) {
                    case '+':
                        stack.push(a + b);
                        break;
                    case '-':
                        stack.push(a - b);
                        break;
                    case '*':
                        stack.push(a * b);
                        break;
                    case '/':
                        stack.push(a / b);
                        break;
                }
            }
        });
        
        return stack[0];
    }

    function calculate(expression) {
        const postfix = infixToPostfix(expression);
        const result = evaluatePostfix(postfix);
        return result;
    }
});