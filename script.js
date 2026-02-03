// Simple calculator logic
(function(){
  const displayEl = document.getElementById('display');
  const calculator = document.getElementById('calculator');
  let expr = ''; // expression string stored using JS operators (*, /)

  // Utility functions
  const operators = ['+', '-', '*', '/'];

  function updateDisplay(){
    if (!expr) {
      displayEl.textContent = '0';
      return;
    }
    // show user-friendly symbols
    const shown = expr.replace(/\*/g, '×').replace(/\//g, '÷');
    displayEl.textContent = shown;
  }

  function appendValue(val){
    // if val is operator, prevent duplicate operators
    const last = expr.slice(-1);
    if (operators.includes(val)) {
      if (!expr && val !== '-') return; // only allow leading minus
      if (operators.includes(last)) {
        // replace last operator with new one
        expr = expr.slice(0, -1) + val;
        updateDisplay();
        return;
      }
      expr += val;
      updateDisplay();
      return;
    }

    if (val === '.') {
      // avoid multiple decimals in the current number
      // find last operator index
      let lastOpIndex = -1;
      for (let i = expr.length - 1; i >= 0; i--) {
        if (operators.includes(expr[i])) { lastOpIndex = i; break; }
      }
      const currentNumber = expr.slice(lastOpIndex + 1);
      if (currentNumber.includes('.')) return;
      if (currentNumber === '') expr += '0'; // leading decimal -> 0.
      expr += '.';
      updateDisplay();
      return;
    }

    // normal number
    expr += val;
    updateDisplay();
  }

  function backspace(){
    expr = expr.slice(0, -1);
    updateDisplay();
  }

  function clearAll(){
    expr = '';
    updateDisplay();
  }

  function sanitizeExpression(e){
    // allow digits, parentheses, operators, decimal, percent, spaces
    // percent handled separately
    if (!/^[0-9+\-*/().%\s]*$/.test(e)) return null;
    return e;
  }

  function evaluateExpression(){
    if (!expr) return;
    // Replace percent x% with (x/100)
    let e = expr.replace(/([0-9.]+)%/g, '($1/100)');
    // Remove trailing operator(s)
    while (e.length && operators.includes(e.slice(-1))) e = e.slice(0, -1);
    const safe = sanitizeExpression(e);
    if (safe === null) {
      displayEl.textContent = 'Error';
      expr = '';
      return;
    }

    try {
      // Using Function to evaluate after sanitization. This is simple and OK for this toy app.
      const result = Function('"use strict"; return (' + safe + ')')();
      if (Number.isFinite(result)) {
        // Trim unnecessary decimal zeros
        expr = String(Number(String(result)));
        updateDisplay();
      } else {
        displayEl.textContent = 'Error';
        expr = '';
      }
    } catch (err) {
      displayEl.textContent = 'Error';
      expr = '';
    }
  }

  // Hook up buttons
  calculator.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button');
    if (!btn) return;
    const v = btn.getAttribute('data-value');
    const action = btn.getAttribute('data-action');

    if (action === 'clear') { clearAll(); return; }
    if (action === 'back') { backspace(); return; }
    if (action === 'calculate') { evaluateExpression(); return; }
    if (action === 'percent') {
      // If last token is number, append percent sign
      const last = expr.slice(-1);
      if (!expr || operators.includes(last)) return;
      expr += '%';
      updateDisplay();
      return;
    }
    if (v) appendValue(v);
  });

  // Keyboard support
  window.addEventListener('keydown', (ev) => {
    const key = ev.key;
    if ((/^[0-9]$/).test(key)) { appendValue(key); ev.preventDefault(); return; }
    if (key === '.') { appendValue('.'); ev.preventDefault(); return; }
    if (key === 'Enter' || key === '=') { evaluateExpression(); ev.preventDefault(); return; }
    if (key === 'Backspace') { backspace(); ev.preventDefault(); return; }
    if (key === 'Escape') { clearAll(); ev.preventDefault(); return; }
    if (key === '+' || key === '-' || key === '*' || key === '/') { appendValue(key); ev.preventDefault(); return; }
    if (key === '%') {
      // append percent if appropriate
      const last = expr.slice(-1);
      if (!expr || operators.includes(last)) return;
      expr += '%';
      updateDisplay();
      ev.preventDefault();
    }
  });

  // Initialize
  updateDisplay();
})();