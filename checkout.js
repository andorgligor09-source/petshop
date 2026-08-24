let shipCost = 5.99;
  let discOn = false;
  let subtotal = 0;

  function calc() {
    const tax = Math.round((subtotal + shipCost) * 0.08 * 100) / 100;
    const disc = discOn ? Math.round(subtotal * 0.10 * 100) / 100 : 0;
    const total = Math.round((subtotal + shipCost + tax - disc) * 100) / 100;
    document.getElementById('s-sub').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('s-ship').textContent = shipCost === 0 ? 'Free' : '$' + shipCost.toFixed(2);
    document.getElementById('s-tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('s-total').textContent = '$' + total.toFixed(2);
    document.getElementById('pay-label').textContent = 'Place order · $' + total.toFixed(2);
    if (discOn) {
      document.getElementById('s-disc-row').style.display = 'flex';
      document.getElementById('s-disc').textContent = '−$' + disc.toFixed(2);
    }
  }

  function selShip(el, cost) {
    document.querySelectorAll('.sopt').forEach(o => {
      o.classList.remove('sel');
      const d = o.querySelector('.dot');
      d.classList.remove('on');
      d.innerHTML = '';
    });
    el.classList.add('sel');
    el.querySelector('.dot').classList.add('on');
    shipCost = cost;
    calc();
  }

  function selPay(el) {
    document.querySelectorAll('.pm').forEach(m => m.classList.remove('active'));
    el.classList.add('active');
  }

  function chgQ(btn, delta) {
    const n = btn.parentElement.querySelector('.qnum');
    let q = parseInt(n.textContent) + delta;
    if (q < 1) q = 1;
    n.textContent = q;
    let newSub = 0;
    document.querySelectorAll('.cart-item[data-price]').forEach(row => {
      const p = parseFloat(row.dataset.price);
      const qty = parseInt(row.querySelector('.qnum').textContent);
      row.querySelector('.iprice').textContent = '$' + (p * qty).toFixed(2);
      newSub += p * qty;
    });
    subtotal = Math.round(newSub * 100) / 100;
    calc();
  }

  function fmtCard(el) {
    let v = el.value.replace(/\D/g, '').substring(0, 16);
    el.value = v.replace(/(.{4})/g, '$1  ').trim();
  }

  function fmtExp(el) {
    let v = el.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2);
    el.value = v;
  }

  function applyCoup() {
    const code = document.getElementById('coup-in').value.trim().toUpperCase();
    if ((code === 'PAW10' || code === 'PETS10') && !discOn) {
      discOn = true;
      document.getElementById('coup-ok').style.display = 'block';
      calc();
    }
  }

  function doPay() {
    const btn = document.getElementById('pay-btn');
    btn.style.background = '#1D9E75';
    btn.style.cursor = 'default';
    document.getElementById('pay-label').textContent = '✓ Placing order…';

    // Collect current cart state
    const items = [];
    document.querySelectorAll('.cart-item[data-price]').forEach(row => {
      items.push({
        emoji: row.querySelector('.iimg').textContent.trim(),
        name:  row.querySelector('.iname').textContent.trim(),
        meta:  row.querySelector('.imeta').textContent.trim(),
        price: parseFloat(row.dataset.price),
        qty:   parseInt(row.querySelector('.qnum').textContent)
      });
    });
    const selOpt   = document.querySelector('.sopt.sel');
    const shipLabel = selOpt ? selOpt.querySelector('.sname').textContent.trim() : 'Express';
    const shipEta   = selOpt ? selOpt.querySelector('.seta').textContent.trim()  : '1-2 business days';
    const tax  = Math.round((subtotal + shipCost) * 0.08 * 100) / 100;
    const disc = discOn ? Math.round(subtotal * 0.10 * 100) / 100 : 0;
    const total = Math.round((subtotal + shipCost + tax - disc) * 100) / 100;
    sessionStorage.setItem('pawmart_order', JSON.stringify(
      { items, shipCost, shipLabel, shipEta, subtotal, tax, disc, total }
    ));
    setTimeout(() => { window.location.href = 'confirmation.html'; }, 800);
  }

  // Demo items shown when no localStorage cart exists
  const DEMO = [
    { emoji: '🐱', name: 'Royal Canin adult dry food', meta: '15 lb · Chicken',    price: 54.99, qty: 1 },
    { emoji: '🦮', name: 'Reflective safety collar',   meta: 'Medium · Green',      price: 18.99, qty: 1 },
    { emoji: '🧸', name: 'Squeaky plush fox toy',      meta: 'Large',               price:  5.99, qty: 2 },
    { emoji: '🧴', name: 'Flea & tick shampoo',        meta: '500 ml · All breeds', price: 14.49, qty: 1 },
  ];

  function renderItem(item) {
    const lineTotal = (item.price * item.qty).toFixed(2);
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.dataset.price = item.price;
    div.innerHTML = `
      <div class="iimg">${item.emoji}</div>
      <div class="iinfo">
        <div class="iname">${item.name}</div>
        <div class="imeta">${item.meta || ''}</div>
        <div class="qctrl">
          <button class="qbtn" onclick="chgQ(this,-1)">−</button>
          <span class="qnum">${item.qty}</span>
          <button class="qbtn" onclick="chgQ(this,1)">+</button>
        </div>
      </div>
      <div class="iprice">$${lineTotal}</div>`;
    return div;
  }

  (function init() {
    let cartData = [];
    try { const r = localStorage.getItem('pawsome_cart'); if (r) cartData = JSON.parse(r); } catch(e) {}
    if (!cartData.length) cartData = DEMO;

    const panel = document.getElementById('basket-panel');
    const titleEl = document.getElementById('basket-title');
    const totalQty = cartData.reduce((s, i) => s + i.qty, 0);
    titleEl.textContent = `Your basket (${totalQty} item${totalQty !== 1 ? 's' : ''})`;

    subtotal = 0;
    cartData.forEach(item => {
      panel.appendChild(renderItem(item));
      subtotal += item.price * item.qty;
    });
    subtotal = Math.round(subtotal * 100) / 100;
    calc();
  })();