/* ── Grey Space: mode toggle, starfield, terminal Q&A ─────────────────── */
'use strict';

/* ── Mode toggle ──────────────────────────────────────────────────────── */
const root = document.documentElement;
const modeButtons = document.querySelectorAll('[data-set-mode]');

function applyMode(mode) {
  root.dataset.mode = mode;
  try { localStorage.setItem('mode', mode); } catch (e) {}
  modeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setMode === mode)));
  skyReadColors();
  if (reducedMotion.matches) skyDraw();
}
modeButtons.forEach((b) => b.addEventListener('click', () => applyMode(b.dataset.setMode)));
modeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setMode === root.dataset.mode)));

document.getElementById('year').textContent = new Date().getFullYear();

/* ── Starfield & constellations ───────────────────────────────────────── */
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');

// simplified shapes of real constellations, local coords 0–1
const CONSTELLATIONS = [
  { stars: [[0.05,0.10],[0.20,0.22],[0.35,0.28],[0.50,0.22],[0.55,0.42],[0.80,0.45],[0.85,0.20]],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]] }, // Ursa Major
  { stars: [[0.65,0.15],[0.25,0.18],[0.55,0.45],[0.45,0.48],[0.35,0.51],[0.30,0.85],[0.60,0.88]],
    edges: [[0,1],[0,2],[1,4],[2,3],[3,4],[2,6],[4,5]] }, // Orion
  { stars: [[0.05,0.5],[0.28,0.15],[0.5,0.55],[0.72,0.1],[0.95,0.45]],
    edges: [[0,1],[1,2],[2,3],[3,4]] }, // Cassiopeia
  { stars: [[0.1,0.2],[0.2,0.15],[0.28,0.25],[0.35,0.4],[0.4,0.55],[0.35,0.7],[0.25,0.85],[0.15,0.95],[0.05,0.9]],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]] }, // Scorpius
  { stars: [[0.5,0.05],[0.5,0.95],[0.1,0.5],[0.85,0.45]],
    edges: [[0,1],[2,3]] }, // Crux
  { stars: [[0.1,0.3],[0.15,0.15],[0.3,0.1],[0.35,0.25],[0.3,0.4],[0.5,0.45],[0.75,0.55],[0.65,0.3]],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,5]] }, // Leo
  { stars: [[0.5,0.05],[0.5,0.4],[0.5,0.95],[0.15,0.35],[0.85,0.45]],
    edges: [[0,1],[1,2],[1,3],[1,4]] }, // Cygnus
  { stars: [[0.3,0.05],[0.32,0.3],[0.3,0.55],[0.28,0.8],[0.6,0.08],[0.62,0.32],[0.6,0.57],[0.58,0.82]],
    edges: [[0,1],[1,2],[2,3],[4,5],[5,6],[6,7],[0,4]] }, // Gemini
  { stars: [[0.5,0.5],[0.3,0.2],[0.4,0.35],[0.75,0.2],[0.6,0.35],[0.15,0.9],[0.9,0.85]],
    edges: [[1,2],[2,0],[3,4],[4,0],[0,5],[0,6]] }, // Taurus
  { stars: [[0.5,0.1],[0.3,0.5],[0.7,0.55],[0.65,0.85],[0.25,0.8]],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,1]] }, // Lyra
];

let W, H, dust = [], groups = [];
const colors = { dust: '#8B8D93', accent: '#54D6DE' };
const rand = (a, b) => a + Math.random() * (b - a);

function skyReadColors() {
  const s = getComputedStyle(root);
  colors.dust = s.getPropertyValue('--text-secondary').trim() || colors.dust;
  colors.accent = s.getPropertyValue('--accent').trim() || colors.accent;
}

function skyInit() {
  W = innerWidth; H = innerHeight;
  const dpr = devicePixelRatio || 1;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const n = Math.min(160, Math.max(60, Math.round((W * H) / 9000)));
  dust = Array.from({ length: n }, () => ({
    x: rand(0, W), y: rand(0, H),
    r: rand(0.4, 1.4),
    vx: rand(-0.06, 0.06), vy: rand(-0.06, 0.06),
  }));

  groups = CONSTELLATIONS.map((c) => {
    const w = W * rand(0.12, 0.22);
    return {
      ...c, w, h: w * rand(0.65, 0.95),
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.07, 0.07), vy: rand(-0.05, 0.05),
    };
  });
}

function skyDraw() {
  ctx.clearRect(0, 0, W, H);

  // A. ambient dust
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = colors.dust;
  for (const d of dust) {
    d.x += d.vx; d.y += d.vy;
    if (d.x < -5) d.x = W + 5; else if (d.x > W + 5) d.x = -5;
    if (d.y < -5) d.y = H + 5; else if (d.y > H + 5) d.y = -5;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // B. constellations (rigid groups, drift + wrap on bounding box)
  for (const g of groups) {
    g.x += g.vx; g.y += g.vy;
    if (g.x > W + 20) g.x = -g.w - 20; else if (g.x + g.w < -20) g.x = W + 20;
    if (g.y > H + 20) g.y = -g.h - 20; else if (g.y + g.h < -20) g.y = H + 20;

    ctx.globalAlpha = 0.32;
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const [a, b] of g.edges) {
      ctx.moveTo(g.x + g.stars[a][0] * g.w, g.y + g.stars[a][1] * g.h);
      ctx.lineTo(g.x + g.stars[b][0] * g.w, g.y + g.stars[b][1] * g.h);
    }
    ctx.stroke();

    ctx.globalAlpha = 0.9;
    ctx.fillStyle = colors.accent;
    for (const [sx, sy] of g.stars) {
      ctx.beginPath();
      ctx.arc(g.x + sx * g.w, g.y + sy * g.h, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function skyLoop() {
  skyDraw();
  if (!reducedMotion.matches) requestAnimationFrame(skyLoop);
}

skyReadColors();
skyInit();
skyLoop();
addEventListener('resize', () => { skyInit(); if (reducedMotion.matches) skyDraw(); });
reducedMotion.addEventListener('change', () => { if (!reducedMotion.matches) skyLoop(); });

/* ── Terminal Q&A ─────────────────────────────────────────────────────── */
const out = document.getElementById('term-out');
const form = document.getElementById('term-form');
const input = document.getElementById('term-input');

const T = {
  about: `Nur Fajar — Learning & Development Specialist at Terra Weather
(Singapore-based AI company), from Tangerang, Indonesia.
2+ years designing, developing, and delivering GenAI training programs:
4 curriculum modules, 5 programs led end-to-end, 350+ learners trained
at 9.0/10 satisfaction. Also builds the AI automation behind the scenes —
9 AI agents deployed across a B2B outreach CRM pipeline.`,
  experience: `EXP / 01  L&D Specialist — Terra Weather (Jul 2025 – Jul 2026)
          4 GenAI modules · 5 programs led · 9 AI agents · 1,250+ hrs saved
EXP / 02  AI Training Specialist — Terra AI (Feb 2024 – Jun 2025)
          100+ trained · 90%+ satisfaction · 20/80 practice framework
EXP / 03  ML Mentor — Bangkit Academy (Feb 2023 – Jan 2024)
          50+ mentees from 25+ universities · >90% graduation
EXP / 04  Chapter Leader — GDSC Siliwangi (2021 – 2022)
          Founded chapter · 100+ members · 4 national events
EXP / 05  Coordinator & Media — GenBI Tasikmalaya (2021 – 2022)
          QRIS campaigns with 80+ scholars · video production

full detail: see the SIGNALS section above.`,
  skills: `SKL / 01  AI ENGINEERING — Python, LLM APIs, prompt engineering,
          AI agents, CRM/email automation, HITL, TensorFlow, ensemble ML
SKL / 02  L&D — instructional design, curriculum dev, ADDIE, backward
          design, Bloom's, Kirkpatrick L1–L3, TTT, facilitation
SKL / 03  PRODUCT & PROGRAM — program mgmt, design thinking, JTBD,
          MoSCoW, stakeholder mapping, community building
SKL / 04  TOOLS — Google Workspace, Notion, Miro, Discord, Smojo,
          Apollo.io, Adobe Premiere Pro`,
  programs: `PRG / 01  Chatbots for Education — beginner · 2h · teachers
PRG / 02  Chatbots for Business — beginner · 2h · business owners
PRG / 03  GenAI Foundations — intermediate · 4h · developers
PRG / 04  GenAI Product Manager — specialist · 12h · PMs

All published on ai4impact.org — links in the PROGRAMS section.`,
  projects: `01  B2B outreach automation — Python + LLM pipeline: ~3,000 leads
    processed, 600 qualified prospects, 83% prep-time reduction.
02  9-agent CRM system — lead qualification, company research, cold
    email drafting, follow-ups, inbox monitoring, HITL approval.
03  GenAI TTT curriculum — Train the Trainers program that upskilled
    6 university lecturers.
04  Thesis (published, JOIV) — ensemble ML + SMOTE for sentiment
    analysis of SDGs in Indonesia.`,
  education: `Siliwangi University — B.CS in Informatics (2018 – 2022)
GPA 3.94 · Best Graduate, Faculty of Engineering
Awards: Bank Indonesia Scholarship, BRI Scholarship

Certifications:
· TensorFlow Developer Certificate — Google, 2024
· Google Data Analytics Certificate — 2023`,
  contact: `email     hi.nurfajar@gmail.com
linkedin  linkedin.com/in/nurfajar
github    github.com/nur-fajar
cv        type 'cv' to open the PDF`,
  help: `commands:
  about        who is Nur Fajar
  experience   work history (EXP / 01–05)
  skills       skill groups (SKL / 01–04)
  programs     GenAI curriculum designed
  projects     things built
  education    degree & certifications
  contact      how to reach me
  cv           open resume PDF
  theme        switch dark/light
  clear        clear terminal

…or just ask in plain English / Bahasa Indonesia,
e.g. "berapa learner yang sudah dilatih?" or "what did you build at Terra?"`,
};

// keyword → topic routing for free-text questions (EN + ID)
const ROUTES = [
  ['about', ['who', 'siapa', 'about', 'tentang', 'profil', 'profile', 'kamu', 'you', 'intro']],
  ['experience', ['experience', 'pengalaman', 'work', 'kerja', 'job', 'career', 'karir', 'terra', 'bangkit', 'gdsc', 'genbi', 'mentor', 'history', 'exp']],
  ['skills', ['skill', 'keahlian', 'kemampuan', 'stack', 'tools', 'python', 'llm', 'framework', 'bisa apa']],
  ['programs', ['program', 'course', 'kurikulum', 'curriculum', 'module', 'modul', 'training', 'pelatihan', 'chatbot', 'kelas', 'learner', 'belajar', 'ajar']],
  ['projects', ['project', 'proyek', 'build', 'built', 'bangun', 'automation', 'otomasi', 'agent', 'pipeline', 'crm', 'outreach', 'thesis', 'skripsi']],
  ['education', ['education', 'pendidikan', 'kuliah', 'university', 'universitas', 'gpa', 'ipk', 'degree', 'cert', 'sertifi', 'tensorflow', 'graduate', 'lulus']],
  ['contact', ['contact', 'kontak', 'email', 'hubungi', 'reach', 'linkedin', 'github', 'hire', 'rekrut']],
];

function print(text, cls) {
  const div = document.createElement('div');
  if (cls) div.className = cls;
  div.textContent = text;
  out.appendChild(div);
  out.scrollTop = out.scrollHeight;
}

function answer(raw) {
  const q = raw.toLowerCase().trim();
  if (!q) return;

  if (q === 'clear') { out.textContent = ''; return; }
  if (q === 'cv' || q === 'resume') { print('opening nf.pdf …', 'hl'); open('nf.pdf', '_blank'); return; }
  if (q.startsWith('theme')) {
    const next = q.includes('light') ? 'light' : q.includes('dark') ? 'dark' : (root.dataset.mode === 'dark' ? 'light' : 'dark');
    applyMode(next);
    print(`mode → ${next.toUpperCase()}`, 'hl');
    return;
  }
  if (q === 'whoami') { print('guest — but the résumé you are reading belongs to Nur Fajar.'); return; }
  if (T[q]) { print(T[q]); return; }

  // free-text: score topics by keyword hits
  let best = null, bestScore = 0;
  for (const [topic, keys] of ROUTES) {
    const score = keys.reduce((s, k) => s + (q.includes(k) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = topic; }
  }
  if (best) {
    print(`[matched → ${best}]`, 'hl');
    print(T[best]);
  } else {
    print(`no signal for "${raw}" — type 'help' for available commands.`);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = input.value;
  input.value = '';
  print(q, 'in');
  answer(q);
});

print('NF TERMINAL v1.0 — interactive résumé', 'hl');
print("type 'help' for commands, or ask anything (EN/ID).\n");
