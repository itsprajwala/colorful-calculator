// script.js - basic calculator logic with keyboard support
(() => {
  const displayEl = document.getElementById('display');
  const historyEl = document.getElementById('history');
  const buttons = document.querySelectorAll('.btn');

  let current = '';
  let lastExpression = '';

  function updateDisplay(){
    displayEl.textContent = current === '' ? '0' : current;
  }

  function append(value){
    if(value === '.' && current.slice(-1) === '.') return;
    // Prevent multiple leading zeros
    if(current === '0' && value === '0') return;
    if(current === '0' && value !== '.' && /\d/.test(value)) current = value;
    else current += value;
    updateDisplay();
  }

  function applyOp(op){
    if(current === '' && lastExpression === '') return;
    // If last char of current is operator, replace it
    if(/[+\-*/]$/.test(current)){
      current = current.slice(0,-1) + op;
    } else {
      current += op;
    }
    updateDisplay();
  }

  function clearAll(){ current = ''; lastExpression = ''; historyEl.textContent = ''; updateDisplay(); }
  function backspace(){ if(current.length > 0) current = current.slice(0,-1); updateDisplay(); }

  function evaluate(){
    if(current === '') return;
    // Prepare expression: safe replace
    const expr = current.replace(/×/g,'*').replace(/÷/g,'/');
    // Remove trailing operator
    const safeExpr = expr.replace(/[+\-*/]+$/,'');
    try{
      // Very small sandbox: only numbers, parentheses, dots and operators allowed
      if(!/^[0-9+\-*/().\s]+$/.test(safeExpr)) throw new Error('Invalid characters');
      const result = Function('return ' + safeExpr)();
      if(result === Infinity || Number.isNaN(result)) throw new Error('Math error');
      historyEl.textContent = safeExpr + ' =';
      lastExpression = String(result);
      current = String(result);
      updateDisplay();
    }catch(e){
      displayEl.textContent = 'Error';
      current = '';
      console.error(e);
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', e => {
      const val = btn.dataset.value;
      const action = btn.dataset.action;
      if(action === 'clear') return clearAll();
      if(action === 'back') return backspace();
      if(action === 'equals') return evaluate();
      if(val){
        if(/^[0-9.]$/.test(val)) append(val);
        else if(/^[+\-*/]$/.test(val)) applyOp(val);
      }
    });
  });

  // Keyboard support
  window.addEventListener('keydown', e => {
    const k = e.key;
    if(/\d/.test(k)) append(k);
    else if(k === '.') append('.');
    else if(k === 'Backspace') backspace();
    else if(k === 'Enter' || k === '=') { e.preventDefault(); evaluate(); }
    else if(k === 'Escape') clearAll();
    else if(k === '+' || k === '-' || k === '*' || k === '/') applyOp(k);
  });

  // initialize
  clearAll();

})();
