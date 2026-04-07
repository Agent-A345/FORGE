/* ══════════════════════════════════════════
   FORGE — Code Playground
   script.js
   ══════════════════════════════════════════ */

'use strict';

/* ─── DOM References ─── */
const editors = {
  html: document.getElementById('editor-html'),
  css:  document.getElementById('editor-css'),
  js:   document.getElementById('editor-js'),
};

const gutters = {
  html: document.getElementById('gutter-html'),
  css:  document.getElementById('gutter-css'),
  js:   document.getElementById('gutter-js'),
};

const panes = {
  html: document.getElementById('pane-html'),
  css:  document.getElementById('pane-css'),
  js:   document.getElementById('pane-js'),
};

const tabs         = document.querySelectorAll('.tab');
const runBtn       = document.getElementById('run-btn');
const refreshBtn   = document.getElementById('refresh-btn');
const saveBtn      = document.getElementById('save-btn');
const exportBtn    = document.getElementById('export-btn');
const themeBtn     = document.getElementById('theme-btn');
const autorunToggle= document.getElementById('autorun-toggle');
const preview      = document.getElementById('preview');
const iframeWrap   = document.getElementById('iframe-wrap');
const consolePanel = document.getElementById('console-panel');
const consoleOutput= document.getElementById('console-output');
const consolTogBtn = document.getElementById('console-toggle');
const clearConsBtn = document.getElementById('clear-console-btn');
const logCountEl   = document.getElementById('log-count');
const toast        = document.getElementById('toast');
const consoleBar   = document.querySelector('.console-bar');
const modeBtns     = document.querySelectorAll('.mode-btn');
const filterBtns   = document.querySelectorAll('.filter-btn');
const templatesBtn = document.getElementById('templates-btn');
const templatesDd  = document.getElementById('templates-dropdown');
const libsBtn      = document.getElementById('libs-btn');
const libsDd       = document.getElementById('libs-dropdown');
const libBootstrap = document.getElementById('lib-bootstrap');
const libTailwind  = document.getElementById('lib-tailwind');
const libAnimate   = document.getElementById('lib-animate');

/* ─── State ─── */
let activeTab     = 'html';
let activeFilter  = 'all';
let autoRun       = true;
let logEntries    = [];
let debounceTimer = null;
let unsaved       = false;

/* ─── Default Code ─── */
const DEFAULT_CODE = {
  html: `<div id="app">
  <h1>Hello, Forge ⬡</h1>
  <p>Edit the code on the left and see it live here.</p>
  <button onclick="greet()">Click Me</button>
</div>`,

  css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #0f0f13;
  color: #e8eaf0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

#app {
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #7c6dfa, #f9826c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  color: #8b8fa8;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.6;
}

button {
  background: #7c6dfa;
  color: white;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;
}

button:hover {
  background: #9080ff;
  transform: translateY(-2px);
}`,

  js: `function greet() {
  console.log("Hello from Forge! 🔥");
  const app = document.getElementById("app");
  const msg = document.createElement("p");
  msg.textContent = "Button clicked at " + new Date().toLocaleTimeString();
  msg.style.marginTop = "1rem";
  msg.style.color = "#f9c943";
  app.appendChild(msg);
}

console.log("Playground ready ✓");`,
};

/* ─── Templates ─── */
const TEMPLATES = {
  empty: {
    html: `<div id="app"></div>`,
    css: `body {
  font-family: sans-serif;
  padding: 2rem;
}`,
    js: `// Your code here`,
  },

  landing: {
    html: `<nav>
  <div class="brand">MyBrand</div>
  <a href="#" class="cta-nav">Get Started</a>
</nav>

<header class="hero">
  <h1>Build Something <span class="accent">Incredible</span></h1>
  <p>The fastest way to go from idea to product.</p>
  <a href="#" class="cta-btn">Start Free →</a>
</header>

<section class="features">
  <div class="card">⚡ Fast</div>
  <div class="card">🔒 Secure</div>
  <div class="card">🎨 Beautiful</div>
</section>`,

    css: `* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', sans-serif;
  background: #07080d;
  color: #e8eaf0;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 3rem;
  border-bottom: 1px solid #1e2028;
}

.brand { font-weight: 800; font-size: 1.2rem; }

.cta-nav {
  color: #7c6dfa;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
}

.hero {
  text-align: center;
  padding: 5rem 2rem;
}

.hero h1 {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1rem;
}

.accent { color: #7c6dfa; }

.hero p {
  color: #8b8fa8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.cta-btn {
  display: inline-block;
  background: #7c6dfa;
  color: white;
  padding: 0.75rem 1.8rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 700;
  transition: all 150ms ease;
}

.cta-btn:hover {
  background: #9080ff;
  transform: translateY(-2px);
}

.features {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  padding: 3rem 2rem 5rem;
  flex-wrap: wrap;
}

.card {
  background: #14151a;
  border: 1px solid #2a2d3a;
  border-radius: 10px;
  padding: 1.5rem 2.5rem;
  font-weight: 700;
  font-size: 1rem;
  transition: all 200ms ease;
}

.card:hover {
  border-color: #7c6dfa;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(124,109,250,0.15);
}`,

    js: `console.log("Landing page loaded");`,
  },

  form: {
    html: `<div class="form-container">
  <h2>Contact Us</h2>
  <p>We'll get back to you within 24 hours.</p>

  <form id="contact-form">
    <div class="field">
      <label for="name">Name</label>
      <input type="text" id="name" placeholder="Jane Smith" />
    </div>
    <div class="field">
      <label for="email">Email</label>
      <input type="email" id="email" placeholder="jane@example.com" />
    </div>
    <div class="field">
      <label for="msg">Message</label>
      <textarea id="msg" rows="4" placeholder="Your message..."></textarea>
    </div>
    <button type="submit">Send Message →</button>
  </form>

  <div id="success" class="success hidden">✓ Message sent successfully!</div>
</div>`,

    css: `* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #0d0e11;
  color: #e8eaf0;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.form-container {
  width: 100%;
  max-width: 480px;
}

h2 {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
}

p {
  color: #8b8fa8;
  font-size: 0.875rem;
  margin-bottom: 2rem;
}

.field {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #8b8fa8;
  letter-spacing: 0.04em;
}

input, textarea {
  width: 100%;
  background: #14151a;
  border: 1px solid #2a2d3a;
  border-radius: 6px;
  padding: 0.65rem 0.9rem;
  color: #e8eaf0;
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 150ms;
  resize: none;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #7c6dfa;
  box-shadow: 0 0 0 3px rgba(124,109,250,0.12);
}

button[type="submit"] {
  width: 100%;
  background: #7c6dfa;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 150ms;
}

button:hover { background: #9080ff; }

.success {
  margin-top: 1.2rem;
  background: rgba(61,220,132,0.1);
  border: 1px solid rgba(61,220,132,0.3);
  color: #3ddc84;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.hidden { display: none; }`,

    js: `document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const msg = document.getElementById("msg").value;
  if (!name || !email || !msg) {
    console.warn("Please fill in all fields");
    return;
  }
  document.getElementById("success").classList.remove("hidden");
  this.reset();
  console.log("Form submitted:", { name, email });
});`,
  },

  animation: {
    html: `<div class="scene">
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>
  <div class="text">Forge</div>
</div>`,

    css: `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: #07080d;
  overflow: hidden;
  height: 100vh;
}

.scene {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: rgba(124, 109, 250, 0.4);
  animation-delay: 0s;
}

.orb-2 {
  width: 250px;
  height: 250px;
  background: rgba(249, 130, 108, 0.3);
  animation-delay: -2s;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: rgba(61, 220, 132, 0.25);
  animation-delay: -4s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(80px, -60px) scale(1.05);
  }
  66% {
    transform: translate(-60px, 40px) scale(0.95);
  }
}

.text {
  position: relative;
  z-index: 1;
  font-family: 'Segoe UI', sans-serif;
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 800;
  color: transparent;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.5) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  text-align: center;
}`,

    js: `console.log("CSS Animation — no JS needed here! 🎨");`,
  },

  clock: {
    html: `<div class="clock-container">
  <canvas id="clock" width="300" height="300"></canvas>
  <div id="time-label"></div>
</div>`,

    css: `* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: #0d0e11;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

.clock-container {
  text-align: center;
}

#time-label {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #505468;
  letter-spacing: 0.1em;
  font-weight: 600;
}`,

    js: `const canvas = document.getElementById("clock");
const ctx = canvas.getContext("2d");
const cx = 150, cy = 150, r = 130;

function draw() {
  const now = new Date();
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();
  const ms = now.getMilliseconds();

  ctx.clearRect(0, 0, 300, 300);

  // Face
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#14151a";
  ctx.fill();
  ctx.strokeStyle = "#2a2d3a";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Hour marks
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + Math.cos(a) * (r - 12);
    const y1 = cy + Math.sin(a) * (r - 12);
    const x2 = cx + Math.cos(a) * (r - 4);
    const y2 = cy + Math.sin(a) * (r - 4);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = i % 3 === 0 ? "#e8eaf0" : "#3a3d4d";
    ctx.lineWidth = i % 3 === 0 ? 2.5 : 1;
    ctx.stroke();
  }

  function hand(angle, length, width, color) {
    const x = cx + Math.cos(angle) * length;
    const y = cy + Math.sin(angle) * length;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  const hAngle = ((h + m / 60 + s / 3600) / 12) * Math.PI * 2 - Math.PI / 2;
  const mAngle = ((m + s / 60) / 60) * Math.PI * 2 - Math.PI / 2;
  const sAngle = ((s + ms / 1000) / 60) * Math.PI * 2 - Math.PI / 2;

  hand(hAngle, r * 0.55, 5, "#e8eaf0");
  hand(mAngle, r * 0.75, 3, "#8b8fa8");
  hand(sAngle, r * 0.85, 1.5, "#7c6dfa");

  // Center dot
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#7c6dfa";
  ctx.fill();

  document.getElementById("time-label").textContent =
    now.toLocaleTimeString("en-US", { hour12: true });

  requestAnimationFrame(draw);
}

draw();
console.log("Analog clock running ✓");`,
  },
};

/* ═══════════════════════════════════
   INIT
═══════════════════════════════════ */
function init() {
  loadFromLocalStorage();
  updateAllGutters();
  runPreview();

  // Tab switching
  tabs.forEach(t => {
    t.addEventListener('click', () => switchTab(t.dataset.lang));
  });

  // Editor input
  Object.entries(editors).forEach(([lang, el]) => {
    el.addEventListener('input', () => {
      updateGutter(lang);
      unsaved = true;
      if (autoRun) scheduleRun();
    });

    el.addEventListener('keydown', handleTabKey);
    el.addEventListener('scroll', () => syncGutterScroll(lang));
  });

  // Run / Refresh
  runBtn.addEventListener('click', runPreview);
  refreshBtn.addEventListener('click', runPreview);

  // Auto-run toggle
  autorunToggle.checked = autoRun;
  autorunToggle.addEventListener('change', () => {
    autoRun = autorunToggle.checked;
  });

  // Save
  saveBtn.addEventListener('click', () => {
    saveToLocalStorage();
    showToast('✓ Saved to localStorage');
  });

  // Export
  exportBtn.addEventListener('click', exportAsHtml);

  // Theme toggle
  themeBtn.addEventListener('click', switchTheme);

  // Console toggle
  consoleBar.addEventListener('click', (e) => {
    // Don't toggle if clicked on a button inside
    if (e.target.closest('button') && !e.target.closest('.console-toggle-btn')) return;
    consolePanel.classList.toggle('open');
    updateWorkspaceHeight();
  });

  clearConsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearConsole();
  });

  // Console filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderConsole();
    });
  });

  // Preview mode
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => setPreviewMode(btn.dataset.mode));
  });

  // Templates dropdown
  templatesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    libsDd.classList.remove('open');
    templatesDd.classList.toggle('open');
  });

  templatesDd.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      loadTemplate(item.dataset.template);
      templatesDd.classList.remove('open');
    });
  });

  // Libraries dropdown
  libsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    templatesDd.classList.remove('open');
    libsDd.classList.toggle('open');
  });

  [libBootstrap, libTailwind, libAnimate].forEach(cb => {
    cb.addEventListener('change', () => { if (autoRun) scheduleRun(); });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    templatesDd.classList.remove('open');
    libsDd.classList.remove('open');
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveToLocalStorage();
      showToast('✓ Saved');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runPreview();
    }
  });

  // Resizer
  setupResizer();

  // Listen for messages from iframe (console interception)
  window.addEventListener('message', handleIframeMessage);
}

/* ═══════════════════════════════════
   TAB SWITCHING
═══════════════════════════════════ */
function switchTab(lang) {
  activeTab = lang;
  tabs.forEach(t => t.classList.toggle('active', t.dataset.lang === lang));
  Object.entries(panes).forEach(([k, p]) => p.classList.toggle('active', k === lang));
  editors[lang].focus();
}

/* ═══════════════════════════════════
   LINE GUTTERS
═══════════════════════════════════ */
function updateGutter(lang) {
  const lines = editors[lang].value.split('\n').length;
  const gutter = gutters[lang];
  const current = gutter.childElementCount;

  if (lines > current) {
    const frag = document.createDocumentFragment();
    for (let i = current + 1; i <= lines; i++) {
      const span = document.createElement('div');
      span.textContent = i;
      frag.appendChild(span);
    }
    gutter.appendChild(frag);
  } else if (lines < current) {
    while (gutter.childElementCount > lines) {
      gutter.removeChild(gutter.lastChild);
    }
  }
}

function updateAllGutters() {
  Object.keys(editors).forEach(updateGutter);
}

function syncGutterScroll(lang) {
  gutters[lang].scrollTop = editors[lang].scrollTop;
}

/* ═══════════════════════════════════
   TAB KEY IN EDITOR
═══════════════════════════════════ */
function handleTabKey(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const el = e.target;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    el.value = el.value.substring(0, start) + '  ' + el.value.substring(end);
    el.selectionStart = el.selectionEnd = start + 2;
    // Trigger input event manually
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

/* ═══════════════════════════════════
   AUTO-RUN DEBOUNCE
═══════════════════════════════════ */
function scheduleRun() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runPreview, 400);
}

/* ═══════════════════════════════════
   BUILD & RUN PREVIEW
═══════════════════════════════════ */
function getLibraryLinks() {
  const links = [];
  const scripts = [];

  if (libBootstrap.checked) {
    links.push('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">');
    scripts.push('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"><\/script>');
  }
  if (libTailwind.checked) {
    scripts.push('<script src="https://cdn.tailwindcss.com"><\/script>');
  }
  if (libAnimate.checked) {
    links.push('<link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" rel="stylesheet">');
  }

  return { links: links.join('\n'), scripts: scripts.join('\n') };
}

function buildDocument() {
  const html = editors.html.value;
  const css  = editors.css.value;
  const js   = editors.js.value;
  const { links, scripts } = getLibraryLinks();

  const consoleShim = `
<script>
(function() {
  const methods = ['log', 'warn', 'error', 'info'];
  methods.forEach(function(method) {
    const orig = console[method].bind(console);
    console[method] = function() {
      const args = Array.from(arguments).map(function(a) {
        try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); }
        catch(e) { return String(a); }
      });
      window.parent.postMessage({ type: 'console', level: method, text: args.join(' ') }, '*');
      orig.apply(console, arguments);
    };
  });
  window.addEventListener('error', function(e) {
    window.parent.postMessage({ type: 'console', level: 'error', text: e.message + ' (line ' + e.lineno + ')' }, '*');
  });
})();
<\/script>`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${links}
<style>${css}</style>
${consoleShim}
${scripts}
</head>
<body>
${html}
<script>${js}<\/script>
</body>
</html>`;
}

function runPreview() {
  const doc = buildDocument();
  const iframeDoc = preview.contentDocument || preview.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(doc);
  iframeDoc.close();
}

/* ═══════════════════════════════════
   CONSOLE
═══════════════════════════════════ */
function handleIframeMessage(e) {
  if (!e.data || e.data.type !== 'console') return;
  addLogEntry(e.data.level, e.data.text);
}

function addLogEntry(level, text) {
  const entry = { level, text, time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) };
  logEntries.push(entry);
  updateLogCount();
  renderConsole();
}

function updateLogCount() {
  logCountEl.textContent = logEntries.length;
}

function renderConsole() {
  const filtered = activeFilter === 'all'
    ? logEntries
    : logEntries.filter(e => e.level === activeFilter);

  consoleOutput.innerHTML = '';
  filtered.forEach(e => {
    const row = document.createElement('div');
    row.className = `log-entry ${e.level}`;
    row.innerHTML = `
      <span class="log-icon">${iconForLevel(e.level)}</span>
      <span class="log-text">${escapeHtml(e.text)}</span>
      <span class="log-time">${e.time}</span>`;
    consoleOutput.appendChild(row);
  });
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function iconForLevel(level) {
  return { log: '›', warn: '⚠', error: '✕', info: 'ℹ' }[level] || '›';
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function clearConsole() {
  logEntries = [];
  consoleOutput.innerHTML = '';
  updateLogCount();
}

/* ═══════════════════════════════════
   LOCAL STORAGE
═══════════════════════════════════ */
function saveToLocalStorage() {
  localStorage.setItem('forge.html', editors.html.value);
  localStorage.setItem('forge.css',  editors.css.value);
  localStorage.setItem('forge.js',   editors.js.value);
  unsaved = false;
}

function loadFromLocalStorage() {
  const h = localStorage.getItem('forge.html');
  const c = localStorage.getItem('forge.css');
  const j = localStorage.getItem('forge.js');

  editors.html.value = h !== null ? h : DEFAULT_CODE.html;
  editors.css.value  = c !== null ? c : DEFAULT_CODE.css;
  editors.js.value   = j !== null ? j : DEFAULT_CODE.js;
}

/* ═══════════════════════════════════
   EXPORT
═══════════════════════════════════ */
function exportAsHtml() {
  const fullHtml = buildDocument();
  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'forge-export.html';
  a.click();
  URL.revokeObjectURL(url);
  showToast('✓ Exported as forge-export.html');
}

/* ═══════════════════════════════════
   TEMPLATES
═══════════════════════════════════ */
function loadTemplate(name) {
  const tpl = TEMPLATES[name];
  if (!tpl) return;
  editors.html.value = tpl.html;
  editors.css.value  = tpl.css;
  editors.js.value   = tpl.js;
  updateAllGutters();
  runPreview();
  showToast(`✓ Template "${name}" loaded`);
}

/* ═══════════════════════════════════
   THEME
═══════════════════════════════════ */
function switchTheme() {
  const html = document.documentElement;
  const cur = html.getAttribute('data-theme');
  html.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
}

/* ═══════════════════════════════════
   PREVIEW MODE
═══════════════════════════════════ */
function setPreviewMode(mode) {
  modeBtns.forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  iframeWrap.className = `iframe-wrap mode-${mode}`;
}

/* ═══════════════════════════════════
   RESIZER
═══════════════════════════════════ */
function setupResizer() {
  const resizer    = document.getElementById('resizer');
  const editorPane = document.getElementById('editor-panel');
  const workspace  = document.getElementById('workspace');

  let dragging = false;
  let startX = 0;
  let startW = 0;

  resizer.addEventListener('mousedown', (e) => {
    dragging = true;
    startX   = e.clientX;
    startW   = editorPane.offsetWidth;
    resizer.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const totalW = workspace.offsetWidth;
    const newW = Math.min(Math.max(startW + dx, 200), totalW - 200);
    editorPane.style.width = newW + 'px';
    editorPane.style.flex  = 'none';
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    resizer.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });
}

/* ═══════════════════════════════════
   WORKSPACE HEIGHT (console aware)
═══════════════════════════════════ */
function updateWorkspaceHeight() {
  const consoleH = consolePanel.classList.contains('open') ? 200 : 34;
  const workspace = document.getElementById('workspace');
  workspace.style.height = `calc(100vh - ${46}px - ${consoleH}px)`;
}

/* ═══════════════════════════════════
   TOAST
═══════════════════════════════════ */
let toastTimer = null;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ═══════════════════════════════════
   UNSAVED WARN
═══════════════════════════════════ */
window.addEventListener('beforeunload', (e) => {
  if (unsaved) {
    e.preventDefault();
    e.returnValue = '';
  }
});

/* ─── Boot ─── */
init();
