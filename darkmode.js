// PawMart / Pawsome — Dark Mode Toggle
(function () {
  const STORAGE_KEY = 'pawsome_theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const btn = document.getElementById('dm-toggle');
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    if (btn) btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }

  function getInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Apply immediately to avoid flash
  applyTheme(getInitialTheme());

  window.toggleDarkMode = function () {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };

  // Inject toggle button after DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    // Re-apply (in case script ran before <html> attr was readable)
    applyTheme(getInitialTheme());

    const btn = document.createElement('button');
    btn.id = 'dm-toggle';
    btn.className = 'dm-toggle';
    btn.onclick = window.toggleDarkMode;
    const theme = document.documentElement.getAttribute('data-theme');
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    document.body.appendChild(btn);
  });

  // Sync across tabs
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY && e.newValue) applyTheme(e.newValue);
  });
})();
