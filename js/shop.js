const PRODUCTS = [
    { id:1, name:"Premium Dry Dog Food", desc:"Grain-free, high-protein formula for adult dogs.", cat:"food", pet:"dog", price:42, emoji:"🦴", tag:"fav" },
    { id:2, name:"Catnip Toy Bundle", desc:"Set of 5 irresistible catnip toys your cat will adore.", cat:"toys", pet:"cat", price:18, emoji:"🐱", tag:"sale", oldPrice:26 },
    { id:3, name:"Stainless Water Bowl", desc:"Non-slip, dishwasher-safe bowl for all pet sizes.", cat:"accessories", pet:"dog", price:14, emoji:"🥣", tag:"" },
    { id:4, name:"Pro Grooming Brush", desc:"Deshedding brush for long and short-haired breeds.", cat:"grooming", pet:"dog", price:29, emoji:"✂️", tag:"new" },
    { id:5, name:"Rabbit Pellet Mix", desc:"Balanced daily nutrition for small and large rabbits.", cat:"food", pet:"rabbit", price:12, emoji:"🐰", tag:"" },
    { id:6, name:"Interactive Laser Toy", desc:"Automatic rotating laser that keeps cats entertained.", cat:"toys", pet:"cat", price:35, emoji:"🔴", tag:"new" },
    { id:7, name:"Bird Seed Blend", desc:"Premium multi-seed mix for parrots, finches & more.", cat:"food", pet:"bird", price:9, emoji:"🦜", tag:"" },
    { id:8, name:"Flea & Tick Collar", desc:"8-month protection, waterproof and vet-approved.", cat:"health", pet:"dog", price:22, emoji:"💚", tag:"fav" },
    { id:9, name:"Aquarium Starter Kit", desc:"10-gallon tank with filter, light, and heater.", cat:"accessories", pet:"fish", price:79, emoji:"🐠", tag:"sale", oldPrice:95 },
    { id:10, name:"Cat Scratching Post", desc:"Sisal rope post with cozy top platform, 60cm tall.", cat:"accessories", pet:"cat", price:38, emoji:"🐈", tag:"" },
    { id:11, name:"Vitamin Supplement Drops", desc:"Daily vitamins for cats and dogs, chicken flavor.", cat:"health", pet:"dog", price:19, emoji:"💊", tag:"new" },
    { id:12, name:"Rabbit Hutch Bedding", desc:"Soft, absorbent bedding — odor-neutralizing formula.", cat:"accessories", pet:"rabbit", price:11, emoji:"🏠", tag:"" },
  ];
  
  let cart = [];
  let maxPrice = 100;
  
  function renderProducts(list) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    if (!list.length) {
      grid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;padding:2rem 0">No products match your filters.</p>';
      return;
    }
    list.forEach(p => {
      const tagHtml = p.tag ? `<span class="product-tag tag-${p.tag}">${p.tag === 'fav' ? '⭐ Fav' : p.tag}</span>` : '';
      const oldHtml = p.oldPrice ? `<span class="old">$${p.oldPrice}</span>` : '';
      grid.innerHTML += `
        <div class="product-card" id="pc${p.id}" data-cat="${p.cat}" data-pet="${p.pet}" data-price="${p.price}">
          <div class="product-emoji">${p.emoji}${tagHtml}</div>
          <div class="product-body">
            <div class="product-cat">${p.cat}</div>
            <div class="product-name">${p.name}</div>
            <div class="product-desc">${p.desc}</div>
            <div class="product-footer">
              <div class="product-price">${oldHtml} $${p.price}</div>
              <button class="add-btn" id="btn${p.id}" onclick="addToCart(${p.id})">Add +</button>
            </div>
          </div>
        </div>`;
    });
    document.getElementById('prod-count').textContent = `Showing ${list.length} product${list.length !== 1 ? 's' : ''}`;
  }
  
  function getChecked(name) {
    return [...document.querySelectorAll(`input[type=checkbox][value="${name}"]:checked`)].length > 0;
  }
  function getCheckedValues(inputs) {
    return [...inputs].filter(i => i.checked).map(i => i.value);
  }
  
  function filterProducts() {
    const catChecks = getCheckedValues(document.querySelectorAll('input[value="food"],input[value="toys"],input[value="grooming"],input[value="accessories"],input[value="health"]'));
    const petChecks = getCheckedValues(document.querySelectorAll('input[value="dog"],input[value="cat"],input[value="rabbit"],input[value="bird"],input[value="fish"]'));
  
    let filtered = PRODUCTS.filter(p => {
      if (catChecks.length && !catChecks.includes(p.cat)) return false;
      if (petChecks.length && !petChecks.includes(p.pet)) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
    renderProducts(filtered);
  }
  
  function updatePrice(val) {
    maxPrice = +val;
    document.getElementById('price-label').textContent = val;
    filterProducts();
  }
  
  function sortProducts(val) {
    const catChecks = getCheckedValues(document.querySelectorAll('input[value="food"],input[value="toys"],input[value="grooming"],input[value="accessories"],input[value="health"]'));
    const petChecks = getCheckedValues(document.querySelectorAll('input[value="dog"],input[value="cat"],input[value="rabbit"],input[value="bird"],input[value="fish"]'));
    let list = PRODUCTS.filter(p => {
      if (catChecks.length && !catChecks.includes(p.cat)) return false;
      if (petChecks.length && !petChecks.includes(p.pet)) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
    if (val === 'price-asc') list.sort((a,b) => a.price - b.price);
    if (val === 'price-desc') list.sort((a,b) => b.price - a.price);
    if (val === 'name') list.sort((a,b) => a.name.localeCompare(b.name));
    renderProducts(list);
  }
  
  function resetFilters() {
    document.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
    document.getElementById('price-slider').value = 100;
    maxPrice = 100;
    document.getElementById('price-label').textContent = '100';
    renderProducts(PRODUCTS);
  }
  
  function addToCart(id) {
    const p = PRODUCTS.find(x => x.id === id);
    const existing = cart.find(x => x.id === id);
    if (existing) { existing.qty++; } else { cart.push({...p, qty:1}); }
    updateCartUI();
    const btn = document.getElementById('btn' + id);
    btn.textContent = 'Added ✓'; btn.classList.add('added');
    setTimeout(() => { btn.textContent = 'Add +'; btn.classList.remove('added'); }, 1500);
    showToast('🛒 ' + p.name + ' added to cart!');
  }
  
  function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    updateCartUI();
  }
  
  function updateCartUI() {
    const count = cart.reduce((s, x) => s + x.qty, 0);
    const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
    document.getElementById('cart-count').textContent = count;
    document.getElementById('cart-total').textContent = '$' + total.toFixed(2);
    const itemsEl = document.getElementById('cart-items');
    if (!cart.length) { itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty 🐾</p>'; return; }
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <span class="cart-item-emoji">${item.emoji}</span>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name} ${item.qty > 1 ? '×'+item.qty : ''}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
      </div>`).join('');
  }
  
  function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('open');
  }
  
  function checkout() {
    if (!cart.length) { showToast('Your cart is empty!'); return; }
    localStorage.setItem('pawsome_cart', JSON.stringify(
      cart.map(item => ({
        id: item.id,
        name: item.name,
        emoji: item.emoji,
        desc: item.desc,
        price: item.price,
        qty: item.qty,
      }))
    ));
    window.location.href = 'checkout.html';
  }
  
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }
  
  // Initial render
  renderProducts(PRODUCTS);
  updateCartUI();