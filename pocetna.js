const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => observer.observe(r));

  // Pet emoji rotation in hero
  const pets = ['🐶','🐱','🐰','🐦','🐠','🐹','🦜','🐈'];
  let pi = 0;
  setInterval(() => {
    pi = (pi + 1) % pets.length;
    document.querySelector('.hero-circle').textContent = pets[pi];
  }, 2500);

  // Toast
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.opacity = 1; t.style.transform = 'translateY(0)';
    setTimeout(() => { t.style.opacity = 0; t.style.transform = 'translateY(100px)'; }, 3000);
  }

  function addToCart(name) { showToast('✅ Enquiry sent for ' + name + '!'); }

  function submitNewsletter(e) {
    e.preventDefault();
    const email = document.getElementById('nl-email').value;
    document.getElementById('nl-msg').textContent = '🎉 Welcome! Tips & deals are heading to ' + email;
    document.getElementById('nl-email').value = '';
  }