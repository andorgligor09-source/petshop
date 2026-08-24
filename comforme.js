const raw = sessionStorage.getItem('pawmart_order');
if (raw) {
  const o = JSON.parse(raw);

  // Items
  const list = document.getElementById('items-list');
  o.items.forEach(item => {
    const lineTotal = (item.price * item.qty).toFixed(2);
    list.innerHTML += `
      <div class="item-row">
        <div class="item-emoji">${item.emoji}</div>
        <div class="item-name">${item.name} <span style="color:var(--faint)">×${item.qty}</span></div>
        <div class="item-price">$${lineTotal}</div>
      </div>`;
  });

  // Totals
  document.getElementById('c-sub').textContent   = '$' + o.subtotal.toFixed(2);
  document.getElementById('c-ship').textContent  = o.shipCost === 0 ? 'Free' : '$' + o.shipCost.toFixed(2);
  document.getElementById('c-tax').textContent   = '$' + o.tax.toFixed(2);
  document.getElementById('c-total').textContent = '$' + o.total.toFixed(2);
  if (o.disc > 0) {
    document.getElementById('c-disc-row').style.display = 'flex';
    document.getElementById('c-disc').textContent = '−$' + o.disc.toFixed(2);
  }

  // Delivery
  document.getElementById('c-shipmethod').textContent = o.shipLabel + ' · ' + o.shipEta;

  // Estimate arrival date (today + days based on shipping)
  const days = o.shipCost === 0 ? 5 : o.shipCost < 10 ? 2 : 1;
  const arrival = new Date();
  arrival.setDate(arrival.getDate() + days);
  document.getElementById('c-eta').textContent = arrival.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
}

// Random order number
document.getElementById('c-ordernum').textContent = Math.floor(10000 + Math.random() * 90000);