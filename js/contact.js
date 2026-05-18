const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const hours = ['Closed','9am – 7pm','9am – 7pm','9am – 7pm','9am – 7pm','9am – 7pm','10am – 5pm'];
const today = new Date().getDay();
const table = document.getElementById('hours-table');
days.forEach((d, i) => {
  const tr = document.createElement('tr');
  if (i === today) tr.classList.add('today');
  tr.innerHTML = `<td>${d}${i === today ? ' (today)' : ''}</td><td>${hours[i]}</td>`;
  table.appendChild(tr);
});

// Chip toggle
function toggleChip(el) { el.classList.toggle('selected'); }

// Char count
function updateChar() {
  const v = document.getElementById('msg').value;
  document.getElementById('char-cnt').textContent = v.length;
  if (v.length > 400) document.getElementById('msg').value = v.slice(0,400);
}

// Validation
function validate() {
  let ok = true;
  const rules = [
    ['fname', v => v.trim().length >= 2, 'Please enter your first name.'],
    ['lname', v => v.trim().length >= 2, 'Please enter your last name.'],
    ['email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email.'],
    ['msg', v => v.trim().length >= 10, 'Please write at least 10 characters.'],
  ];
  rules.forEach(([id, test, msg]) => {
    const el = document.getElementById(id);
    const errEl = document.getElementById(id + '-err');
    if (!test(el.value)) {
      el.classList.add('error'); errEl.textContent = msg; ok = false;
    } else {
      el.classList.remove('error'); errEl.textContent = '';
    }
  });
  return ok;
}

// Submit
function submitForm() {
  if (!validate()) return;
  const btn = document.getElementById('submit-btn');
  btn.disabled = true; btn.textContent = 'Sending…';
  setTimeout(() => {
    document.getElementById('form-section').style.display = 'none';
    document.getElementById('success-card').style.display = 'block';
  }, 1200);
}

// FAQ accordion
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-q.open').forEach(b => { b.classList.remove('open'); b.nextElementSibling.classList.remove('open'); });
  if (!isOpen) { btn.classList.add('open'); answer.classList.add('open'); }
}

// Toast
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// Clear error on input
['fname','lname','email','msg'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(id).classList.remove('error');
    document.getElementById(id+'-err').textContent = '';
  });
});