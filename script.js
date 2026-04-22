/* ═══════════════════════════════════════════════
   NEXUS HOME v2 — script.js
   All effects: Cosmic, 3D, Micro-interactions,
   Parallax, Reveal, Cursor, Loader, Charts...
═══════════════════════════════════════════════ */
'use strict';

/* ══════════ CONSTANTS & DATA ══════════ */
const DATA = {
  temp: 16 + Math.round(Math.random() * 12),
  energyTotal: 0,
  rooms: {
    living:  ['Main', 'Accent', 'TV', 'Lamp'],
    bedroom: ['Ceiling', 'L Side', 'R Side', 'Wardrobe'],
    kitchen: ['Counter', 'Overhead', 'Dining', 'Cabinet'],
    garage:  ['Main', 'Workbench', 'Entry', 'Exterior'],
    garden:  ['Path', 'Pool', 'Pergola', 'Security'],
  },
  lightStates: {},
  secEvents: [
    'Motion – Kitchen – 2 mins ago',
    'Front door unlocked – 8:42 AM',
    'Package detected at porch – 11:15 AM',
    'Garage closed – Auto – 9 PM',
    'Window sensor – Living Room – 6 hrs ago',
    'Visitor at front porch – Just now',
    'All clear – No anomalies detected',
  ],
  insights: [
    ['⚡', 'Home is 12% more efficient than yesterday.'],
    ['💡', 'Bedroom lights on for 3+ hours.'],
    ['🌡', 'Temperature optimal for sleep.'],
    ['🔒', 'All entry points secured. No alerts.'],
    ['📊', 'Peak energy usage detected at 7 PM.'],
    ['🌿', 'Garden irrigation scheduled in 2 hrs.'],
    ['🎛', 'Living room AC on 40 min — auto-off set.'],
    ['🔌', 'Fridge door open 2 min at 11 AM.'],
    ['🌙', 'Night mode activates at 10:30 PM.'],
    ['📡', '3 devices updated firmware overnight.'],
    ['💧', 'Humidity at 58% — comfortable range.'],
    ['☀️', 'Solar panels: 4.2 kWh this morning.'],
  ],
  schedules: [
    { t:'06:30', d:'Bedroom Lights', i:'💡', s:'done' },
    { t:'07:00', d:'Coffee Machine', i:'☕', s:'done' },
    { t:'08:00', d:'AC – Living Room', i:'❄', s:'done' },
    { t:'12:00', d:'Garden Irrigation', i:'💧', s:'run' },
    { t:'14:30', d:'Robot Vacuum', i:'🤖', s:'up' },
    { t:'18:00', d:'Porch Lights', i:'🌆', s:'up' },
    { t:'22:00', d:'Night Mode', i:'🌙', s:'up' },
    { t:'23:00', d:'All Lights OFF', i:'🔌', s:'up' },
  ],
  weatherOpts: ['☁ Partly Cloudy · 26°C','☀ Sunny · 31°C','🌦 Light Rain · 22°C','🌤 Mostly Clear · 28°C'],
};

/* ══════════ UTILITY ══════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const raf = requestAnimationFrame;
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const randInt = (a, b) => Math.floor(rand(a, b + 1));

function animNum(el, from, to, dur = 800) {
  const start = performance.now();
  const step = ts => {
    const p = clamp((ts - start) / dur, 0, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (to - from) * e);
    if (p < 1) raf(step);
  };
  raf(step);
}

function ripple(el, e) {
  const r = document.createElement('span');
  r.className = 'ripple-effect';
  const size = Math.max(el.offsetWidth, el.offsetHeight);
  const rect = el.getBoundingClientRect();
  r.style.cssText = `width:${size}px;height:${size}px;left:${(e?.clientX??rect.left+rect.width/2)-rect.left-size/2}px;top:${(e?.clientY??rect.top+rect.height/2)-rect.top-size/2}px`;
  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(r);
  setTimeout(() => r.remove(), 700);
}

function typewrite(el, text, speed = 30) {
  if (el._typeIv) clearInterval(el._typeIv);
  el.textContent = '';
  let i = 0;
  el._typeIv = setInterval(() => {
    if (i < text.length) el.textContent += text[i++];
    else clearInterval(el._typeIv);
  }, speed);
}

/* ══════════ LOADER (Cosmic) ══════════ */
(function initLoader() {
  window.scrollTo(0, 0); 
  document.body.style.overflow = 'hidden';
  const loader = $('#loader');
  const canvas = $('#loaderCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const bar = $('#loaderBar');
  const status = $('#loaderStatus');

  if (!loader) return;

  const msgs = ['Calibrating sensors...', 'Connecting devices...', 'Loading AI core...', 'System ready.'];
  let msgIdx = 0, stars = [], progress = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  // Generate stars for loader cosmos
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: rand(0, canvas.width), y: rand(0, canvas.height),
      r: rand(0.2, 1.5), speed: rand(0.1, 0.5), alpha: rand(0.1, 0.7),
      pulseDur: rand(1500, 4000), phaseOffset: rand(0, Math.PI * 2),
    });
  }

  let t = 0;
  function drawLoader(ts) {
    if (!document.getElementById('loader')) return;
    t = ts || 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark cosmos bg
    const bg = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width * 0.7);
    bg.addColorStop(0, 'rgba(12,16,32,1)');
    bg.addColorStop(1, 'rgba(5,7,15,1)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    stars.forEach(s => {
      const alpha = s.alpha * (0.5 + 0.5 * Math.sin(t / s.pulseDur * Math.PI * 2 + s.phaseOffset));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
      s.y += s.speed * 0.2;
      if (s.y > canvas.height) s.y = 0;
    });

    // Center nebula glow
    const glow = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, 300);
    glow.addColorStop(0, 'rgba(79,172,254,0.06)');
    glow.addColorStop(0.5, 'rgba(155,113,255,0.03)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    raf(drawLoader);
  }
  raf(drawLoader);

  // Progress
  const intervals = [
    [300, 25, msgs[0]],
    [700, 55, msgs[1]],
    [1100, 80, msgs[2]],
    [1600, 100, msgs[3]],
  ];
  intervals.forEach(([delay, pct, msg]) => {
    setTimeout(() => {
      bar.style.width = pct + '%';
      status.textContent = msg;
    }, delay);
  });

  // Pre-initialize background effects
  try {
    // Background effects removed per request
  } catch(e) { console.warn("Background pre-init failed", e); }

  // Safe Transition
  setTimeout(() => {
    if (loader) {
      loader.classList.add('exit');
      document.body.style.overflow = '';
      setTimeout(() => { if(loader.parentNode) loader.remove(); }, 1000);
    }
    
    try {
      initAll();
    } catch(e) {
      console.error("Critical: initAll failed", e);
    }
  }, 2200);
})();

/* ══════════ MAIN INIT ══════════ */
function initAll() {
  // initCosmicCursor removed per request
  initChatbot();
  initQuiz();
  initScrollProgress();
  initNavbar();
  initClock();
  initReveal();
  initTilt();
  initParallax();
  initHeroOrb();
  initRoomTabs();
  buildLightsGrid('living');
  initTemperature();
  initSecurity();
  initEnergyChart();
  initCameras();
  initAI();
  initSchedule();
  initTheme();
  initHeroStats();
  initMagnetic();
  initWeather();
  initMood();
  initBrightness();
  initMedia();
}

/* ══════════ COSMIC QUIZ LOGIC ══════════ */
function initQuiz() {
  const qData = [
    { q: "Which gas makes up 78% of Earth's atmosphere?", o: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"], a: 1 },
    { q: "How much energy does an LED save vs incandescent?", o: ["25%", "50%", "75%", "90%"], a: 3 },
    { q: "What is the average surface temp of the Moon?", o: ["-10°C", "-153°C to 127°C", "0°C", "100°C"], a: 1 }
  ];
  let cur = 0;
  
  const qEl = $('#quizQuestion');
  const oEl = $('#quizOptions');
  const rEl = $('#quizResult');

  function loadQ() {
    if (cur >= qData.length) {
      qEl.textContent = "Quiz Complete!";
      oEl.innerHTML = "";
      rEl.textContent = "You're a Cosmic Master. Your home efficiency has increased by 5%.";
      rEl.classList.remove('hidden');
      return;
    }
    const { q, o } = qData[cur];
    qEl.textContent = q;
    oEl.innerHTML = "";
    o.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.textContent = opt;
      btn.onclick = () => {
        if (i === qData[cur].a) {
          btn.classList.add('correct');
          setTimeout(() => { cur++; loadQ(); }, 1000);
        } else {
          btn.classList.add('wrong');
          rEl.textContent = "Try again!";
          rEl.classList.remove('hidden');
          setTimeout(() => rEl.classList.add('hidden'), 2000);
        }
      };
      oEl.appendChild(btn);
    });
  }
  loadQ();
}

/* ══════════ MOOD LOGIC ══════════ */
function initMood() {
  const btns = $$('.mood-btn');
  const feed = $('#moodFeedback span');
  
  const messages = {
    zen: "Zen Mode: Do Not Disturb activated.",
    focus: "Focus Mode: Notifications silenced for deep work.",
    party: "Party Mode: Audio-visual synchronization enabled.",
    sleep: "Sleep Mode: Main systems dimmed. Night-watch active."
  };

  function showToast(msg, mood) {
    let t = $('.cosmic-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'cosmic-toast';
      t.innerHTML = `<div class="toast-ico">◈</div><div class="toast-msg"></div>`;
      document.body.appendChild(t);
    }
    const ico = t.querySelector('.toast-ico');
    ico.textContent = mood === 'zen' ? '🧘' : mood === 'focus' ? '⚡' : mood === 'party' ? '🎉' : '🌙';
    t.querySelector('.toast-msg').textContent = msg;
    t.classList.add('show');
    
    if (t._timer) clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
  }
  
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.mood;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (feed) feed.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
      
      showToast(messages[mood], mood);
      ripple(btn);
      
      // Visual feedback
      const flash = document.createElement('div');
      flash.style.cssText = `position:fixed;inset:0;background:var(--a-cyan);opacity:0.04;z-index:9999;pointer-events:none;`;
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 400);
    });
  });
}

/* ══════════ STAR FIELD ══════════ */
function initStars() {
  const sf = $('#starField');
  if (!sf) return;
  for (let i = 0; i < 120; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = rand(0.5, 2.5);
    const baseOp = rand(0.15, 0.6);
    star.style.cssText = `
      width:${size}px;height:${size}px;
      left:${rand(0,100)}%;top:${rand(0,100)}%;
      --base-op:${baseOp};
      --tw-dur:${rand(2,6)}s;
      --tw-delay:${rand(0,5)}s;
    `;
    sf.appendChild(star);
  }
}

/* ══════════ ENHANCED COSMOS ENGINE (Guaranteed Infinite) ══════════ */
let cosmosRunning = false;
function initCosmosCanvas() {
  if (cosmosRunning) return;
  const canvas = $('#cosmosCanvas');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  
  let W, H, particles = [], mouseX = -999, mouseY = -999;
  let shootingStars = [];
  let rafId = null;
  let lastTs = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  class CosmicParticle {
    constructor() { this.init(); }
    init() {
      this.x = rand(0, W); this.y = rand(0, H);
      this.vx = rand(-0.3, 0.3); this.vy = rand(-0.3, 0.3);
      this.r = rand(0.5, 3.5);
      this.alpha = rand(0.3, 0.8);
      this.color = Math.random() > 0.6 ? '155,113,255' : Math.random() > 0.5 ? '0,245,196' : '79,172,254';
    }
    update(delta = 1) {
      const dx = this.x - mouseX, dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      if (dist < 150) {
        const force = (150 - dist) / 150;
        this.vx += (dx / dist) * force * 0.8 * delta;
        this.vy += (dy / dist) * force * 0.8 * delta;
      }
      this.vx *= 0.99; this.vy *= 0.99;
      this.x += this.vx * delta; 
      this.y += this.vy * delta;

      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  function loop(ts) {
    if (!cosmosRunning) return;
    const delta = ts ? (ts - (lastTs || ts)) / 16.6 : 1;
    lastTs = ts;

    ctx.clearRect(0, 0, W, H);
    
    // Shooting stars
    if (Math.random() > 0.98) {
      shootingStars.push({
        x: rand(0, W), y: rand(0, H * 0.5),
        len: rand(30, 80), speed: rand(10, 20),
        angle: Math.PI / 4, alpha: 1
      });
    }
    shootingStars = shootingStars.filter(s => s.alpha > 0 && !isNaN(s.alpha));
    shootingStars.forEach(s => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(155,113,255,${s.alpha})`;
      ctx.lineWidth = 1.5;
      const tX = s.x - Math.cos(s.angle) * s.len;
      const tY = s.y - Math.sin(s.angle) * s.len;
      ctx.moveTo(s.x, s.y); ctx.lineTo(tX, tY);
      ctx.stroke();
      s.x += Math.cos(s.angle) * s.speed * delta;
      s.y += Math.sin(s.angle) * s.speed * delta;
      s.alpha -= 0.012 * delta;
    });

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update(delta); p.draw();
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x, dy = p.y - p2.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(79,172,254,${0.15 * (1 - d / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    rafId = raf(loop);
  }

  function start() {
    if (cosmosRunning) return;
    cosmosRunning = true;
    if (particles.length === 0) particles = Array.from({length: 120}, () => new CosmicParticle());
    rafId = raf(loop);
  }

  function stop() {
    cosmosRunning = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  start();
}

/* ══════════ COSMIC CURSOR ══════════ */
function initCosmicCursor() {
  const canvas = $('#cursorCanvas');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  let W, H;
  let particles = [];
  let mouse = { x: -100, y: -100, active: false };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    // Continuous stardust
    for(let i=0; i<5; i++) particles.push(new CursorParticle(mouse.x, mouse.y));
  });

  document.addEventListener('mousedown', () => {
    for(let i=0; i<20; i++) particles.push(new CursorParticle(mouse.x, mouse.y, true));
  });

  class CursorParticle {
    constructor(x, y, burst = false) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = burst ? rand(2, 6) : rand(0.5, 2);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.life = 1.0;
      this.decay = rand(0.01, 0.03);
      this.size = rand(1, 4);
      this.color = Math.random() > 0.5 ? '79,172,254' : '155,113,255';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      this.vx *= 0.98;
      this.vy *= 0.98;
    }
    draw() {
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2 * this.life);
      g.addColorStop(0, `rgba(${this.color},${this.life * 0.9})`);
      g.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2 * this.life, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
  }

  function render() {
    ctx.clearRect(0,0,W,H);
    
    // Core dot
    if (mouse.active) {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#4FACFE';
      ctx.fill();
    }

    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    raf(render);
  }
  render();
}

/* ══════════ CHATBOT LOGIC ══════════ */
function initChatbot() {
  const nexusChat = $('#nexusChat');
  const chatToggle = $('#chatToggle');
  const chatClose = $('#chatClose');
  const chatInput = $('#chatInput');
  const chatSend = $('#chatSend');
  const chatBody = $('#chatBody');

  if (!nexusChat) return;

  const toggle = () => nexusChat.classList.toggle('open');
  chatToggle.addEventListener('click', toggle);
  chatClose.addEventListener('click', toggle);

  function addMsg(text, type = 'bot') {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${type}`;
    const now = new Date();
    const ts = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
    msg.innerHTML = `
      <div class="msg-content">${text}</div>
      <div class="msg-ts">${ts}</div>
    `;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Animate in
    msg.style.opacity = '0';
    msg.style.transform = 'translateY(10px)';
    setTimeout(() => {
      msg.style.transition = 'all 0.3s var(--ease-out)';
      msg.style.opacity = '1';
      msg.style.transform = 'translateY(0)';
    }, 10);
  }

  const handleSend = () => {
    const val = chatInput.value.trim();
    if (!val) return;
    addMsg(val, 'user');
    chatInput.value = '';

    // Simulated AI Response
    setTimeout(() => {
      let resp = "I'm processing your request regarding " + val + "...";
      if (val.toLowerCase().includes('energy')) resp = `Current energy usage is ${DATA.energyTotal}W. System is optimized for 12% savings.`;
      else if (val.toLowerCase().includes('temp')) resp = `Temperature is maintained at ${DATA.temp}°C across all occupied zones.`;
      else if (val.toLowerCase().includes('light')) resp = "All smart lighting systems are responding. Would you like to adjust brightness?";
      else if (val.toLowerCase().includes('secure')) resp = "Security protocols active. All perimeters checked and verified.";
      else resp = "Nexus AI at your service. I've logged your request and am updating home presets accordingly.";
      
      addMsg(resp, 'bot');
    }, 800);
  };

  chatSend.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleSend(); });

  // Floating bounce animation
  let floatTime = 0;
  function animateFloat() {
    floatTime += 0.05;
    const y = Math.sin(floatTime) * 5;
    if (!nexusChat.classList.contains('open')) {
      chatToggle.style.transform = `translateY(${y}px)`;
    }
    raf(animateFloat);
  }
  animateFloat();
}

/* ══════════ SCROLL PROGRESS ══════════ */
function initScrollProgress() {
  const bar = $('#scrollBar');
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (scrollY / h * 100) + '%';
  }, { passive: true });
}

/* ══════════ NAVBAR ══════════ */
function initNavbar() {
  const nav = $('#navbar');
  const links = $$('.nl');
  const sections = ['hero', 'control', 'energy', 'security'];

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 40);
    let cur = sections[0];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && scrollY >= el.offsetTop - 140) cur = id;
    });
    links.forEach(l => l.classList.toggle('active', l.dataset.section === cur));
  }, { passive: true });
}

/* ══════════ CLOCK ══════════ */
function initClock() {
  let syncMin = 0;
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const s = String(now.getSeconds()).padStart(2,'0');
    const timeStr = `${h}:${m}:${s}`;
    const shortTime = `${h}:${m}`;

    const heroTime = $('#heroTime');
    const heroDate = $('#heroDate');
    const liveTime = $('#liveTime');
    if (heroTime) heroTime.textContent = timeStr;
    if (liveTime) liveTime.textContent = shortTime;
    if (heroDate) heroDate.textContent = now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });

    // Camera timestamps
    ['ct1','ct2','ct3','ct4'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = timeStr;
    });
  }
  setInterval(tick, 1000);
  tick();

  setInterval(() => {
    syncMin++;
    const el = $('#syncDisplay');
    if (el) el.textContent = syncMin === 1 ? '1 min ago' : `${syncMin} mins ago`;
  }, 60000);
}

/* ══════════ SCROLL REVEAL ══════════ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('revealed'), delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('[data-reveal]').forEach(el => obs.observe(el));
}

/* ══════════ 3D TILT ══════════ */
function initTilt() {
  $$('.b-card').forEach(card => {
    let tiltX = 0, tiltY = 0, active = false;

    card.addEventListener('mouseenter', () => { active = true; card.style.transition = 'none'; });
    card.addEventListener('mouseleave', () => {
      active = false;
      card.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s, border-color 0.3s';
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
    });

    card.addEventListener('mousemove', e => {
      if (!active) return;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      tiltX = ((e.clientY - cy) / rect.height) * -8;
      tiltY = ((e.clientX - cx) / rect.width) * 8;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px) scale(1.01)`;
    });

    // Ripple on click
    card.addEventListener('click', e => ripple(card, e));
  });
}

/* ══════════ PARALLAX ══════════ */
function initParallax() {
  const nebulas = $$('.nebula');
  const heroLeft = $('.hero-left');
  const heroRight = $('.hero-right');

  window.addEventListener('scroll', () => {
    const y = scrollY;
    nebulas.forEach((n, i) => {
      const speed = 0.05 + i * 0.03;
      n.style.transform += ''; // force repaint hint
      n.style.translate = `0 ${y * speed}px`;
    });
    if (heroLeft) heroLeft.style.translate = `0 ${y * 0.08}px`;
    if (heroRight) heroRight.style.translate = `0 ${y * 0.12}px`;
  }, { passive: true });
}

/* ══════════ HERO ORB 3D ══════════ */
function initHeroOrb() {
  const orb = $('#heroOrb');
  if (!orb) return;
  const hero = $('.hero-section');
  hero?.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.width / 2, cy = rect.height / 2;
    const rx = ((e.clientY - rect.top) - cy) / cy * -12;
    const ry = ((e.clientX - rect.left) - cx) / cx * 12;
    orb.style.transition = 'none';
    orb.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  hero?.addEventListener('mouseleave', () => {
    orb.style.transition = 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1)';
    orb.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
  });
}

/* ══════════ ROOM TABS ══════════ */
function initRoomTabs() {
  $$('.rtab').forEach(tab => {
    tab.addEventListener('click', e => {
      $$('.rtab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected','true');
      ripple(tab, e);

      const room = tab.dataset.room;
      buildLightsGrid(room);

      // Staggered card re-entrance
      $$('.b-card').forEach((c, i) => {
        c.style.transition = 'none';
        c.style.opacity = '0';
        c.style.transform = 'translateY(16px)';
        setTimeout(() => {
          c.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          c.style.opacity = '1';
          c.style.transform = 'translateY(0)';
        }, i * 55);
      });
    });

    // Mouse track for radial hover
    tab.addEventListener('mousemove', e => {
      const rect = tab.getBoundingClientRect();
      tab.style.setProperty('--rx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      tab.style.setProperty('--ry', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  });
}

/* ══════════ LIGHTS GRID ══════════ */
let currentRoom = 'living';

function buildLightsGrid(room) {
  currentRoom = room;
  const grid = $('#lightsGrid');
  const lights = DATA.rooms[room];
  if (!DATA.lightStates[room]) DATA.lightStates[room] = lights.map(() => Math.random() > 0.4);

  grid.innerHTML = '';
  lights.forEach((name, i) => {
    const on = DATA.lightStates[room][i];
    const item = document.createElement('div');
    item.className = 'light-item' + (on ? ' on' : '');
    item.innerHTML = `
      <div class="light-bulb-ico">💡</div>
      <span class="light-name">${name}</span>
      <label class="lt-switch">
        <input type="checkbox" role="switch" aria-checked="${on}" aria-label="${name} light" ${on ? 'checked' : ''}/>
        <span class="lt-track"></span>
      </label>
    `;
    const chk = item.querySelector('input');
    const toggle = () => {
      DATA.lightStates[room][i] = chk.checked;
      item.classList.toggle('on', chk.checked);
      chk.setAttribute('aria-checked', chk.checked);
      updateLightPower();
      updateHeroStats();
      ripple(item);
    };
    chk.addEventListener('change', toggle);
    item.addEventListener('click', e => { 
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SPAN' && !e.target.closest('.lt-switch')) { 
        chk.checked = !chk.checked; 
        toggle(); 
      } 
    });
    item.style.animationDelay = (i * 0.07) + 's';
    grid.appendChild(item);
  });

  $('#lightsRoom').textContent = room.charAt(0).toUpperCase() + room.slice(1) + ' Room';
  updateLightPower();
}

function updateLightPower() {
  const on = (DATA.lightStates[currentRoom] || []).filter(Boolean).length;
  const w = on * randInt(7, 12);
  $('#lightsPower').textContent = w + 'W';
}

// Brightness slider
const bSlider = $('#bSlider');
const bVal = $('#bVal');
if (bSlider) {
  bSlider.addEventListener('input', () => {
    const v = bSlider.value;
    bVal.textContent = v + '%';
    bSlider.style.background = `linear-gradient(to right, var(--a1) ${v}%, var(--border) ${v}%)`;
    bSlider.style.setProperty('--pct', v + '%');
  });
  bSlider.style.background = `linear-gradient(to right, var(--a1) 75%, var(--border) 75%)`;
}

/* ══════════ TEMPERATURE ══════════ */
function initTemperature() {
  const ARC_LEN = 226, TEMP_MIN = 16, TEMP_MAX = 30;
  let temp = DATA.temp;
  let mode = 'heat';

  function setTemp(v) {
    temp = clamp(v, TEMP_MIN, TEMP_MAX);
    const el = $('#tempBig');
    if (el) animNum(el, parseInt(el.textContent) || temp, temp, 400);

    const fill = $('#tgFill');
    if (fill) {
      const pct = clamp((temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN), 0, 1);
      fill.style.strokeDashoffset = ARC_LEN - (ARC_LEN * pct);
      fill.style.stroke = mode === 'heat' ? 'var(--a-warm)' : 'var(--a-cyan)';
      fill.style.filter = `drop-shadow(0 0 8px ${mode === 'heat' ? 'var(--a-warm)' : 'var(--a-cyan)'})`;
    }

    DATA.temp = temp;
    const orbT = $('#orbT');
    if (orbT) orbT.textContent = temp + '°C';
    const hTemp = $('#h-temp');
    if (hTemp) hTemp.textContent = temp;
  }

  setTemp(temp);

  const tUp = $('#tUp'), tDn = $('#tDn');
  if (tUp) tUp.addEventListener('click', e => { setTemp(temp + 1); ripple(tUp, e); });
  if (tDn) tDn.addEventListener('click', e => { setTemp(temp - 1); ripple(tDn, e); });

  $('#heatBtn')?.addEventListener('click', function() {
    mode = 'heat';
    this.classList.add('active');
    $('#coolBtn')?.classList.remove('active');
    $('#tempModeLabel').textContent = 'Heating';
    setTemp(temp);
  });

  $('#coolBtn')?.addEventListener('click', function() {
    mode = 'cool';
    this.classList.add('active');
    $('#heatBtn')?.classList.remove('active');
    $('#tempModeLabel').textContent = 'Cooling';
    setTemp(temp);
  });
}

/* ══════════ SECURITY ══════════ */
function initSecurity() {
  const armToggle = $('#armToggle');
  const secLabel = $('#secLabel');
  const secEvent = $('#secEvent');
  const motionDot = $('#motionDot');
  const motionStatus = $('#motionStatus');
  const shieldBody = $('#shieldBody');
  const shieldCheck = $('#shieldCheck');

  let eventIdx = randInt(0, DATA.secEvents.length - 1);
  typewrite(secEvent, DATA.secEvents[eventIdx]);

  function setArmed(armed) {
    if (secLabel) secLabel.textContent = armed ? 'System Armed' : 'System Disarmed';
    if (shieldBody) {
      shieldBody.style.fill = armed ? 'var(--a-green)' : 'var(--a-red)';
      shieldBody.style.fillOpacity = '0.12';
      shieldBody.style.stroke = armed ? 'var(--a-green)' : 'var(--a-red)';
    }
    if (shieldCheck) {
      shieldCheck.style.stroke = armed ? 'var(--a-green)' : 'var(--a-red)';
      shieldCheck.setAttribute('d', armed ? 'M20 30l7 7 13-13' : 'M22 22l16 16M38 22L22 38');
    }

    // Ring colors
    $$('.shield-pulse-ring').forEach(r => {
      r.style.borderColor = armed ? 'var(--a-green)' : 'var(--a-red)';
    });
  }

  armToggle?.addEventListener('change', () => {
    setArmed(armToggle.checked);
    armToggle.setAttribute('aria-checked', armToggle.checked);
  });

  setArmed(true);

  // Random motion events
  setInterval(() => {
    const triggered = Math.random() > 0.65;
    if (motionDot) {
      motionDot.className = 's-dot ' + (triggered ? 'red' : 'green');
    }
    if (motionStatus) motionStatus.textContent = triggered ? 'Triggered' : 'Clear';
    if (triggered && secEvent) {
      eventIdx = randInt(0, DATA.secEvents.length - 1);
      typewrite(secEvent, DATA.secEvents[eventIdx]);
    }
  }, 4500);
}

/* ══════════ ENERGY CHART ══════════ */
function initEnergyChart() {
  const canvas = $('#eChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const HOURS = Array.from({length:12},(_,i)=>String(i*2).padStart(2,'0')+':00');
  const today = Array.from({length:12},()=>randInt(80,450));
  const yest  = Array.from({length:12},()=>randInt(80,450));

  DATA.energyTotal = today.reduce((a,b)=>a+b,0);

  let prog = 0;

  function drawChart() {
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = 110;
    ctx.clearRect(0,0,W,H);

    const barW = Math.floor((W - 28) / 12);
    const maxV = Math.max(...today,...yest);
    const chartH = H - 22;

    // Gradient defs per draw
    HOURS.forEach((lbl, i) => {
      const x = 14 + i * barW;
      const bw2 = barW * 0.38;

      // Yesterday
      const yh = (yest[i]/maxV)*chartH*prog;
      ctx.fillStyle = 'rgba(70,85,110,0.5)';
      ctx.beginPath();
      ctx.roundRect(x, H-20-yh, bw2, yh, 2);
      ctx.fill();

      // Today
      const th = (today[i]/maxV)*chartH*prog;
      const gr = ctx.createLinearGradient(0, H-20-th, 0, H-20);
      gr.addColorStop(0,'rgba(79,172,254,0.95)');
      gr.addColorStop(1,'rgba(79,172,254,0.15)');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.roundRect(x + bw2 + 2, H-20-th, bw2, th, 2);
      ctx.fill();

      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(120,140,175,0.6)';
        ctx.font = '9px DM Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(lbl, x + barW/2, H - 4);
      }
    });
  }

  function animChart() {
    if (prog < 1) {
      prog = Math.min(1, prog + 0.03);
      drawChart();
      raf(animChart);
    }
  }

  animChart();
  window.addEventListener('resize', () => drawChart(), { passive:true });

  // Live refresh
  setInterval(() => {
    const i = randInt(0, 11);
    today[i] = randInt(80, 450);
    DATA.energyTotal = today.reduce((a,b)=>a+b,0);
    drawChart();
    const el = $('#totalW');
    if (el) animNum(el, parseInt(el.textContent)||0, DATA.energyTotal, 600);
    const orbW = $('#orbW');
    if (orbW) orbW.textContent = DATA.energyTotal + 'W';
    updateHeroStats();
  }, 5000);

  // Initial total
  setTimeout(() => {
    const el = $('#totalW');
    if (el) animNum(el, 0, DATA.energyTotal, 1200);
    const orbW = $('#orbW');
    if (orbW) orbW.textContent = DATA.energyTotal + 'W';

    const pct = randInt(5, 22);
    const dir = Math.random()>0.3 ? '▼' : '▲';
    const savEl = $('#savingsPct');
    if (savEl) { savEl.textContent = `${dir} ${pct}% vs yesterday`; savEl.style.color = dir==='▼'?'var(--a-green)':'var(--a-red)'; }
  }, 200);
}

/* ══════════ CAMERAS ══════════ */
function initCameras() {
  const colors = [
    'linear-gradient(135deg,#0a1628,#060e1a)',
    'linear-gradient(135deg,#0a1420,#061018)',
    'linear-gradient(135deg,#100a1e,#0a0614)',
    'linear-gradient(135deg,#0a1a14,#060e0a)',
  ];
  $$('.cam-feed').forEach((cf, i) => {
    cf.style.background = colors[i];
  });
}

/* ══════════ AI INSIGHTS ══════════ */
function initAI() {
  buildInsights();
  $('#refreshAI')?.addEventListener('click', function(e) {
    ripple(this, e);
    this.style.transform = 'rotate(360deg)';
    setTimeout(() => this.style.transform = '', 300);
    buildInsights();
  });
}

function buildInsights() {
  const container = $('#aiInsights');
  if (!container) return;
  container.innerHTML = '';
  const shuffled = [...DATA.insights].sort(()=>Math.random()-0.5).slice(0,4);
  shuffled.forEach(([ico, text], i) => {
    const el = document.createElement('div');
    el.className = 'ai-item';
    el.style.animationDelay = (i * 0.1) + 's';
    el.innerHTML = `<span class="ai-ico">${ico}</span><span>${text}</span>`;
    container.appendChild(el);
  });
}

/* ══════════ SCHEDULE ══════════ */
function initSchedule() {
  const scroll = $('#schedScroll');
  if (!scroll) return;
  const now = new Date();
  const nowH = now.getHours() + now.getMinutes()/60;

  DATA.schedules.forEach(({t,d,i,s}) => {
    const [h,m] = t.split(':').map(Number);
    const sh = h + m/60;
    let status = s;
    if (sh < nowH - 0.2) status = 'done';
    else if (Math.abs(sh - nowH) < 0.4) status = 'run';

    const el = document.createElement('div');
    el.className = 'sched-item' + (status==='run'?' active':'');
    const badgeClass = status==='done'?'sb-done':status==='run'?'sb-run':'sb-up';
    const badgeText = status==='done'?'✓ Done':status==='run'?'▶ Running':'◷ Scheduled';
    el.innerHTML = `
      <div class="si-icon">${i}</div>
      <div class="si-time">${t}</div>
      <div class="si-device">${d}</div>
      <span class="si-badge ${badgeClass}">${badgeText}</span>
    `;
    scroll.appendChild(el);
  });
}

/* ══════════ THEME TOGGLE ══════════ */
function initTheme() {
  const btn = $('#themeBtn');
  btn?.addEventListener('click', e => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    ripple(btn, e);
  });
}

/* ══════════ HERO STATS ══════════ */
function updateHeroStats() {
  let total = 0;
  Object.values(DATA.lightStates).forEach(arr => { total += arr.filter(Boolean).length; });

  const hDev = $('#h-devices'), hTemp = $('#h-temp'), hWatts = $('#h-watts');
  const orbL = $('#orbL'), orbT = $('#orbT');

  if (hDev) hDev.textContent = total + 2;
  if (hTemp) hTemp.textContent = DATA.temp;
  if (hWatts) hWatts.textContent = DATA.energyTotal;
  if (orbL) orbL.textContent = total + ' on';
  if (orbT) orbT.textContent = DATA.temp + '°C';
}

function initHeroStats() {
  setTimeout(updateHeroStats, 300);
}

/* ══════════ MAGNETIC BUTTONS ══════════ */
function initMagnetic() {
  $$('.btn-primary, .btn-ghost, .tc-btn, .rtab').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width/2) * 0.3;
      const dy = (e.clientY - rect.top - rect.height/2) * 0.3;
      btn.style.transition = 'none';
      btn.style.translate = `${dx}px ${dy}px`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'translate 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      btn.style.translate = '0 0';
    });
  });
}

/* ══════════ WEATHER ══════════ */
function initWeather() {
  const el = $('#wText');
  if (el) el.textContent = DATA.weatherOpts[randInt(0, DATA.weatherOpts.length-1)];
}

/* ══════════ CONSOLE BRANDING ══════════ */
console.log('%c\n ██╗\n ██║  NEXUS HOME v2.4.1\n ██║  Cosmic Smart Dashboard\n ╚═╝\n', 'color:#4FACFE;font-family:monospace;font-size:12px;');
console.log('%cAll systems nominal. Built with precision.', 'color:#7A8BB0;font-family:monospace;font-size:11px;');

/* ══════════ BRIGHTNESS CONTROL ══════════ */
function initBrightness() {
  const slider = $('#bSlider');
  const valText = $('#bVal');
  if (!slider || !valText) return;

  const update = () => {
    const val = slider.value;
    valText.textContent = val + '%';
    slider.style.setProperty('--pct', val + '%');
    
    // update global data simulation
    DATA.energyTotal = 3000 + Math.round(val * 5); 
    updateHeroStats();
  };

  slider.addEventListener('input', update);
  // Set initial state
  update();
}

/* ══════════ MEDIA CONTROL ══════════ */
function initMedia() {
  const playBtn = $('#mediaPlay');
  const vizBars = $$('.m-bar');
  let isPlaying = false;

  playBtn?.addEventListener('click', function(e) {
    isPlaying = !isPlaying;
    this.textContent = isPlaying ? '⏸' : '▶';
    vizBars.forEach(bar => {
      bar.style.animationPlayState = isPlaying ? 'running' : 'paused';
    });
    ripple(this, e);
  });
  
  // Start paused
  vizBars.forEach(bar => bar.style.animationPlayState = 'paused');
}
