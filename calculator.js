document.addEventListener("DOMContentLoaded", () => {
  const expressionInput = document.getElementById("expression");
  const buttons = document.querySelectorAll(".btn");
  let expression = [];

  buttons.forEach((button) => {
    button.addEventListener("click", handleButtonClick);
  });

  document.addEventListener("keydown", handleKeyPress);

  expressionInput.addEventListener("input", () => {
    // Automatically scroll the input field horizontally to the end
    expressionInput.scrollLeft = expressionInput.scrollWidth;
  });

  function handleButtonClick(event) {
    const value = event.target.id;
    processInput(value);
  }

  function handleKeyPress(event) {
    const key = event.key;
    const validKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "+",
      "-",
      "*",
      "/",
      ".",
      "Enter",
      "Backspace",
      "Escape",
    ];

    if (validKeys.includes(key)) {
      event.preventDefault(); // Prevent default action for certain keys
      if (key === "Enter") {
        processInput("=");
      } else if (key === "Backspace") {
        processInput("Backspace");
      } else if (key === "Escape") {
        processInput("clear");
      } else {
        processInput(key);
      }
    }
  }

  function processInput(value) {
    if (value === "clear" || value === "Escape") {
      expression = [];
      expressionInput.value = "";
    } else if (value === "=" || value === "Enter") {
      const result = calculate(expression.join(""));
      expression = [result];
      expressionInput.value = result;
    } else if (value === "Backspace") {
      expression.pop();
      expressionInput.value = expression.join("");
    } else {
      expression.push(value);
      expressionInput.value = expression.join("");
    }
  }

  function infixToPostfix(expression) {
    const precedence = {
      "+": 1,
      "-": 1,
      "*": 2,
      "/": 2,
    };
    const associativity = {
      "+": "L",
      "-": "L",
      "*": "L",
      "/": "L",
    };

    const outputQueue = [];
    const operatorStack = [];
    const tokens = expression.match(/\d+(\.\d+)?|\+|\-|\*|\/|\(|\)/g); // Update regular expression

    tokens.forEach((token) => {
      if (/^\d/.test(token)) {
        // Test if the token starts with a digit
        outputQueue.push(token);
      } else if (/[\+\-\*\/]/.test(token)) {
        while (
          operatorStack.length &&
          /[\+\-\*\/]/.test(operatorStack[operatorStack.length - 1]) &&
          ((associativity[token] === "L" &&
            precedence[token] <=
              precedence[operatorStack[operatorStack.length - 1]]) ||
            (associativity[token] === "R" &&
              precedence[token] <
                precedence[operatorStack[operatorStack.length - 1]]))
        ) {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.push(token);
      } else if (token === "(") {
        operatorStack.push(token);
      } else if (token === ")") {
        while (
          operatorStack.length &&
          operatorStack[operatorStack.length - 1] !== "("
        ) {
          outputQueue.push(operatorStack.pop());
        }
        operatorStack.pop();
      }
    });

    while (operatorStack.length) {
      outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
  }

  function evaluatePostfix(postfix) {
    const stack = [];

    postfix.forEach((token) => {
      if (/^\d/.test(token)) {
        // Test if the token starts with a digit
        stack.push(parseFloat(token));
      } else if (/[\+\-\*\/]/.test(token)) {
        const b = stack.pop();
        const a = stack.pop();
        switch (token) {
          case "+":
            stack.push(a + b);
            break;
          case "-":
            stack.push(a - b);
            break;
          case "*":
            stack.push(a * b);
            break;
          case "/":
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
