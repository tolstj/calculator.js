/**
 *
 * calculator.js
 * Created 13.10.2020 by Nikita Tolstikov
 *
 */


window.addEventListener('load', () => {

  let calcOutput = document.getElementById('calcOutput');

  let calcButtons = {
    0: document.getElementById('btnNum0'),
    1: document.getElementById('btnNum1'),
    2: document.getElementById('btnNum2'),
    3: document.getElementById('btnNum3'),
    4: document.getElementById('btnNum4'),
    5: document.getElementById('btnNum5'),
    6: document.getElementById('btnNum6'),
    7: document.getElementById('btnNum7'),
    8: document.getElementById('btnNum8'),
    9: document.getElementById('btnNum9'),
    '+': document.getElementById('btnOperationPlus'),
    '-': document.getElementById('btnOperationMinus'),
    '*': document.getElementById('btnOperationMultiply'),
    '/': document.getElementById('btnOperationDivision'),
    '=': document.getElementById('btnSpecialCalc'),
    'C': document.getElementById('btnSpecialReset'),
    'CE': document.getElementById('btnSpecialCE'),
  };

  calculator = new Calculator(calcOutput, calcButtons);
});

class Calculator {
  constructor(output, buttons) {
    this.output = output;
    this.buttons = buttons;
    this.memory = [];

    for (let btnKey of Object.keys(this.buttons)) {
      this.buttons[btnKey].addEventListener('click', () => {
        this.processButton(btnKey);
      });
      this.buttons[btnKey].disabled = isNaN(Number(btnKey));
    }
  }

  processButton(btnKey) {
    if (/^\d$/.test(btnKey)) {
      this.processNumberInput(btnKey);
    } else if (/^[\+\-\*\/]$/.test(btnKey)) {
      this.processOperationInput(btnKey);
    } else if (/^[=C]$|^CE$/.test(btnKey)) {
      this.processSpecialInput(btnKey);
    }
  }

  processNumberInput(number) { // number is String
    if (!this.memory.length || this.isOperationLast()) {
      this.writeMemory(number, 'new');
    } else if (this.memory[this.memory.length-1] === '0') {
      this.writeMemory(number, 'replaceThis');
    } else {
      this.writeMemory(number, 'appendThis');
    }
  }

  processOperationInput(operation) {
    if (this.memory.length) {
      if (!this.isOperationLast()) {
        this.writeMemory(operation, 'new');
      } else {
        this.writeMemory(operation, 'replaceThis')
      }
    }
  }

  processSpecialInput(specialOperation) {
    if (specialOperation === '=') {
      this.calculate();
    } else if (specialOperation === 'C') {
      this.clear();
    } else if (specialOperation === 'CE') {
      this.clearEntry();
    }
  }

  writeMemory(value, method) { // method: 'new', 'appendThis', 'replaceThis'
    if (method === 'new') {
      this.memory.push(value);
    } else if (method === 'appendThis') {
      this.memory[this.memory.length-1] += value;
    } else if (method === 'replaceThis') {
      this.memory[this.memory.length-1] = value;
    }
    this.updateCalculator();
  }

  updateCalculator() {
    this.updateButtons();
    this.updateOutput();
  }

  updateButtons() {
    let buttonsOnRegExp = /^[0-9]$/;

    if (this.memory.length === 1 || (this.isOperationLast() && this.memory.length)) {
      buttonsOnRegExp = /^[+\-*\/C0-9]$|^CE$/;
    } else if (!this.isOperationLast()) {
      buttonsOnRegExp = /^[+\-*\/=C0-9]$|^CE$/;
    }

    for (let btnKey of Object.keys(this.buttons)) {
      if (buttonsOnRegExp.test(btnKey)) {
        this.buttons[btnKey].disabled = false;
      } else {
        this.buttons[btnKey].disabled = true;
      }
    }
  }

  updateOutput() {
    this.output.innerHTML = '';
    for (let block of this.memory) {
      this.output.innerHTML += block;
    }
  }

  isOperationLast() {
    return this.memory.length % 2 === 0;
  }

  clear() {
    this.memory = [];
    this.updateCalculator();
  }

  clearEntry() {
    if (this.isOperationLast()) {
      this.memory.pop();
    } else {
      this.memory[this.memory.length-1] = this.memory[this.memory.length-1].slice(0, -1);
      if (this.memory[this.memory.length-1].length === 0) {
        this.memory.pop();
      }
    }
    this.updateCalculator();
  }

  calculate() {
    ['/','*','-','+'].forEach((operation) => {
      for (let operationIndex = this.memory.indexOf(operation);
           operationIndex !== -1;
           operationIndex = this.memory.indexOf(operation)) {
        let arg1 = Number(this.memory[operationIndex - 1]);
        let arg2 = Number(this.memory[operationIndex + 1]);
        console.log(this.memory);
        let result;
        switch (operation) {
          case '/':
            result = arg1 / arg2;
            break;
          case '*':
            result = arg1 * arg2;
            break;
          case '-':
            result = arg1 - arg2;
            break;
          case '+':
            result = arg1 + arg2;
            break;
        }

        this.memory.splice(operationIndex-1, 3, String(result));
      }
    });
    this.updateCalculator();
  }
}
