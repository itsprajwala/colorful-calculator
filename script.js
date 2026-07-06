// script.js - calculator logic + animated symbol background
(() => {
  // Calculator logic
  const display = document.getElementById('display');
  const keys = document.querySelector('.keys');
  let current = '';
  let lastResult = null;

  function updateDisplay(text){ display.textContent = text; }

  function sanitizeExpression(expr){
    // Replace fancy operators with JS-friendly ones
    return expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/π/g, String(Math.PI));
  }

  function evaluateExpression(expr){
    try{
      const sanitized = sanitizeExpression(expr);
      // Disallow unsafe characters
      if (/[^0-9.+\-*/()%eE ]/.test(sanitized)) throw new Error('Invalid chars');
      // Use Function for slightly safer eval
      // handle percentage: convert 'number%' to '(number/100)'
      const withPercent = sanitized.replace(/(\d+(?:\.\d+)?)%/g,'($1/100)');
      // Evaluate
      // eslint-disable-next-line no-new-func
      const val = Function(`return ${withPercent}`)();
      if (!isFinite(val)) throw new Error('Math error');
      return +parseFloat(val.toFixed(12));
    }catch(e){
      return 'Error';
    }
  }

  function press(value){
    if (value === 'AC') { current=''; updateDisplay('0'); return }
    if (value === '⌫') { current = current.slice(0,-1); updateDisplay(current||'0'); return }
    if (value === '='){
      const res = evaluateExpression(current);
      updateDisplay(String(res));
      lastResult = res;
      current = String(res === 'Error' ? '' : res);
      return
    }

    // prevent multiple dots in the same number
    if (value === '.'){
      // find last token after operator
      const parts = current.split(/[+\-×÷*/]/);
      const last = parts[parts.length-1];
      if (last.includes('.')) return;
      if (last === '') value = '0.';
    }

    current += value;
    updateDisplay(current);
  }

  keys.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'clear') return press('AC');
    if (action === 'back') return press('⌫');
    if (action === 'equals') return press('=');
    const val = btn.dataset.value;
    press(val);
  });

  // keyboard support
  window.addEventListener('keydown', e => {
    if (/\d/.test(e.key)) return press(e.key);
    if (e.key === 'Enter') { e.preventDefault(); return press('='); }
    if (e.key === 'Backspace') return press('⌫');
    if (e.key === 'Escape') return press('AC');
    if (e.key === '.') return press('.');
    if (e.key === '%') return press('%');
    if (e.key === '+') return press('+');
    if (e.key === '-') return press('−');
    if (e.key === '*') return press('×');
    if (e.key === '/') return press('÷');
  });

  // Initialize display
  updateDisplay('0');

  // --- Animated background ---
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  let symbols = [];

  const SYMBOLS = ['+','−','×','÷','=','π','√','∑','∞','≈','∫','θ'];

  function resize(){
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.ceil(window.innerWidth * ratio);
    canvas.height = Math.ceil(window.innerHeight * ratio);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(ratio,0,0,ratio,0,0);
  }

  function makeSymbol(w, h){
    const size = Math.max(12, (Math.random()*36));
    return {
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()-0.5) * 0.6,
      vy: -0.2 - Math.random()*0.6,
      size,
      hue: Math.floor(Math.random()*360),
      char: SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)],
      alpha: 0.2 + Math.random()*0.6,
      spin: (Math.random()-0.5)*0.03
    };
  }

  function populate(intensity){
    const area = window.innerWidth * window.innerHeight;
    let count = 0;
    if (intensity === 'low') count = Math.round(area/8000);
    else if (intensity === 'medium') count = Math.round(area/4500);
    else count = Math.round(area/2600);
    symbols = new Array(count).fill(0).map(()=>makeSymbol(window.innerWidth, window.innerHeight));
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (let s of symbols){
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.spin);
      ctx.fillStyle = `hsla(${s.hue},80%,60%,${s.alpha})`;
      ctx.font = `${s.size}px system-ui,Segoe UI,Roboto`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.char, 0, 0);
      ctx.restore();

      s.x += s.vx;
      s.y += s.vy;
      s.hue = (s.hue + 0.1) % 360;
      s.spin += (Math.random()-0.5)*0.002;

      // wrap
      if (s.y < -50) s.y = window.innerHeight + 50;
      if (s.x < -50) s.x = window.innerWidth + 50;
      if (s.x > window.innerWidth + 50) s.x = -50;
    }
  }

  let animating = true;
  function loop(){
    if (animating) draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); populate(document.getElementById('intensity').value) });

  // intensity selector
  document.getElementById('intensity').addEventListener('change', e => {
    populate(e.target.value);
  });

  // start
  resize();
  populate(document.getElementById('intensity').value);
  loop();

})();
