// Data konfigurasi 42 mockup — dipakai oleh generate.mjs.
// Tiap entri: id (nama file), title, desc (untuk hub), vars (token warna/font),
// motion (preset JS), body (opsional — override struktur default), css (opsional),
// heroExtra (opsional — fragmen tambahan di hero).

export const FLAGSHIPS = [
  { file: 'terminal.html', no: '05', title: 'Terminal / Developer-core', desc: 'Boot sequence diketik saat load, output di-type saat masuk viewport, block cursor berkedip.' },
  { file: 'velocity.html', no: '21', title: 'Velocity Grotesque', desc: 'Tipe raksasa condong reaktif kecepatan scroll, baris parallax dua arah, marquee. Bahasa Studio Freight.' },
  { file: 'scrollytelling.html', no: '25', title: 'Scrollytelling Pinned', desc: 'Kisah CRM pipeline 5 bab terpaku: meter 300+h → ~11h mengalir, judul berganti per bab.' },
  { file: 'linear.html', no: '32', title: 'Linear', desc: 'Glow ungu mengikuti kursor, kartu gradient-border, reveal beruntun. Standar SaaS premium.' },
  { file: 'anthropic.html', no: '38', title: 'Anthropic / Claude', desc: 'Gading hangat, serif italic, coral #d97757. Bahasa visual brand AI yang sedang naik.' },
  { file: 'varfont.html', no: '24', title: 'Variable Font Playground', desc: 'Bobot & lebar huruf mengikuti kursor (lerp) dan di-scrub scroll, dengan HUD readout.' },
];

export const STYLES = [
  {
    id: '01-swiss',
    layout: 'magazine', title: 'Swiss / Editorial Clean', desc: 'Putih, hairline, satu aksen merah, grotesk tebal. Presisi tanpa hiasan.',
    vars: { bg: '#ffffff', ink: '#111111', sub: '#666666', rule: '#e5e5e5', accent: '#d43a18', disp: 'Archivo', bodyf: 'Inter' },
    css: `.display{font-stretch:118%} .meta{border-bottom:2px solid var(--ink)}`,
  },
  {
    id: '02-neobrutal',
    layout: 'asym', title: 'Neo-Brutalism', desc: 'Border hitam tebal, hard shadow, kuning-pink primer. Hover lompat patah-patah.',
    vars: { bg: '#ffde00', ink: '#111111', sub: '#333333', rule: '#111111', accent: '#111111', disp: 'Archivo', bodyf: 'Inter' },
    motion: 'jolt',
    css: `.meta{border-bottom:3px solid #000}.display{color:#111}.display b{background:#fff;border:3px solid #000;box-shadow:6px 6px 0 #000;padding:0 .1em}
    .wrow,.btn,.praise blockquote{border:3px solid #000!important;box-shadow:5px 5px 0 #000}.btn{box-shadow:4px 4px 0 #000;background:#ff90e8;color:#111}
    .praise{background:#fff;padding:18px}.lnk{background:#111;color:#ffde00;padding:8px 14px;border:3px solid #000;box-shadow:4px 4px 0 #000}
    @media(hover:hover){.wrow:hover,.btn:hover{transform:translate(-3px,-3px);box-shadow:8px 8px 0 #000;transition:transform .12s steps(2)}}`,
  },
  {
    id: '03-brutalism',
    layout: 'window', title: 'Brutalism asli', desc: 'Style browser default, sengaja. Times New Roman, link biru, tabel, hit counter.',
    vars: { bg: '#ffffff', ink: '#000000', sub: '#444444', rule: '#888888', accent: '#0000ee', disp: 'Times New Roman', bodyf: 'Times New Roman' },
    motion: 'typed',
  body: `<main class="shell"><div><p><a href="#">index</a> | <a href="#">work.txt</a> | <a href="#">about.txt</a> | <a href="#">contact</a></p><hr />
      <h1 class="display" data-split>Nur Fajar</h1>
      <p class="tag">AI specialist who builds apps and communities.</p><br />
      <table><tr><th>#</th><th>project</th><th>result</th></tr>
      <tr><td>01</td><td>CRM pipeline (AI build, revenue ops)</td><td>~11h runtime vs 300+h manual (96% less)</td></tr>
      <tr><td>02</td><td>Chatbot curriculum engine</td><td>5 programs, 150+ participants</td></tr>
      <tr><td>03</td><td>Web builds</td><td>3 sites live, Next.js + TS</td></tr></table>
      <p class="counter">visitor no. <span>000042</span> | last updated October 2026</p><hr />
      <p>"He takes ownership, learns fast, and delivers." — Arnold Doray, Former manager, Terra AI</p><br />
      <p><a href="mailto:hi@nurfajar.com">hi@nurfajar.com</a> | available immediately</p></div></main>`,
    css: `.display{font-size:32px;text-transform:none;letter-spacing:0;margin:14px 0 4px}.tag{font-size:16px;margin-bottom:14px;color:#000}
    table{border-collapse:collapse;width:100%;font-size:14px}th,td{border:1px solid #888;padding:6px 10px;text-align:left}th{background:#efefef}
    .counter{font-family:'Courier New',monospace;font-size:12px;color:#444;margin-top:14px}.counter span{background:#000;color:#0f0;padding:2px 6px;letter-spacing:4px}
    hr{border:none;border-top:1px solid #888;margin:14px 0}.foot,.contact{border:none!important}.mail{font-family:'Times New Roman';font-size:16px;color:#0000ee}`,
  },
  {
    id: '04-pixel',
    layout: 'window', title: 'Pixel / 8-bit', desc: 'Font piksel, palette terbatas, scanline CRT, hard drop shadow.',
    vars: { bg: '#1a1c2c', ink: '#94b0c2', sub: '#566c86', rule: '#333c57', accent: '#ffcd75', disp: 'Press Start 2P', bodyf: 'Press Start 2P' },
    motion: 'flicker',
    css: `body{font-size:11px;line-height:2}.display{font-size:clamp(26px,6.5vw,64px);color:#fff;text-shadow:5px 5px 0 #000}
    .t{font-size:12px;color:#fff}.k{font-size:8px}.h{font-size:9px}.mail{font-size:13px;text-transform:none}.meta,.who{font-size:8px}
    .win{border:4px solid #333c57;background:#29366f;padding:14px;box-shadow:0 6px 0 #000;margin-top:10px}
    .lnk{color:#73eff7;border:none}.btn{background:#b13e53;color:#fff;box-shadow:3px 3px 0 #000;border-radius:0}
    .contact{background:#1a1c2c}.praise{background:#1a1c2c}
    body::after{content:'';position:fixed;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 1px,transparent 1px 3px);z-index:5}`,
  },
  {
    id: '06-glass', title: 'Glassmorphism / Aurora', desc: 'Gradien aurora, kaca buram, pill button. Slop indicator #1 — untuk perbandingan.',
    vars: { bg: '#0a0a18', ink: '#ffffff', sub: 'rgba(255,255,255,.65)', rule: 'rgba(255,255,255,.16)', accent: '#9be7ff', disp: 'Inter', bodyf: 'Inter' },
    motion: 'tilt',
    css: `body{position:relative}.display{font-weight:700;letter-spacing:-.03em;text-transform:none}
    .wrow,.praise,.contact{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:18px;margin-top:14px;backdrop-filter:blur(16px)}
    .btn{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#fff}
    body::before,body::after{content:'';position:absolute;border-radius:50%;filter:blur(90px);opacity:.55;z-index:-1}
    body::before{width:420px;height:420px;background:#6d5cff;top:-120px;left:-80px}
    body::after{width:380px;height:380px;background:#ff5ca8;bottom:-120px;right:-60px}`,
  },
  {
    id: '07-y2k',
    layout: 'centered', title: 'Y2K Cyber Chrome', desc: 'Teks krom metalik, grid perspektif, lens flare. Nostalgia 2000-an.',
    vars: { bg: '#060a20', ink: '#dfe6ff', sub: '#8fa5ff', rule: '#2c3d8a', accent: '#9be7ff', disp: 'Orbitron', bodyf: 'Orbitron' },
    css: `body{background:radial-gradient(120% 100% at 50% 0%, #1b2a6b 0%, #060a20 55%, #000 100%)}
    .display{font-weight:900;letter-spacing:.02em;text-transform:uppercase;background:linear-gradient(180deg,#fff 8%,#cfd8ff 30%,#5a78e8 52%,#0a1440 60%,#a8b8ff 82%,#fff 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
    .mail{color:#fff;background:linear-gradient(180deg,#cfd8ff,#5a78e8);-webkit-background-clip:text;background-clip:text;-webkit-text-stroke:0}
    .t,.meta,.who,.k,.no{letter-spacing:.2em}
    body::after{content:'';position:absolute;left:-20%;right:-20%;bottom:-4%;height:36%;background:repeating-linear-gradient(90deg,rgba(90,130,255,.3) 0 2px,transparent 2px 60px),repeating-linear-gradient(0deg,rgba(90,130,255,.3) 0 2px,transparent 2px 40px);transform:perspective(300px) rotateX(55deg);transform-origin:bottom;pointer-events:none}`,
  },
  {
    id: '08-atlas', title: 'Celestial Atlas (arah v8)', desc: 'Versi standalone ringan: rasi digambar GSAP, kertas hangat, tick marks. Versi penuh ada di /v8.',
    vars: { bg: '#171610', ink: '#f0ede3', sub: '#a49f90', rule: 'rgba(240,237,227,.16)', accent: '#e24e1b', disp: 'Archivo', bodyf: 'Inter' },
    motion: 'draw',
    body: `<svg class="sky" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="22" y="22" width="1396" height="856" class="frm" />
      <path class="draw" d="M120,150 L210,120 L300,150 L260,220 L170,230 Z" />
      <path class="draw" d="M1150,620 L1210,590 L1250,650 L1200,700 Z" />
      <path class="draw" d="M1240,140 L1300,120 L1350,170 L1290,190 Z" />
      <path class="draw" d="M190,680 L230,650 L270,700 L230,730 Z" />
      <g id="stars"></g>
    </svg>
    <main class="shell"><header class="hero">
      <div class="meta"><span>NUR FAJAR — FOLIO</span><span>PLATE 01 · OCT 2026</span></div>
      <h1 class="display" data-split>Nur Fajar</h1>
      <p class="tag" data-reveal>AI specialist who builds apps and communities.</p>
      <div class="cta" data-reveal><a class="btn" href="#">See selected work</a><a class="lnk" href="#">hi@nurfajar.com</a></div>
    </header>
    <section class="works">
      <div class="wrow" data-reveal><span class="no">01</span><div><p class="k">AI build · Revenue ops</p><p class="t">CRM pipeline</p><p class="h">~11h runtime vs 300+h manual (96% less) — 9 Python + LLM agents, human-in-the-loop.</p></div></div>
      <div class="wrow" data-reveal><span class="no">02</span><div><p class="k">Enablement · Curriculum</p><p class="t">Chatbot curriculum engine</p><p class="h">5 programs · 150+ participants, owned end to end.</p></div></div>
    </section>
    <section class="praise" data-reveal><blockquote>"He takes ownership, learns fast, and delivers."</blockquote><p class="who">Arnold Doray — Former manager, Terra AI · Now CTO, Wingfin</p></section>
    <footer class="contact" data-reveal><a class="mail" href="mailto:hi@nurfajar.com">hi@nurfajar.com</a><p class="sub">Available immediately · replies within 24 hours.</p></footer></main>`,
    css: `.sky{position:fixed;inset:0;width:100%;height:100%;z-index:-1}
    .frm{fill:none;stroke:rgba(240,237,227,.16)}
    .draw{fill:none;stroke:rgba(240,237,227,.34);stroke-width:1}
    .display{font-stretch:118%}.display:last-letter{}`,
  },
  {
    id: '09-maximal',
    layout: 'asym', title: 'Maximalism / Anti-design', desc: 'Rotasi, tumpang tindih, stiker, font bentrok. Energi muda yang kacau-terukur.',
    vars: { bg: '#ff5c00', ink: '#111111', sub: '#111111', rule: '#111111', accent: '#b8f52a', disp: 'Archivo', bodyf: 'Inter' },
    css: `.display{transform:rotate(-2.5deg);color:#fff;text-shadow:6px 6px 0 #111;font-size:clamp(50px,11vw,130px)}
    .display em{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;text-transform:none;color:#b8f52a;text-shadow:4px 4px 0 #111}
    .meta{font-weight:900}.wrow{background:#ff90e8;border:3px solid #111;box-shadow:8px 8px 0 #111;padding:16px;transform:rotate(1.4deg)}
    .btn{background:#111;color:#ff5c00;transform:rotate(-1deg)}.mail{transform:rotate(1deg);display:inline-block}
    .tag{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(17px,2.6vw,24px);transform:rotate(-1deg)}`,
  },
  {
    id: '10-bento',
    layout: 'bento', title: 'Bento Grid', desc: 'Kotak modular ukuran beda, tiap sel satu fakta, hover micro-scale.',
    vars: { bg: '#f5f5f7', ink: '#1d1d1f', sub: '#86868b', rule: '#e8e8ed', accent: '#0071e3', disp: 'Inter', bodyf: 'Inter' },
    motion: 'count',
    body: `<main class="shell"><div class="bgrid">
      <div class="cell wide" data-reveal><p class="k">Hello</p><h1 class="display">Nur Fajar</h1><p class="tag">AI specialist who builds apps and communities.</p></div>
      <div class="cell" data-reveal><p class="k">Now</p><p class="big" data-count="0">Open to work</p><p class="sub">Full-time · immediately</p></div>
      <div class="cell" data-reveal><p class="k">Impact</p><p class="big"><span data-count="96">0</span>% less</p><p class="sub">manual outreach time</p></div>
      <div class="cell" data-reveal><p class="k">Work 01</p><p class="t">CRM pipeline</p><p class="sub">AI build · Revenue ops</p></div>
      <div class="cell" data-reveal><p class="k">Praise</p><p class="quote">"He takes ownership, learns fast, and delivers."</p><p class="sub">Arnold Doray — Former manager, Terra AI</p></div>
      <div class="cell" data-reveal><p class="k">Say hi</p><p class="t"><a href="mailto:hi@nurfajar.com">hi@nurfajar.com</a></p><p class="sub">Replies within 24 hours</p></div>
    </div></main>`,
    css: `.bgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:clamp(24px,6vh,60px) 0}
    .cell{background:#fff;border-radius:18px;padding:22px;box-shadow:0 4px 14px rgba(0,0,0,.05);display:flex;flex-direction:column;gap:8px;min-height:120px;transition:transform .25s ease}
    .cell:hover{transform:scale(1.02)}
    .cell.wide{grid-column:span 2}
    .display{font-size:clamp(30px,5.5vw,56px);text-transform:none;line-height:1.05}
    .big{font-size:clamp(24px,3.4vw,34px);font-weight:700;letter-spacing:-.02em;color:var(--accent)}
    .quote{font-size:14px;line-height:1.45}.sub{font-size:12px;color:var(--sub)}
    .t{font-size:16px;font-weight:600}
    @media(max-width:720px){.bgrid{grid-template-columns:1fr}.cell.wide{grid-column:span 1}}`,
  },
  {
    id: '11-blueprint',
    layout: 'magazine', title: 'Blueprint / Technical Drawing', desc: 'Kertas biru arsitek: grid koordinat, garis ukur, title block resmi.',
    vars: { bg: '#103a7d', ink: '#ffffff', sub: '#9db8ee', rule: 'rgba(255,255,255,.65)', accent: '#9be7ff', disp: 'JetBrains Mono', bodyf: 'JetBrains Mono' },
    motion: 'draw',
    css: `body{background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.07) 0 1px,transparent 1px 28px),repeating-linear-gradient(90deg,rgba(255,255,255,.07) 0 1px,transparent 1px 28px)}
    .display{font-weight:500;letter-spacing:.06em;text-transform:uppercase;border:1.5px dashed rgba(255,255,255,.5);padding:16px 18px;font-size:clamp(30px,7.5vw,80px);line-height:1.1}
    .meta,.k,.no{letter-spacing:.18em}.t{font-weight:500;letter-spacing:.04em}.wrow{border:1.5px solid var(--rule);display:grid;grid-template-columns:1.4fr 1fr;padding:0}
    .wrow>div{padding:12px 14px;display:grid;gap:4px;align-content:center}.wrow>div+div{border-left:1.5px solid var(--rule)}
    .wrow .no{border:none;padding:0}.wrow>div:first-child{grid-column:1/-1;border-bottom:1.5px solid var(--rule)}
    .contact,.praise{border:1.5px solid var(--rule);padding:14px;margin-top:14px}
    .mail{font-size:14px;font-weight:400;text-transform:uppercase;letter-spacing:.12em}
    .titleblock{margin-top:14px;border:1.5px solid var(--rule);display:grid;grid-template-columns:2fr 1fr 1fr;font-size:9px;letter-spacing:.12em;text-transform:uppercase}
    .titleblock span{padding:8px 10px;border-left:1.5px solid var(--rule)}.titleblock span:first-child{border-left:none;color:#fff}`,
    heroExtra: `<div class="dim">APPS · COMMUNITIES · PROGRAMS</div>`,
  },
  {
    id: '12-riso',
    layout: 'asym', title: 'Risograph / Zine', desc: 'Dua tinta overprint, misregistration sengaja, halftone, tape.',
    vars: { bg: '#f7f2e8', ink: '#1e1b4f', sub: '#2b4bf2', rule: '#1e1b4f', accent: '#ff4b4b', disp: 'Archivo', bodyf: 'Inter' },
    css: `body{position:relative}
    body::before{content:'';position:absolute;inset:0;background-image:radial-gradient(#2b4bf2 1px,transparent 1.4px);background-size:9px 9px;opacity:.07;pointer-events:none}
    .display{color:#2b4bf2;text-shadow:4px 4px 0 rgba(255,75,75,.75)}
    .tag{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(16px,2.4vw,22px);transform:rotate(-1deg)}
    .wrow{background:#fff;border:2px solid #1e1b4f;box-shadow:5px 5px 0 rgba(255,75,75,.7);padding:14px;transform:rotate(.8deg)}
    .k{color:#ff4b4b}.tape{position:absolute;width:120px;height:26px;background:rgba(43,75,242,.25);transform:rotate(-4deg);top:12px;left:40%;z-index:2}`,
    heroExtra: `<span class="tape"></span>`,
  },
  {
    id: '13-academia',
    layout: 'manifesto', title: 'Dark Academia', desc: 'Coklat tua, krem, emas redup, serif klasik dengan italic.',
    vars: { bg: '#191410', ink: '#efe3c8', sub: '#a8977a', rule: '#3a2f22', accent: '#c9a227', disp: 'Instrument Serif', bodyf: 'Georgia' },
    css: `.display{font-style:italic;font-weight:400;text-transform:none;letter-spacing:0;font-size:clamp(44px,9.5vw,104px);line-height:1}
    .tag{font-style:italic}.t{font-family:Georgia,serif;font-weight:400;font-size:20px}
    .k,.who{letter-spacing:.24em;text-transform:uppercase;font-size:10px}.mail{font-family:Georgia,serif;font-weight:400;text-transform:uppercase;letter-spacing:.18em;font-size:15px}
    .wrow{padding:22px 0}.no{font-family:Georgia,serif;color:var(--accent)}`,
  },
  {
    id: '14-retroos',
    layout: 'window', title: 'Retro OS — Windows 95', desc: 'Jendela bevel, title bar navy, taskbar. Parodi sistem operasi.',
    vars: { bg: '#008080', ink: '#000000', sub: '#222222', rule: '#808080', accent: '#000080', disp: 'Segoe UI', bodyf: 'Segoe UI' },
    body: `<main class="shell"><div class="win">
      <div class="titlebar"><span>NUR_FAJAR.EXE — Portfolio 2026</span><span class="tbtns"><span class="tbtn">_</span><span class="tbtn">□</span><span class="tbtn">×</span></span></div>
      <div class="menubar"><span>File</span><span>Edit</span><span>View</span><span>Help</span></div>
      <div class="body">
        <h1 class="display" data-split>Nur Fajar</h1>
        <p class="tag">AI specialist who builds apps and communities.</p>
        <div class="group" data-reveal><p class="k">C:\\work\\crm-pipeline</p><p>AI build · Revenue ops — 9 Python + LLM agents, human approval before sending.</p><p class="h">Result: ~11h runtime vs 300+h manual (96% less)</p></div>
        <div class="btnrow"><span class="btn">Download CV</span><span class="btn">Email me</span></div>
      </div>
    </div>
    <div class="taskbar"><span class="taskbtn">Start</span><span>Nur_Fajar.exe — running</span></div></main>`,
    css: `.win{border:2px solid;border-color:#dfdfdf #404040 #404040 #dfdfdf;background:#c0c0c0;box-shadow:3px 3px 0 rgba(0,0,0,.55);display:flex;flex-direction:column}
    .titlebar{background:linear-gradient(90deg,#000080,#1084d0);color:#fff;font-size:13px;font-weight:700;padding:4px 6px;display:flex;justify-content:space-between;align-items:center}
    .tbtns{display:flex;gap:3px}.tbtn{background:#c0c0c0;border:2px solid;border-color:#dfdfdf #404040 #404040 #dfdfdf;width:18px;height:16px;display:grid;place-items:center;font-size:9px;color:#000}
    .menubar{font-size:12px;padding:3px 8px;border-bottom:1px solid #808080;display:flex;gap:14px}
    .body{padding:clamp(14px,3vw,30px);display:flex;flex-direction:column;flex:1}
    .display{font-size:clamp(30px,6.5vw,64px);letter-spacing:-1px;text-transform:none}
    .group{border:2px groove #dfdfdf;padding:12px 14px;display:grid;gap:8px;font-size:12px;margin-top:18px}
    .btn{border:2px solid;border-color:#dfdfdf #404040 #404040 #dfdfdf;background:#c0c0c0;color:#000;box-shadow:1px 1px 0 #000;border-radius:0}
    .btnrow{margin-top:18px;display:flex;gap:8px;justify-content:flex-end}
    .taskbar{margin-top:12px;border:2px solid;border-color:#dfdfdf #404040 #404040 #dfdfdf;background:#c0c0c0;padding:4px;display:flex;gap:8px;font-size:12px}
    .taskbtn{border:2px solid;border-color:#404040 #dfdfdf #dfdfdf #404040;background:#c0c0c0;padding:3px 12px;font-weight:700}`,
  },
  {
    id: '15-zen',
    layout: 'minimal', title: 'Zen Minimal / Jepang', desc: 'Ruang kosong sangat besar, satu enso, teks vertikal. Konfidensi lewat keheningan.',
    vars: { bg: '#faf9f4', ink: '#22211d', sub: '#8f8b7e', rule: '#e5e2d8', accent: '#b23a12', disp: 'Georgia', bodyf: 'Georgia' },
    css: `body{font-size:14px}.shell{max-width:820px}
    .display{font-weight:400;text-transform:none;letter-spacing:.02em;font-size:clamp(34px,7vw,76px);max-width:10em}
    .tag{line-height:2;font-size:13px}.meta{letter-spacing:.4em}.who,.k{letter-spacing:.3em;text-transform:uppercase;font-size:10px}
    .mail{font-weight:400;text-transform:uppercase;letter-spacing:.3em;font-size:13px}
    .wrap{position:relative;min-height:88svh;display:flex;flex-direction:column}
    .vtext{position:absolute;top:0;right:0;writing-mode:vertical-rl;font-size:11px;letter-spacing:.5em;color:var(--sub);height:68%}
    .enso{position:absolute;bottom:30%;right:10%;width:72px;height:72px;border:2.5px solid #22211d;border-radius:50%;border-left-color:transparent;transform:rotate(-30deg);opacity:.8}`,
    heroExtra: `<p class="vtext">AI SPECIALIST · APPS · COMMUNITIES</p><span class="enso"></span>`,
  },
  {
    id: '16-kinetic',
    layout: 'manifesto', title: 'Kinetic Typography', desc: 'Teks raksasa solid/outline, satu kata merah bergeser. Tipe sebagai seluruh desain.',
    vars: { bg: '#ffffff', ink: '#111111', sub: '#777777', rule: '#111111', accent: '#e63200', disp: 'Archivo', bodyf: 'Inter' },
    motion: 'marquee',
  body: `<main class="shell">
      <div class="meta"><span>NUR FAJAR</span><span>FOLIO — 2026</span></div>
      <div class="stack">
        <span class="w" data-split>Builds apps</span>
        <span class="w o" data-split>Builds</span>
        <span class="w r move" data-split>Communities</span>
        <span class="w small" data-reveal>AI specialist — CRM pipeline: 96% less manual outreach.</span>
        <span class="w o" data-split>Ships.</span>
      </div>
      <div class="foot"><span>WORK · PRAISE · HISTORY</span><a href="mailto:hi@nurfajar.com">hi@nurfajar.com</a></div>
    </main>`,
    css: `.stack{margin-top:clamp(14px,3.5vh,36px);display:flex;flex-direction:column;line-height:.88}
    .w{font-weight:900;text-transform:uppercase;font-size:clamp(42px,10vw,116px);letter-spacing:-.03em;white-space:nowrap}
    .w.o{color:transparent;-webkit-text-stroke:2px #111}
    .w.r{color:#e63200}.w.small{font-size:clamp(19px,4.2vw,46px);font-weight:600;text-transform:none;color:#777;font-family:Inter,sans-serif}
    .w.move{animation:s16slide 4s ease-in-out infinite alternate}
    @keyframes s16slide{from{transform:translateX(0)}to{transform:translateX(5%)}}
    .foot{margin-top:auto;padding-top:16px;display:flex;justify-content:space-between;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border-top:3px solid #111}
    .foot a{color:#e63200}`,
  },
  {
    id: '17-industrial', title: 'Industrial / Military Terminal', desc: 'Panel logam, sekrup, garis hazard, stencil, barcode.',
    vars: { bg: '#26251f', ink: '#d8d5c8', sub: '#8f8d7c', rule: '#4a4940', accent: '#e8c81e', disp: 'Allerta Stencil', bodyf: 'JetBrains Mono' },
    css: `body::before{content:'';position:fixed;top:0;left:0;right:0;height:8px;background:repeating-linear-gradient(45deg,#e8c81e 0 14px,#111 14px 28px);z-index:5}
    .display{letter-spacing:.04em;text-transform:uppercase;color:var(--accent);font-size:clamp(34px,8vw,88px);line-height:1}
    .tag,.k,.who{letter-spacing:.2em;text-transform:uppercase}.t{letter-spacing:.06em;color:#fff}
    .wrow{border:1px solid var(--rule);padding:12px 14px}.mail{font-size:13px;letter-spacing:.14em;text-transform:uppercase}
    .barcode{margin-top:auto;height:34px;background:repeating-linear-gradient(90deg,#d8d5c8 0 2px,transparent 2px 5px,#d8d5c8 5px 6px,transparent 6px 11px);opacity:.75}`,
    heroExtra: `<span class="barcode"></span>`,
  },
  {
    id: '18-clay',
    layout: 'cardgrid', title: 'Claymorphism', desc: 'Bentuk tanah liat mengembang: radius besar, double shadow manis, pastel.',
    vars: { bg: '#e8ebff', ink: '#3d3a6b', sub: '#7a76a8', rule: '#d5d8f5', accent: '#8f7bff', disp: 'Nunito', bodyf: 'Nunito' },
    motion: 'tilt',
    css: `.card{position:relative;background:#f4f5ff;border-radius:34px;padding:clamp(20px,4vw,44px);min-height:88svh;display:flex;flex-direction:column;box-shadow:inset 10px 10px 24px rgba(255,255,255,.85),inset -10px -10px 24px rgba(184,189,240,.35),16px 24px 48px rgba(109,92,255,.22)}
    .wrow,.praise,.contact{background:#fff;border-radius:24px;padding:16px 18px;box-shadow:8px 12px 24px rgba(109,92,255,.14),inset 4px 4px 10px #fff;border:none;margin-top:14px}
    .btn{background:#8f7bff;color:#fff;border-radius:999px;box-shadow:6px 10px 20px rgba(143,123,255,.35)}
    .display span{color:#8f7bff}.display{font-weight:900;text-transform:none}`,
  },
  {
    id: '19-vaporwave',
    layout: 'centered', title: 'Vaporwave / Synthwave', desc: 'Matahari terbenam bergaris, grid neon perspektif, katakana, glow pink-cyan.',
    vars: { bg: '#1a0b3d', ink: '#ffffff', sub: '#01cdfe', rule: 'rgba(1,205,254,.4)', accent: '#ffd319', disp: 'Orbitron', bodyf: 'Orbitron' },
    css: `body{background:linear-gradient(180deg,#1a0b3d 0%,#4b1a7a 42%,#b967ff 60%,#ff71ce 64%,#2b1055 65%,#1a0b3d 100%);position:relative}
    body::before{content:'';position:absolute;left:50%;top:8%;transform:translateX(-50%);width:min(280px,48vw);aspect-ratio:1;border-radius:50%;background:linear-gradient(180deg,#ffd319,#ff2975 75%);z-index:-1}
    body::after{content:'';position:absolute;left:-20%;right:-20%;bottom:-4%;height:40%;background:repeating-linear-gradient(90deg,rgba(1,205,254,.45) 0 2px,transparent 2px 64px),repeating-linear-gradient(0deg,rgba(1,205,254,.45) 0 2px,transparent 2px 42px);transform:perspective(300px) rotateX(56deg);transform-origin:top;pointer-events:none}
    .display{text-align:center;letter-spacing:.06em;text-shadow:0 0 18px rgba(255,113,206,.8),4px 4px 0 #2b1055}
    .tag{text-align:center;letter-spacing:.3em;text-transform:uppercase;font-size:10px}.t{text-align:center}
    .wrow{border:1px solid #01cdfe;background:rgba(26,11,61,.78);box-shadow:0 0 22px rgba(255,113,206,.4);padding:13px 15px}
    .mail{font-size:clamp(18px,3.4vw,36px);text-shadow:0 0 14px rgba(255,113,206,.8)}.jp{position:absolute;top:9%;left:6%;writing-mode:vertical-rl;font-size:13px;letter-spacing:.4em;color:#01cdfe;opacity:.85;z-index:2}`,
    heroExtra: `<span class="jp">ヌル・ファジャル</span>`,
  },
  {
    id: '20-luxury',
    layout: 'typeonly',
    layout: 'minimal', title: 'Dark Luxury', desc: 'Hitam pekat, emas tipis, serif italic, corner ornaments. Sunyi dan mahal.',
    vars: { bg: '#0a0a0a', ink: '#f0ece2', sub: '#8f8b7e', rule: '#2e2a20', accent: '#c8a45d', disp: 'Instrument Serif', bodyf: 'Georgia' },
    css: `.shell{text-align:center}.display{font-weight:400;text-transform:none;letter-spacing:.06em;font-size:clamp(40px,8vw,92px)}
    .display em{font-style:italic;color:var(--accent)}.meta{letter-spacing:.5em;justify-content:center;gap:2em}
    .wrow{display:flex;justify-content:center;gap:16px}.t{font-family:Georgia,serif;font-weight:400;font-size:17px}
    .k,.who,.sub{letter-spacing:.3em;text-transform:uppercase;font-size:10px}
    .mail{font-family:Georgia,serif;font-weight:400;letter-spacing:.04em}
    .frame{border:1px solid #2e2a20;min-height:100svh;padding:clamp(20px,4vw,48px);display:flex;flex-direction:column;justify-content:center;position:relative}`,
  },
  {
    id: '22-brokengrid',
    layout: 'asym', title: 'Broken Grid / Swiss-Punk', desc: 'Grid dipecah, tipe miring tumpang tindih, serif × grotesk × mono, grain.',
    vars: { bg: '#e8e4dc', ink: '#141414', sub: '#555555', rule: '#141414', accent: '#d43a18', disp: 'Archivo', bodyf: 'Inter' },
    body: `<main class="shell"><div class="field">
      <span class="piece p1" data-split>Nur Fajar</span>
      <span class="piece p2" data-reveal>builds apps<br />&amp; communities</span>
      <span class="piece p3" data-reveal>WORK 01 — CRM pipeline. AI build, revenue ops. 9 Python + LLM agents, human review before anything sends. ~11h runtime vs 300+h manual (96% less).</span>
      <span class="piece p4" data-split>Folio</span>
      <span class="piece p5">OCT 2026</span>
      <span class="piece p6" data-reveal>"He takes ownership, learns fast, and delivers." — Arnold Doray, CTO, Wingfin</span>
    </div></main>`,
    motion: 'tilt',
    css: `body::after{content:'';position:fixed;inset:0;pointer-events:none;opacity:.07;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E")}
    .field{position:relative;min-height:82svh}
    .piece{position:absolute;line-height:.95}
    .p1{font-weight:900;font-size:clamp(56px,12vw,150px);text-transform:uppercase;letter-spacing:-.03em;top:4%;left:4%;transform:rotate(-4deg)}
    .p2{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(28px,6vw,72px);top:36%;right:6%;transform:rotate(3deg);color:var(--accent)}
    .p3{font-family:'JetBrains Mono',monospace;font-size:clamp(11px,1.6vw,15px);top:58%;left:14%;max-width:30em;transform:rotate(-1deg);border-top:2px solid #141414;padding-top:10px}
    .p4{font-weight:900;font-size:clamp(38px,8.5vw,104px);text-transform:uppercase;bottom:6%;right:8%;transform:rotate(2deg);color:transparent;-webkit-text-stroke:2px #141414}
    .p5{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;bottom:14%;left:4%;transform:rotate(-6deg);color:var(--accent)}
    .p6{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(14px,2vw,20px);bottom:2%;left:30%;transform:rotate(1deg);color:#333}`,
  },
  {
    id: '23-horizontal',
    layout: 'rail', title: 'Horizontal Scroll Gallery', desc: 'Galeri menyamping dengan snap — pola Locomotive. Scroll ke samping.',
    vars: { bg: '#111111', ink: '#f0f0f0', sub: '#999999', rule: '#2c2c2c', accent: '#ff4d00', disp: 'Inter', bodyf: 'Inter' },
    body: `<main class="shell">
      <div class="meta"><span>Selected work</span><span>Scroll sideways →</span></div>
      <div class="rail">
        <div class="card hi" data-reveal><span class="no">01</span><span class="t">CRM pipeline</span><span class="h">AI build · Revenue ops — ~11h runtime vs 300+h manual (96% less)</span></div>
        <div class="card" data-reveal><span class="no">02</span><span class="t">Curriculum engine</span><span class="h">5 programs · 150+ participants</span></div>
        <div class="card" data-reveal><span class="no">03</span><span class="t">Web builds</span><span class="h">3 sites live — Next.js + TS</span></div>
        <div class="card" data-reveal><span class="no">04</span><span class="t">Social content</span><span class="h">4 alumni videos · 24 posts</span></div>
        <div class="card" data-reveal><span class="no">05</span><span class="t">Remember</span><span class="h">Desktop app · in development</span></div>
        <div class="card" data-reveal><span class="no">06</span><span class="t">Nyunda</span><span class="h">Android app · in development</span></div>
      </div>
      <p class="hint">← drag / scroll →</p>
      <div class="contact"><a class="mail" href="mailto:hi@nurfajar.com">hi@nurfajar.com</a><p class="sub">Available immediately · replies within 24 hours.</p></div>
    </main>`,
    css: `.rail{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:10px 0 18px}
    .card{flex:none;width:min(340px,78vw);scroll-snap-align:start;border:1px solid var(--rule);border-radius:10px;padding:18px;display:flex;flex-direction:column;gap:10px;min-height:280px;background:#181818}
    .card.hi{background:var(--accent);color:#111;border-color:var(--accent)}
    .card.hi .no,.card.hi .h{color:rgba(0,0,0,.65)}
    .t{font-size:22px;font-weight:700;letter-spacing:-.02em;margin-top:auto}.h{font-size:12px}
    .hint{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#666;margin-top:4px}
    .contact{border-top:none;padding-top:26px}.mail{font-size:clamp(22px,4.4vw,44px)}`,
  },
  {
    id: '26-contour', title: 'Topographic Contour', desc: 'Garis kontur peta topografi — saudara daratan dari atlas-mu. Garis digambar saat masuk.',
    vars: { bg: '#f4f2ec', ink: '#25301f', sub: '#4c5a35', rule: '#7a8a5e', accent: '#b23a12', disp: 'Archivo', bodyf: 'Inter' },
    motion: 'draw',
    body: `<svg class="contours" viewBox="0 0 1100 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path class="draw" d="M-20,120 C160,60 300,150 460,120 C640,88 760,170 920,140 C1020,122 1080,140 1130,130" />
      <path class="draw" d="M-20,190 C170,130 320,215 480,185 C660,152 780,240 940,208 C1040,188 1090,208 1130,198" />
      <path class="draw mj" d="M-20,265 C180,200 340,290 500,258 C680,224 800,315 960,282 C1055,262 1095,280 1130,272" />
      <path class="draw" d="M-20,340 C190,272 360,365 520,332 C700,296 820,390 980,356 C1060,338 1100,352 1130,346" />
      <path class="draw" d="M-20,415 C200,345 380,440 540,406 C720,368 840,464 1000,430 C1070,414 1105,426 1130,420" />
      <path class="draw mj" d="M-20,490 C210,418 400,515 560,480 C740,440 860,538 1020,504 C1075,492 1108,500 1130,494" />
      <path class="draw" d="M-20,60 C150,10 290,90 450,62 C630,30 750,105 910,78 C1010,60 1080,78 1130,68" />
    </svg>
    <main class="shell"><header class="hero" style="position:relative">
      <div class="meta"><span>NUR FAJAR</span><span>ELEV. 600 M — OCT 2026</span></div>
      <h1 class="display" data-split>Nur Fajar</h1>
      <p class="tag" data-reveal>AI specialist who builds apps and communities.</p>
      <div class="cta" data-reveal><a class="btn" href="#">See selected work</a><a class="lnk" href="#">hi@nurfajar.com</a></div>
    </header></main>`,
    motion: 'parallax',
  css: `.contours{position:fixed;inset:0;width:100%;height:100%;z-index:-1}
    .contours path{fill:none;stroke:#7a8a5e;stroke-width:1;opacity:.5}.contours path.mj{stroke:#4c5a35;opacity:.75}
    .display{text-shadow:0 0 6px #f4f2ec,0 0 12px #f4f2ec}`,
  },
  {
    id: '27-ascii',
    layout: 'centered', title: 'ASCII / Generative Canvas', desc: 'Medan karakter ASCII berdenyut 60fps — kode sebagai tekstur hidup.',
    vars: { bg: '#050805', ink: '#b8ffb8', sub: '#3f7a3f', rule: '#1e2e1e', accent: '#7be07b', disp: 'JetBrains Mono', bodyf: 'JetBrains Mono' },
    motion: 'ascii',
    css: `.display{font-weight:500;letter-spacing:.1em;text-transform:uppercase;font-size:clamp(22px,4.6vw,44px)}
    .tag{font-size:12px}.meta,.who,.k,.no{letter-spacing:.14em;text-transform:uppercase;font-size:10px}
    .mail{font-weight:500;letter-spacing:.08em}
    canvas{display:block;width:100%;height:260px;border:1px solid var(--rule);margin-top:10px}`,
    heroExtra: `<canvas id="ascii" width="120" height="26"></canvas>`,
  },
  {
    id: '28-brutlux',
    layout: 'typeonly',
    layout: 'minimal', title: 'Brutal Luxury (Balenciaga)', desc: 'Helvetica polos, tanpa warna, tanpa shadow — keberanian lewat pengurangan total.',
    vars: { bg: '#ffffff', ink: '#000000', sub: '#555555', rule: '#000000', accent: '#000000', disp: 'Helvetica Neue', bodyf: 'Helvetica Neue' },
    css: `body{font-size:14px}.display{font-weight:400;text-transform:none;letter-spacing:-.01em;font-size:clamp(28px,5.2vw,62px);line-height:1.12;max-width:14em}
    .tag{line-height:1.7;font-size:13px;color:#555}.t{font-weight:400}.k{font-weight:400;letter-spacing:.01em;text-transform:none;font-size:12px}
    .mail{font-weight:400;text-transform:none;letter-spacing:0;font-size:16px}.btn{border:1px solid #000;border-radius:0;background:#fff;color:#000;padding:10px 24px}`,
  },
  {
    id: '29-apple',
    layout: 'poster', title: 'Apple', desc: 'Putih, tipe produk raksasa, abu, biru link. Dunia v7 sebagai perbandingan.',
    vars: { bg: '#ffffff', ink: '#1d1d1f', sub: '#6e6e73', rule: '#e8e8ed', accent: '#0071e3', disp: 'Inter', bodyf: 'Inter' },
    motion: 'count',
    css: `.shell{text-align:center}.display{font-weight:700;letter-spacing:-.025em;text-transform:none;font-size:clamp(40px,8vw,88px);line-height:1.05}
    .meta{justify-content:center;border-bottom:1px solid var(--rule);gap:2em}
    .wrow{display:block;border-top:1px solid var(--rule);text-align:center}.t{font-size:18px;font-weight:600}
    .mail{font-weight:600;letter-spacing:-.02em;font-size:clamp(24px,4.4vw,44px)}.lnk,.btn{color:var(--accent);background:none;font-size:14px}
    .btn{border:none;padding:0}.h b{background:none;color:var(--accent);padding:0}`,
  },
  {
    id: '30-google',
    layout: 'centered', title: 'Google', desc: 'Putih, Roboto, empat warna brand, pill pencarian, kartu bersih.',
    vars: { bg: '#ffffff', ink: '#202124', sub: '#5f6368', rule: '#dfe1e5', accent: '#4285f4', disp: 'Roboto', bodyf: 'Roboto' },
    css: `.display{font-weight:500;letter-spacing:-1px;text-transform:none;text-align:center}
    .display .r{color:#ea4335}.display .b{color:#4285f4}.display .y{color:#fbbc05}.display .g{color:#34a853}
    .search{margin:20px auto 0;max-width:480px;border:1px solid #dfe1e5;border-radius:999px;padding:12px 20px;color:#5f6368;font-size:14px;display:flex;justify-content:space-between}
    .meta{justify-content:flex-end}.t{font-weight:500}.mail{font-weight:400;text-transform:none;font-size:15px}`,
    heroExtra: `<div class="search"><span>nur fajar — AI specialist portfolio</span><span>🔍</span></div>`,
  },
  {
    id: '31-stripe',
    layout: 'magazine', title: 'Stripe', desc: 'Gradien anguler khas di kanan atas, navy, tombol pill. SaaS paling ditiru.',
    vars: { bg: '#ffffff', ink: '#0a2540', sub: '#425466', rule: '#e6e9f0', accent: '#635bff', disp: 'Inter', bodyf: 'Inter' },
    css: `body{position:relative;overflow:hidden}
    body::before{content:'';position:absolute;top:-45%;right:-25%;width:90%;height:130%;background:linear-gradient(120deg,#635bff,#00d4ff 55%,#00f5a0);transform:rotate(-12deg);border-radius:0 0 45% 45%;opacity:.92}
    .shell{position:relative}.display{text-transform:none;letter-spacing:-.025em;font-weight:700;max-width:12em}
    .mail{font-weight:700;text-transform:none}.btn{background:#0a2540;color:#fff}`,
  },
  {
    id: '33-vercel',
    layout: 'typeonly',
    layout: 'minimal', title: 'Vercel', desc: 'Hitam-putih absolut, segitiga, mono detail. Nol dekorasi.',
    vars: { bg: '#000000', ink: '#ffffff', sub: '#888888', rule: '#222222', accent: '#ffffff', disp: 'Inter', bodyf: 'Inter' },
    css: `.shell{text-align:center}.display{font-weight:700;letter-spacing:-.03em;text-transform:none;font-size:clamp(32px,6.5vw,62px)}
    .meta{justify-content:center;border-bottom:1px solid #222;gap:2em}.tri{font-size:clamp(38px,6.5vw,68px);margin-top:clamp(24px,6vh,54px)}
    .t{font-weight:600}.mail{font-weight:700;letter-spacing:-.02em;font-size:clamp(24px,4.4vw,44px)}.lnk{color:#fff;border-color:#444}`,
    heroExtra: `<p class="tri">▲</p>`,
  },
  {
    id: '34-notion', title: 'Notion', desc: 'Halaman dokumen dengan ikon emoji, callout abu, link bergaris bawah.',
    vars: { bg: '#ffffff', ink: '#191918', sub: '#5f5e5b', rule: '#ededec', accent: '#191918', disp: 'Inter', bodyf: 'Inter' },
    css: `.display{font-weight:700;letter-spacing:-.03em;text-transform:none;font-size:clamp(32px,6.8vw,70px)}
    .pageicon{width:46px;height:46px;border:1px solid #e3e2e0;border-radius:8px;display:grid;place-items:center;font-size:22px;margin-top:clamp(22px,5vh,44px)}
    .callout{background:#f6f5f4;border-radius:10px;padding:14px 16px;display:flex;gap:10px;font-size:14px;margin-top:18px}
    .callout .em{font-size:18px}.mail{font-weight:600;text-transform:none;letter-spacing:-.02em;font-size:clamp(22px,4.4vw,40px)}.lnk{text-decoration:underline;color:#191918}`,
    heroExtra: `<div class="pageicon">🤖</div>`,
    heroAfter: `<div class="callout" data-reveal><span class="em">💡</span><span>Work 01 — CRM pipeline: 9 Python + LLM agents, human approval before sending. Result: 96% less manual outreach.</span></div>`,
  },
  {
    id: '35-figma',
    layout: 'cardgrid', title: 'Figma', desc: 'Putih dengan chip lima warna brand, heading tebal, kartu lembut.',
    vars: { bg: '#ffffff', ink: '#1e1e1e', sub: '#555555', rule: '#e6e6e6', accent: '#f24e1e', disp: 'Inter', bodyf: 'Inter' },
    css: `.display{font-weight:800;letter-spacing:-.035em;text-transform:none}
    .chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}
    .chips span{border-radius:999px;padding:8px 15px;font-size:12px;font-weight:600;color:#fff}
    .c1{background:#f24e1e}.c2{background:#a259ff}.c3{background:#1abcfe}.c4{background:#0acf83}.c5{background:#ff7262}
    .wrow{border:1px solid var(--rule);border-radius:12px;padding:16px;box-shadow:0 4px 14px rgba(0,0,0,.06);margin-top:14px}
    .mail{font-weight:700;text-transform:none;letter-spacing:-.02em;font-size:clamp(22px,4.4vw,40px)}`,
    heroExtra: `<div class="chips"><span class="c1">AI build</span><span class="c2">Curriculum</span><span class="c3">Web builds</span><span class="c4">Content</span><span class="c5">Apps</span></div>`,
  },
  {
    id: '36-github',
    layout: 'timeline', title: 'GitHub', desc: 'Dark code UI: repo card, commit message, syntax warna.',
    vars: { bg: '#0d1117', ink: '#e6edf3', sub: '#7d8590', rule: '#30363d', accent: '#2f81f7', disp: 'Inter', bodyf: 'Inter' },
    css: `.display{font-weight:700;letter-spacing:-.025em;text-transform:none;font-size:clamp(30px,6vw,58px)}
    .code{margin-top:20px;border:1px solid var(--rule);border-radius:10px;padding:14px;font-family:'JetBrains Mono';font-size:12px;line-height:1.9;color:#7d8590;display:grid;gap:8px}
    .code .t{color:#2f81f7;font-size:15px}.badge{display:inline-block;background:#238636;color:#fff;border-radius:6px;padding:5px 12px;font-size:11px;font-weight:600;justify-self:start}
    .g{color:#3fb950}.r{color:#f85149}.bl{color:#79c0ff}.mail{font-weight:600;text-transform:none;font-size:clamp(22px,4.4vw,40px)}`,
    heroExtra: `<div class="code" data-reveal><span class="t">crm-pipeline/</span><span><span class="g">+2,140</span> <span class="r">-312</span> · 9 agents · human-in-the-loop</span><span>commit: "ship it — <span class="bl">96% less manual outreach</span>"</span><span class="badge">Merged · Oct 2026</span></div>`,
  },
  {
    id: '37-openai',
    layout: 'poster', title: 'OpenAI', desc: 'Putih minimal, geometri bersih, satu prompt bar di tengah.',
    vars: { bg: '#ffffff', ink: '#0d0d0d', sub: '#6e6e80', rule: '#ececf1', accent: '#0d0d0d', disp: 'Inter', bodyf: 'Inter' },
    css: `.shell{text-align:center}.display{font-weight:600;letter-spacing:-.035em;text-transform:none;font-size:clamp(36px,7vw,76px)}
    .meta{justify-content:center;gap:2em}.tag{margin-left:auto;margin-right:auto}
    .prompt{margin:24px auto 0;max-width:520px;border:1px solid #e5e5e5;border-radius:12px;padding:14px 16px;display:flex;justify-content:space-between;color:#8e8ea0;font-size:14px}
    .wrow{text-align:left}.mail{font-weight:600;text-transform:none;letter-spacing:-.02em;font-size:clamp(24px,4.6vw,46px)}`,
    heroExtra: `<div class="prompt"><span>Ask about my work — try "what did the CRM pipeline save?"</span><span>→</span></div>`,
  },
  {
    id: '39-spotify', title: 'Spotify', desc: 'Hitam + hijau #1db954, heading extra-bold, pill tebal.',
    vars: { bg: '#000000', ink: '#ffffff', sub: '#b3b3b3', rule: '#282828', accent: '#1db954', disp: 'Nunito', bodyf: 'Nunito' },
    css: `.display{font-weight:900;letter-spacing:-.03em;text-transform:none;font-size:clamp(38px,8.5vw,92px);line-height:1}
    .bar{align-items:center}.logo{width:34px;height:34px;border-radius:50%;background:#1db954;display:grid;place-items:center;color:#000;font-weight:900;font-size:15px}
    .btn{background:#1db954;color:#000;border-radius:999px;font-weight:900}.mail{font-weight:900;text-transform:none;letter-spacing:-.02em;font-size:clamp(24px,4.6vw,46px)}
    .tag{font-weight:700}`,
  },
  {
    id: '40-airbnb',
    layout: 'cardgrid', title: 'Airbnb', desc: 'Rausch merah muda, kartu membulat dengan foto-gradien, search pill.',
    vars: { bg: '#ffffff', ink: '#222222', sub: '#717171', rule: '#ebebeb', accent: '#ff385c', disp: 'Inter', bodyf: 'Inter' },
    css: `.display{font-weight:800;letter-spacing:-.03em;text-transform:none;font-size:clamp(34px,7vw,74px)}
    .searchpill{display:inline-block;border:1px solid #ddd;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.08);padding:9px 16px;font-size:12px;font-weight:600}
    .pcards{margin-top:20px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    .pcard{border-radius:14px;overflow:hidden;border:1px solid #ebebeb}
    .pcard .img{background:linear-gradient(135deg,rgba(255,56,92,.18),rgba(255,176,200,.3));height:60px}
    .pcard .b{padding:10px 12px;font-size:12px}.pcard .b b{color:#ff385c}
    .mail{font-weight:800;text-transform:none;letter-spacing:-.02em;font-size:clamp(22px,4.4vw,40px)}
    @media(max-width:720px){.pcards{grid-template-columns:1fr}}`,
    heroExtra: `<div class="pcards" data-reveal>
      <div class="pcard"><span class="img"></span><p class="b"><b>CRM pipeline</b><br />96% less manual outreach</p></div>
      <div class="pcard"><span class="img" style="background:linear-gradient(135deg,rgba(0,120,255,.15),rgba(0,200,255,.3))"></span><p class="b"><b>Curriculum engine</b><br />150+ participants</p></div>
      <div class="pcard"><span class="img" style="background:linear-gradient(135deg,rgba(255,200,0,.2),rgba(255,120,0,.25))"></span><p class="b"><b>Social content</b><br />24 posts · 4 videos</p></div>
    </div>`,
  },
  {
    id: '41-slack', title: 'Slack', desc: 'Channel list, aubergine + empat warna, kartu putih membulat.',
    vars: { bg: '#ffffff', ink: '#1d1c1d', sub: '#616061', rule: '#ebebeb', accent: '#1264a3', disp: 'Inter', bodyf: 'Inter' },
    css: `.display{font-weight:800;letter-spacing:-.03em;text-transform:none;font-size:clamp(34px,7vw,76px)}
    .chans{display:grid;gap:8px;max-width:420px;margin-top:20px}
    .chan{border:1px solid #ebebeb;border-radius:10px;padding:10px 14px;font-size:13px;display:flex;gap:8px;align-items:center}
    .h1c{color:#e01e5a;font-weight:800}.h2c{color:#2eb67d;font-weight:800}.h3c{color:#ecb22e;font-weight:800}.h4c{color:#4a154b;font-weight:800}
    .mail{font-weight:800;text-transform:none;letter-spacing:-.02em;font-size:clamp(22px,4.4vw,40px)}`,
    heroExtra: `<div class="chans" data-reveal>
      <span class="chan"><span class="h1c">#</span> crm-pipeline — shipped, 96% less manual outreach</span>
      <span class="chan"><span class="h2c">#</span> curriculum-engine — 5 programs · 150+ participants</span>
      <span class="chan"><span class="h3c">#</span> praise — "He takes ownership, learns fast."</span>
      <span class="chan"><span class="h4c">#</span> contact — hi@nurfajar.com · replies in 24h</span>
    </div>`,
  },
  {
    id: '42-discord',
    layout: 'centered', title: 'Discord', desc: 'Blurple penuh, heading chunky, pill putih.',
    vars: { bg: '#5865f2', ink: '#ffffff', sub: '#dcdef2', rule: 'rgba(255,255,255,.25)', accent: '#ffffff', disp: 'Nunito', bodyf: 'Nunito' },
    css: `.display{font-weight:900;letter-spacing:-.025em;text-transform:none;font-size:clamp(36px,7.5vw,80px);line-height:1.04}
    .btn{background:#fff;color:#5865f2;border-radius:999px;font-weight:900}.mail{font-weight:900;text-transform:none;letter-spacing:-.02em;font-size:clamp(24px,4.6vw,46px)}`,
  },
  {
    id: '43-framer',
    layout: 'centered', title: 'Framer', desc: 'Hitam, gradient-border card (biru→pink), heading center.',
    vars: { bg: '#000000', ink: '#ffffff', sub: '#999999', rule: '#1a1a1a', accent: '#0099ff', disp: 'Inter', bodyf: 'Inter' },
    css: `.shell{text-align:center}.display{font-weight:700;letter-spacing:-.035em;text-transform:none;font-size:clamp(36px,7.5vw,80px)}
    .meta{justify-content:center;gap:2em}.tag{margin-left:auto;margin-right:auto}
    .gcard{margin:24px auto 0;max-width:520px;border-radius:14px;border:1px solid transparent;background:linear-gradient(#0a0a0a,#0a0a0a) padding-box,linear-gradient(120deg,#0099ff,#ff0080) border-box;padding:16px 18px;display:flex;justify-content:space-between;align-items:center;font-size:13px;text-align:left}
    .gcard .k{color:#888;font-size:10px;display:block}.mail{font-weight:700;text-transform:none;letter-spacing:-.02em;font-size:clamp(24px,4.6vw,46px)}`,
    heroExtra: `<div class="gcard" data-reveal><span><span class="k">WORK 01 — REVENUE OPS</span><br />CRM pipeline · 96% less manual</span><span>→</span></div>`,
  },
  {
    id: '44-raycast', title: 'Raycast', desc: 'Hitam + glow merah-oranye, command bar ⌘K sebagai bintang.',
    vars: { bg: '#0d0d0d', ink: '#ededed', sub: '#8c8c8c', rule: '#333333', accent: '#ff6348', disp: 'Inter', bodyf: 'Inter' },
    css: `body{position:relative;overflow:hidden}
    body::before{content:'';position:absolute;top:-140px;left:50%;transform:translateX(-50%);width:620px;height:300px;background:radial-gradient(closest-side,rgba(255,99,72,.42),transparent);filter:blur(18px);pointer-events:none}
    .shell{position:relative}.display{font-weight:600;letter-spacing:-.02em;text-transform:none;text-align:center;font-size:clamp(24px,4.5vw,40px)}
    .cmd{margin:clamp(26px,7vh,70px) auto 0;max-width:540px;background:#1a1a1a;border:1px solid #333;border-radius:14px;box-shadow:0 24px 70px rgba(0,0,0,.65);overflow:hidden;text-align:left}
    .cmd .input{padding:13px 16px;font-size:14px;color:#ccc;border-bottom:1px solid #2a2a2a;display:flex;justify-content:space-between;align-items:center}
    .cmd .k{border:1px solid #3a3a3a;border-radius:5px;padding:1px 7px;font-size:11px;color:#999}
    .cmd .item{padding:10px 16px;font-size:13px;color:#aaa;display:flex;justify-content:space-between}
    .cmd .item.on{background:#2a2a2a;color:#fff}
    .mail{font-weight:600;text-transform:none;letter-spacing:-.02em;font-size:clamp(22px,4.4vw,40px)}`,
    heroExtra: `<div class="cmd"><div class="input"><span>nur fajar…</span><span class="k">⌘K</span></div><div class="item on"><span>▸ View CRM pipeline — 96% less manual</span><span>↵</span></div><div class="item"><span>Curriculum engine — 150+ participants</span></div><div class="item"><span>Email Fajar — hi@nurfajar.com</span></div></div>`,
  },
  {
    id: '45-supabase',
    layout: 'timeline', title: 'Supabase', desc: 'Hitam + hijau #3ecf8e + amber, blok kode, mono. Dev-first lugas.',
    vars: { bg: '#121212', ink: '#ededed', sub: '#888888', rule: '#2e2e2e', accent: '#3ecf8e', disp: 'Inter', bodyf: 'Inter' },
    css: `.display{font-weight:700;letter-spacing:-.025em;text-transform:none;font-size:clamp(34px,7vw,72px)}
    .code{margin-top:20px;border:1px solid var(--rule);border-radius:10px;background:#171717;padding:14px 16px;font-family:'JetBrains Mono';font-size:12px;line-height:1.9;color:#888;display:grid;gap:4px}
    .code .g{color:#3ecf8e}.code .a{color:#fe8c00}.code .cm{color:#555}.t{font-weight:600}
    .mail{font-weight:700;text-transform:none;letter-spacing:-.02em;font-size:clamp(22px,4.4vw,40px)}`,
    heroExtra: `<div class="code" data-reveal><span class="cm">// work/01 — revenue ops</span><span><span class="g">agents:</span> 9 <span class="cm">(python + llm)</span></span><span><span class="g">review:</span> human-in-the-loop</span><span><span class="a">result:</span> "~11h runtime vs 300+h manual"</span></div>`,
  },
  {
    id: '46-tailwind',
    layout: 'timeline', title: 'Tailwind CSS', desc: 'Slate gelap, teks gradient sky-cyan, blok kode rounded.',
    vars: { bg: '#0f172a', ink: '#e2e8f0', sub: '#94a3b8', rule: '#1e293b', accent: '#38bdf8', disp: 'Inter', bodyf: 'Inter' },
    css: `.display{font-weight:800;letter-spacing:-.03em;text-transform:none;font-size:clamp(34px,7vw,74px)}
    .display span{background:linear-gradient(90deg,#38bdf8,#06b6d4);-webkit-background-clip:text;background-clip:text;color:transparent}
    .code{margin-top:20px;border:1px solid var(--rule);border-radius:12px;padding:14px 16px;background:#1e293b;font-family:'JetBrains Mono';font-size:12px;color:#94a3b8;line-height:1.9}
    .code .g{color:#2dd4bf}.mail{font-weight:800;text-transform:none;letter-spacing:-.02em;font-size:clamp(24px,4.6vw,46px)}
    .t{font-weight:600}`,
    heroExtra: `<div class="code" data-reveal>const impact = {<br />&nbsp;&nbsp;<span class="g">manualOutreach:</span> "−96%",<br />&nbsp;&nbsp;<span class="g">runtime:</span> "~11h vs 300+h"<br />}</div>`,
  },
  {
    id: '47-arc',
    layout: 'sidebar', title: 'Arc — The Browser Company', desc: 'Gradien pastel hangat, sidebar tab membulat, heading extra-bold.',
    vars: { bg: '#f7f3ee', ink: '#1a1a2e', sub: '#55557a', rule: '#e8e0d4', accent: '#1a1a2e', disp: 'Nunito', bodyf: 'Nunito' },
    css: `body{background:linear-gradient(135deg,#f7f3ee 0%,#ffe8e0 48%,#dff0ff 100%)}
    .side{margin-top:clamp(20px,5vh,44px);background:rgba(255,255,255,.75);border-radius:18px;padding:12px;display:grid;gap:7px;max-width:260px;box-shadow:0 10px 34px rgba(0,0,0,.09)}
    .tab{background:#fff;border-radius:10px;padding:8px 12px;font-size:12px;font-weight:800;box-shadow:0 2px 6px rgba(0,0,0,.05)}
    .tab.on{background:#1a1a2e;color:#fff}
    .display{font-weight:900;letter-spacing:-.025em;text-transform:none;font-size:clamp(34px,7vw,74px)}
    .mail{font-weight:900;text-transform:none;letter-spacing:-.02em;font-size:clamp(22px,4.4vw,40px)}`,
    heroExtra: `<div class="side" data-reveal><span class="tab on">Nur Fajar — AI specialist</span><span class="tab">CRM pipeline · 96% less</span><span class="tab">Curriculum engine · 150+</span><span class="tab">hi@nurfajar.com</span></div>`,
  },
  {
    id: '48-spacex',
    layout: 'minimal', title: 'SpaceX / Tesla', desc: 'Hitam penuh, uppercase tracking lebar, dua tombol ghost. Sinematik dan dingin.',
    vars: { bg: '#000000', ink: '#ffffff', sub: '#888888', rule: '#222222', accent: '#ffffff', disp: 'Inter', bodyf: 'Inter' },
    css: `.shell{text-align:center}.display{font-weight:400;letter-spacing:.42em;text-indent:.42em;text-transform:uppercase;font-size:clamp(24px,5vw,52px);line-height:1.3}
    .meta{letter-spacing:.14em;text-transform:uppercase}.tag{letter-spacing:.24em;text-transform:uppercase;font-size:12px}
    .k,.who,.sub{letter-spacing:.22em;text-transform:uppercase;font-size:10px}
    .ctas{margin-top:24px;display:flex;gap:14px;justify-content:center}
    .btn{border:2px solid #fff;background:none;color:#fff;border-radius:0;padding:11px 30px;font-size:11px;letter-spacing:.16em;text-transform:uppercase}
    .mail{font-weight:400;letter-spacing:.14em;text-transform:uppercase;font-size:clamp(16px,3vw,30px)}`,
    heroExtra: `<div class="ctas"><span class="btn">Selected Work</span><span class="btn">Contact</span></div>`,
  },
  {
    id: '52-carbon',
    title: 'IBM Carbon',
    desc: 'Bahasa ibm.com: masthead gelap permanen, lead space Plex Light, heading Regular 400, rule 1px, tombol tajam berpanah, structured list, kontak g100.',
    vars: { bg: '#ffffff', ink: '#161616', sub: '#525252', rule: '#e0e0e0', accent: '#0f62fe', disp: 'IBM Plex Sans', bodyf: 'IBM Plex Sans' },
    body: `<header class="c-mast"><span class="c-brand">Nur Fajar</span><nav class="c-nav"><a href="#work">Work</a><a href="#praise">Praise</a><a href="#history">History</a><a href="#contact">Contact</a></nav><a class="c-cta" href="mailto:hi@nurfajar.com">hi@nurfajar.com</a></header>
    <main class="c-shell">
      <section class="c-lead">
        <div>
          <p class="eyebrow">AI specialist · Folio 2026</p>
          <h1 class="display c-h1" data-split>Nur Fajar<span class="dot">.</span></h1>
          <p class="c-tag" data-reveal>AI specialist who builds apps and communities. Hi there! I'm Fajar, and I enjoy turning ideas into things that help people learn, work, and solve problems better.</p>
          <div class="cta" data-reveal><a class="btn" href="#work"><span>View selected work</span><span class="ar">→</span></a><a class="btn c-btn2" href="#contact"><span>Get in touch</span><span class="ar">→</span></a></div>
        </div>
        <div class="c-art" data-reveal>
          <svg viewBox="90 160 480 330" aria-hidden="true">
            <defs><pattern id="cgrid" width="26" height="15" patternUnits="userSpaceOnUse"><path d="M0 7.5 L13 0 L26 7.5 M0 7.5 L13 15" fill="none" stroke="#fff" stroke-width="1.1"/></pattern></defs>
            <ellipse cx="320" cy="478" rx="200" ry="26" fill="#161616" opacity=".07"/>
            <g fill="none" stroke="#4589ff" stroke-width="1.4" stroke-dasharray="2 5" opacity=".8">
              <path d="M462.8,290.7 Q436,302 428,316"/>
              <path d="M399.5,247.4 L399.5,282"/>
            </g>
            <polygon points="137.5,267.6 187.5,286.5 187.5,326.5 137.5,307.6" fill="#cccccc"/>
            <polygon points="187.5,286.5 287.6,228.7 287.6,268.7 187.5,326.5" fill="#dedede"/>
            <polygon points="237.6,210.2 287.6,228.7 187.5,286.5 137.5,267.6" fill="#f3f3f3" stroke="#c6c6c6"/>
            <ellipse cx="224.3" cy="235.5" rx="12" ry="6" fill="#2e2e2e"/>
            <ellipse cx="224.3" cy="258.5" rx="5" ry="2.8" fill="#f1c21b"/>
            <polygon points="143.4,342 320,444 320,470 143.4,368" fill="#d5d5d5"/>
            <polygon points="320,444 496.6,342 496.6,368 320,470" fill="#e4e4e4"/>
            <polygon points="320,240 496.6,342 320,444 143.4,342" fill="#f8f8f8" stroke="#c6c6c6"/>
            <polygon points="320,238.6 443.6,300 320,371.4 196.4,300" fill="#e9ebf8"/>
            <polygon points="320,238.6 443.6,300 320,371.4 196.4,300" fill="url(#cgrid)" opacity=".85"/>
            <g stroke="#aeb6f0">
              <polygon points="305.3,240.3 322.9,250.5 322.9,274.5 305.3,264.3" fill="rgba(214,218,248,.5)"/>
              <polygon points="322.9,250.5 340.6,240.3 340.6,264.3 322.9,274.5" fill="rgba(235,237,252,.62)"/>
              <polygon points="322.9,230.1 340.6,240.3 322.9,250.5 305.3,240.3" fill="rgba(255,255,255,.8)"/>
              <polygon points="320,276 337.7,286.2 337.7,310.2 320,300" fill="rgba(214,218,248,.5)"/>
              <polygon points="337.7,286.2 355.3,276 355.3,300 337.7,310.2" fill="rgba(235,237,252,.62)"/>
              <polygon points="337.7,265.8 355.3,276 337.7,286.2 320,276" fill="rgba(255,255,255,.8)"/>
            </g>
            <polygon points="383.3,216.05 399.5,225.4 399.5,247.4 383.3,238.05" fill="#5e2ec7"/>
            <polygon points="399.5,225.4 415.7,216.05 415.7,238.05 399.5,247.4" fill="#7b47e6"/>
            <polygon points="399.5,206.7 415.7,216.05 399.5,225.4 383.3,216.05" fill="#a989ff"/>
            <polygon points="462.8,290.65 493.7,308.5 493.7,320.5 462.8,302.65" fill="#5e2ec7"/>
            <polygon points="493.7,308.5 524.6,290.65 524.6,302.65 493.7,320.5" fill="#7b47e6"/>
            <polygon points="493.7,272.8 524.6,290.65 493.7,308.5 462.8,290.65" fill="#8a3ffc"/>
            <path d="M487.6,287.2 L499.8,294.2 M499.8,287.2 L487.6,294.2" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
            <polygon points="124.2,356.3 253.8,431.1 253.8,455.1 124.2,380.3" fill="#cccccc"/>
            <polygon points="253.8,431.1 287.6,411.5 287.6,435.5 253.8,455.1" fill="#dedede"/>
            <polygon points="158.1,336.7 287.6,411.5 253.8,431.1 124.2,356.3" fill="#fcfcfc"/>
            <g stroke-linecap="round" stroke-width="2.6" fill="none">
              <path d="M159.5,347.8 L193.4,347.8" stroke="#0f62fe"/>
              <path d="M152.1,352 L175.6,352" stroke="#8a3ffc"/>
              <path d="M144.8,356.3 L187.5,356.3" stroke="#a8a8a8"/>
            </g>
          </svg>
        </div>
      </section>

      <section class="c-sec" id="work">
        <p class="eyebrow">Work</p>
        <h2 class="c-h2" data-split>Selected work</h2>
        <div class="wrow" data-reveal><span class="no">01</span><div><p class="k">AI build · Revenue ops</p><p class="t">CRM pipeline</p></div><p class="fact">~11h runtime vs 300+h manual (96% less)</p></div>
        <div class="wrow" data-reveal><span class="no">02</span><div><p class="k">Enablement · Curriculum</p><p class="t">Chatbot curriculum engine</p><p class="h">One chatbot engine on Smojo, adapted for three audiences: business, education, and product managers.</p></div><p class="fact">5 programs · 150+ participants</p></div>
        <div class="wrow" data-reveal><span class="no">03</span><div><p class="k">Web build · Sites shipped</p><p class="t">Web builds that prove shipping</p><p class="h">Two brand concept sites and this portfolio, plus the CRM workspace behind the AI build.</p></div><p class="fact">Next.js + TS + Vercel</p></div>
        <div class="wrow" data-reveal><span class="no">04</span><div><p class="k">Social media content · Video &amp; design</p><p class="t">Social media content</p><p class="h">Course marketing, alumni stories, and holiday greetings.</p></div><p class="fact">4 alumni videos · 24 posts published</p></div>
        <div class="wrow" data-reveal><span class="no">05</span><div><p class="k">Desktop app · In development</p><p class="t">Remember</p><p class="h">A desktop assistant for working with many browser tabs: what each is about, why it was opened, and whether it still matters.</p></div><p class="fact">In development · 100% local storage</p></div>
        <div class="wrow" data-reveal><span class="no">06</span><div><p class="k">Android app · In development</p><p class="t">Nyunda</p><p class="h">A native Android app for English speakers learning Sundanese through small, easy-to-follow lessons.</p></div><p class="fact">In development · free, no account, offline-first</p></div>
      </section>

      <section class="c-sec" id="praise">
        <p class="eyebrow">Praise</p>
        <h2 class="c-h2" data-split>In their words.</h2>
        <div class="qs">
          <div class="q" data-reveal><blockquote>"He takes ownership, learns fast, and delivers. Across programs, curriculum, and our AI data pipeline, I was extremely happy with his work."</blockquote><p class="who">Arnold Doray — Former manager, Terra AI · Now CTO, Wingfin</p></div>
          <div class="q" data-reveal><blockquote>"His organizational skills and proactive approach stood out."</blockquote><p class="who">Christian Jonathan — Product/Program Manager, GoTo · Now AI Program Manager, GovTech Singapore</p></div>
        </div>
      </section>

      <section class="c-sec" id="history">
        <p class="eyebrow">History</p>
        <h2 class="c-h2" data-split>2018 to now.</h2>
        <div class="slist">
          <div class="srow" data-reveal><span class="span">2018 to 2022</span><div><p class="st">Informatics degree, best of the faculty</p><p class="sb">Siliwangi University, 3.94 GPA. Bangkit Academy, with distinction.</p></div></div>
          <div class="srow" data-reveal><span class="span">2021 to 2022</span><div><p class="st">Built a student organization from zero</p><p class="sb">Siliwangi's first GDSC chapter, 0 to 100+ members, four national events.</p></div></div>
          <div class="srow" data-reveal><span class="span">2023 to 2024</span><div><p class="st">Returned as a mentor</p><p class="sb">Machine Learning mentor at Bangkit: 50+ mentees, 90%+ graduating, 40+ sessions.</p></div></div>
          <div class="srow" data-reveal><span class="span">2024 to 2026</span><div><p class="st">Terra AI, trainer to program owner</p><p class="sb">AI Training Specialist for 100+ learners at 9.0/10, then 5 programs for 150+ participants, plus the CRM pipeline.</p></div></div>
        </div>
      </section>
    </main>
    <footer class="c-contact" id="contact">
      <div class="c-shell">
        <a class="c-mail" href="mailto:hi@nurfajar.com" data-split>hi@nurfajar.com</a>
        <div class="c-rows" data-reveal>
          <div class="c-row"><span class="k">Looking for</span><span>Full-time</span></div>
          <div class="c-row"><span class="k">Setup</span><span>Remote or hybrid, onsite in Indonesia, open to relocate</span></div>
          <div class="c-row"><span class="k">Available</span><span>Immediately</span></div>
        </div>
        <p class="c-colo"><span>Built with Next.js and TypeScript. Last updated October 2026.</span><span>Replies to every email.</span></p>
      </div>
    </footer>`,
    css: `.pre,.cursor,.grain{display:none}
    body{padding-top:3rem}
    .c-mast{position:fixed;top:0;left:0;right:0;z-index:30;height:3rem;background:#161616;border-bottom:1px solid #262626;display:flex;align-items:center;gap:24px;padding:0 clamp(16px,3vw,36px)}
    .c-brand{color:#f4f4f4;font-weight:600;font-size:14px}
    .c-nav{margin-left:auto;display:flex;gap:22px}
    .c-nav a{color:#c6c6c6;font-size:12px;font-weight:500}
    .c-nav a:hover{color:#f4f4f4}
    .c-cta{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#f4f4f4;border:1px solid #525252;padding:6px 14px}
    .c-cta:hover{background:#f4f4f4;color:#161616;border-color:#f4f4f4}
    .c-shell{max-width:1240px;margin:0 auto;padding:0 clamp(16px,3vw,36px)}
    .c-lead{min-height:calc(100svh - 3rem);display:grid;grid-template-columns:minmax(0,10fr) minmax(0,11fr);gap:clamp(24px,5vw,64px);align-items:center;padding:clamp(32px,6vh,64px) 0}
    .eyebrow{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#525252}
    .c-h1{font-weight:300;font-size:clamp(52px,7vw,96px);line-height:1.04;letter-spacing:-.03em;text-transform:none;color:#161616;margin-top:14px}
    .c-h1 .dot{color:#0f62fe}
    .c-tag{margin-top:22px;font-size:15px;line-height:1.65;color:#525252;max-width:36em}
    .cta{margin-top:28px;flex-wrap:wrap}
    .btn{background:#0f62fe;color:#fff;border-radius:0;font-size:14px;font-weight:500;padding:14px 20px;display:inline-flex;align-items:center;justify-content:space-between;gap:28px;min-width:200px;transition:background .2s}
    .btn:hover{background:#0353e9;color:#fff}
    .btn .ar{transition:transform .2s}
    .btn:hover .ar{transform:translateX(3px)}
    .c-btn2{background:#fff;color:#161616;border:1px solid rgba(15,98,254,.4)}
    .c-btn2:hover{background:#edf5ff;border-color:#0f62fe}
    .c-art{background:#e9e9e9;border:1px solid #e0e0e0;padding:14px;background-image:repeating-linear-gradient(60deg,rgba(22,22,22,.04) 0 1px,transparent 1px 30px),repeating-linear-gradient(120deg,rgba(22,22,22,.04) 0 1px,transparent 1px 30px)}
    .c-art svg{display:block;width:100%;height:auto}
    .c-sec{margin-top:clamp(40px,9vh,88px)}
    .c-h2{font-weight:400;font-size:clamp(30px,4.5vw,54px);letter-spacing:-.02em;line-height:1.12;text-transform:none;margin-top:10px;border-top:1px solid #161616;padding-top:14px}
    .wrow{grid-template-columns:4rem minmax(0,1fr) minmax(0,18rem);border-top:1px solid var(--rule);padding:26px 0;gap:6px 28px;align-items:start}
    .c-sec .wrow:first-of-type{margin-top:18px}
    .wrow .t{font-weight:400;font-size:clamp(22px,2.6vw,32px);letter-spacing:-.015em}
    .wrow .h{margin-top:6px}
    .fact{font-family:'IBM Plex Mono',monospace;font-size:12px;line-height:1.55;color:#161616;border-left:3px solid #0f62fe;padding-left:12px;align-self:center}
    .qs{display:grid;grid-template-columns:1fr 1fr;gap:28px 48px;margin-top:18px}
    .q{border-top:1px solid var(--rule);padding-top:16px;position:relative}
    .q::before{content:'';position:absolute;top:-1px;left:0;width:48px;height:3px;background:#0f62fe}
    .q blockquote{font-weight:400;font-size:17px;line-height:1.5}
    .slist{margin-top:18px}
    .srow{display:grid;grid-template-columns:11rem 1fr;gap:6px 28px;border-top:1px solid var(--rule);padding:18px 12px;margin:0 -12px;transition:background .2s}
    .srow:hover{background:#f4f4f4}
    .srow .span{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#525252;padding-top:3px}
    .st{font-weight:400;font-size:16px}
    .sb{color:#525252;font-size:13px;margin-top:4px}
    .c-contact{background:#161616;color:#f4f4f4;margin-top:clamp(48px,10vh,96px);padding:clamp(36px,7vh,72px) 0 24px}
    .c-mail{font-weight:300;font-size:clamp(30px,5.5vw,64px);letter-spacing:-.02em;color:#f4f4f4;text-decoration:underline;text-decoration-thickness:2px;text-decoration-color:#393939;text-underline-offset:.14em}
    .c-mail:hover{color:#78a9ff;text-decoration-color:#78a9ff}
    .c-rows{margin-top:32px;display:grid}
    .c-row{display:grid;grid-template-columns:9rem 1fr;gap:6px 24px;padding:14px 0;border-top:1px solid #393939;font-size:14px}
    .c-row .k{color:#c6c6c6;padding-top:2px}
    .c-colo{margin-top:48px;padding-top:16px;border-top:1px solid #393939;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:12px;color:#c6c6c6}
    @media(max-width:860px){.c-lead{grid-template-columns:1fr;min-height:auto;padding-top:24px}.c-nav{display:none}.wrow{grid-template-columns:3rem 1fr}.fact{grid-column:2;max-width:26rem}.qs{grid-template-columns:1fr}.srow{grid-template-columns:1fr;gap:4px;margin:0;padding-inline:0}.srow:hover{background:none}}`,
  },
];
