// Generator 42 mockup + hub. Jalankan: node generate.mjs (dari folder _gen).
// Output: satu file HTML mandiri per style di folder induk mockups/, plus index.html.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FLAGSHIPS, STYLES } from './styles.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'mockups');

const FONTS =
  'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Instrument+Serif:ital@0;1&family=Press+Start+2P&family=Orbitron:wght@500;700;900&family=Nunito:wght@700;800;900&family=Allerta+Stencil&family=Space+Grotesk:wght@400;500;700&family=Roboto:wght@400;500;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap';

const BASE_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font-family:var(--bodyf),system-ui,sans-serif;font-size:15px;line-height:1.7;min-height:100svh}
a{color:var(--accent);text-decoration:none}
::selection{background:var(--accent);color:var(--bg)}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.bar{position:fixed;top:0;left:0;right:0;z-index:20;display:flex;justify-content:space-between;padding:12px clamp(16px,3vw,36px);font-size:12px;background:color-mix(in srgb,var(--bg) 82%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--rule)}
.bar .lk{display:flex;gap:14px}.bar a{color:var(--sub)}.bar a:hover{color:var(--ink)}
.shell{max-width:1060px;margin:0 auto;padding:0 clamp(16px,3vw,36px)}
.hero{min-height:92svh;display:flex;flex-direction:column;justify-content:center}
.meta{display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--sub);border-bottom:1px solid var(--rule);padding-bottom:10px}
.display{font-family:var(--disp);font-weight:800;font-size:clamp(46px,11vw,130px);line-height:.92;letter-spacing:-.02em;text-transform:uppercase;margin-top:clamp(24px,6vh,54px)}
.tag{margin-top:18px;color:var(--sub);max-width:28em}
.cta{margin-top:22px;display:flex;gap:14px;align-items:center}
.btn{background:var(--accent);color:var(--bg);padding:10px 18px;border-radius:999px;font-size:13px;font-weight:600}
.lnk{color:var(--accent);font-size:13px;border-bottom:1px solid var(--accent)}
.works{margin-top:clamp(30px,8vh,70px)}
.wrow{display:grid;grid-template-columns:4rem 1fr;border-top:1px solid var(--rule);padding:20px 0;gap:4px 14px}
.wrow .no{font-family:'JetBrains Mono',monospace;color:var(--sub);font-size:12px;padding-top:4px}
.k{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub)}
.t{font-family:var(--disp);font-weight:750;font-size:clamp(20px,3.4vw,34px);letter-spacing:-.015em}
.h{color:var(--sub);font-size:13px;max-width:42em;margin-top:4px}
.h b{color:var(--accent);font-weight:600}
.praise{border-top:1px solid var(--rule);padding:26px 0}
blockquote{font-size:clamp(17px,2.4vw,24px);font-weight:500;line-height:1.45;max-width:30em}
.who{margin-top:10px;color:var(--sub);font-size:12px}
.contact{border-top:1px solid var(--rule);padding:clamp(30px,7vh,64px) 0 34px}
.mail{font-family:var(--disp);font-weight:750;font-size:clamp(24px,5vw,54px);color:var(--ink);letter-spacing:-.02em}
.mail:hover{color:var(--accent)}
.sub{margin-top:10px;color:var(--sub);font-size:13px}
.pre{position:fixed;inset:0;background:var(--bg);z-index:50;visibility:hidden;opacity:0}
.pre{position:fixed;inset:0;background:var(--bg);z-index:50;visibility:hidden;opacity:0}
.pre__name{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--sub)}
.pre__num{position:absolute;left:clamp(16px,3vw,36px);bottom:1.4rem;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.08em;color:var(--sub);font-variant-numeric:tabular-nums}
.pre__bar{position:absolute;left:0;bottom:0;width:100%;height:2px;background:var(--accent);transform:scaleX(0);transform-origin:left center}
.cursor{position:fixed;top:0;left:0;width:28px;height:28px;border:1px solid color-mix(in srgb,var(--accent) 60%,transparent);border-radius:50%;pointer-events:none;z-index:40;opacity:0;visibility:hidden;transform:translate(-50%,-50%)}
.grain{position:fixed;inset:0;pointer-events:none;opacity:.035;z-index:30;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")}
/* magazine/timeline/typeonly/poster/sidebar/asym/rail/bento/window/cardgrid primitives */
.maghead{padding:clamp(24px,6vh,54px) 0 14px;border-bottom:1px solid var(--rule)}
.maggrid{display:grid;grid-template-columns:1fr 1fr;gap:24px 40px;padding-top:24px}
.magcol{display:grid;gap:16px;align-content:start}
.magfact{font-size:13px;line-height:1.6;color:var(--sub);border-top:1px solid var(--rule);padding-top:12px}
.magfact b{color:var(--ink);font-weight:600}
.magquote{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(19px,2.6vw,26px);line-height:1.45}
.magmail{font-size:13px;font-weight:600;color:var(--accent)}
.timeline{list-style:none;padding:24px 0 0;display:grid;gap:22px}
.tlitem{display:grid;grid-template-columns:1.4rem 1fr;gap:12px;align-items:baseline}
.tldot{width:9px;height:9px;border-radius:50%;background:var(--accent);margin-top:.45em}
.tlk{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub)}
.tlt{font-family:var(--disp);font-weight:750;font-size:clamp(18px,3vw,26px);letter-spacing:-.015em;margin-top:4px}
.tlh{color:var(--sub);font-size:13px;margin-top:4px}
.posternum{font-family:var(--disp);font-weight:900;font-size:clamp(120px,26vw,260px);line-height:.85;letter-spacing:-.04em;color:color-mix(in srgb,var(--ink) 12%,transparent)}
.posterfact{font-size:14px;line-height:1.6;color:var(--sub);max-width:34em;margin-top:12px}
.posterfact b{color:var(--accent);font-weight:600}
@media(max-width:720px){.maggrid{grid-template-columns:1fr}.shell[style*="grid-template-columns:220px"]{grid-template-columns:1fr}.posternum{font-size:clamp(80px,22vw,160px)}}
/* window / retro os */
.win{border:2px solid;border-color:color-mix(in srgb,var(--ink) 70%,transparent) color-mix(in srgb,var(--ink) 25%,transparent) color-mix(in srgb,var(--ink) 25%,transparent) color-mix(in srgb,var(--ink) 70%,transparent);background:color-mix(in srgb,var(--bg) 88%,#fff);box-shadow:3px 3px 0 rgba(0,0,0,.45);display:flex;flex-direction:column}
.titlebar{background:linear-gradient(90deg,#000080,#1084d0);color:#fff;font-size:13px;font-weight:700;padding:4px 6px;display:flex;justify-content:space-between;align-items:center}
.tbtns{display:flex;gap:3px}.tbtn{background:#c0c0c0;border:2px solid;border-color:#dfdfdf #404040 #404040 #dfdfdf;width:18px;height:16px;display:grid;place-items:center;font-size:9px;color:#000}
.menubar{font-size:12px;padding:3px 8px;border-bottom:1px solid #808080;display:flex;gap:14px}
.body{padding:clamp(14px,3vw,30px);display:flex;flex-direction:column;flex:1}
.group{border:2px groove color-mix(in srgb,var(--ink) 40%,transparent);padding:12px 14px;display:grid;gap:8px;font-size:12px;margin-top:18px}
.btnrow{margin-top:18px;display:flex;gap:8px;justify-content:flex-end}
.btnrow .btn{border:2px solid;border-color:#dfdfdf #404040 #404040 #dfdfdf;background:#c0c0c0;color:#000;box-shadow:1px 1px 0 #000;border-radius:0}
.taskbar{margin-top:12px;border:2px solid;border-color:#dfdfdf #404040 #404040 #dfdfdf;background:#c0c0c0;padding:4px;display:flex;gap:8px;font-size:12px}
.taskbtn{border:2px solid;border-color:#404040 #dfdfdf #dfdfdf #404040;background:#c0c0c0;padding:3px 12px;font-weight:700}
/* bento/cardgrid */
.bgrid,.cgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:clamp(24px,6vh,60px) 0}
.cell{background:color-mix(in srgb,var(--ink) 6%,var(--bg));border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:8px;min-height:120px;transition:transform .25s ease}
.cell:hover{transform:scale(1.02)}
.cell.wide{grid-column:span 2}
.big{font-size:clamp(24px,3.4vw,34px);font-weight:700;letter-spacing:-.02em;color:var(--accent)}
.quote{font-size:14px;line-height:1.45}
/* rail */
.rail{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:10px 0 18px}
.rail .card{flex:none;width:min(340px,78vw);scroll-snap-align:start;border:1px solid var(--rule);border-radius:10px;padding:18px;display:flex;flex-direction:column;gap:10px;min-height:280px;background:color-mix(in srgb,var(--ink) 6%,var(--bg))}
.rail .card.hi{background:var(--accent);color:var(--bg);border-color:var(--accent)}
.rail .card.hi .no,.rail .card.hi .h{color:color-mix(in srgb,var(--bg) 65%,transparent)}
.rail .t{font-size:22px;font-weight:700;letter-spacing:-.02em;margin-top:auto}.rail .h{font-size:12px}
.hint{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--sub);margin-top:4px}
/* asym */
.field{position:relative;min-height:82svh}
.piece{position:absolute;line-height:.95}
.p1{font-weight:900;font-size:clamp(56px,12vw,150px);text-transform:uppercase;letter-spacing:-.03em;top:4%;left:4%;transform:rotate(-4deg)}
.p2{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(28px,6vw,72px);top:36%;right:6%;transform:rotate(3deg);color:var(--accent)}
.p3{font-family:'JetBrains Mono',monospace;font-size:clamp(11px,1.6vw,15px);top:58%;left:14%;max-width:30em;transform:rotate(-1deg);border-top:2px solid var(--ink);padding-top:10px}
.p4{font-weight:900;font-size:clamp(38px,8.5vw,104px);text-transform:uppercase;bottom:6%;right:8%;transform:rotate(2deg);color:transparent;-webkit-text-stroke:2px var(--ink)}
.p5{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;bottom:14%;left:4%;transform:rotate(-6deg);color:var(--accent)}
.p6{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(14px,2vw,20px);bottom:2%;left:30%;transform:rotate(1deg);color:color-mix(in srgb,var(--ink) 60%,transparent)}
/* sidebar */
.side{display:grid;gap:7px;align-content:start}
.tab{background:color-mix(in srgb,var(--ink) 6%,var(--bg));border-radius:10px;padding:8px 12px;font-size:12px;font-weight:800;box-shadow:0 2px 6px rgba(0,0,0,.05)}
.tab.on{background:var(--ink);color:var(--bg)}
/* contour */
.contours{position:fixed;inset:0;width:100%;height:100%;z-index:-1}
.contours path{fill:none;stroke:color-mix(in srgb,var(--rule) 70%,transparent);stroke-width:1;opacity:.5}
.contours path.mj{stroke:var(--rule);opacity:.75}
/* ascii */
canvas{display:block;width:100%;height:260px;border:1px solid var(--rule);margin-top:10px}
@media(max-width:720px){.bgrid,.cgrid{grid-template-columns:1fr}.cell.wide{grid-column:span 1}.field{min-height:60svh}.p1{font-size:clamp(40px,9vw,80px)}.p4{font-size:clamp(28px,7vw,60px)}.shell[style*="grid-template-columns:220px"]{grid-template-columns:1fr}.maggrid{grid-template-columns:1fr}}
/* â”€â”€ Layout primitives (dipakai oleh LAYOUTS) â”€â”€ */
.hero{min-height:92svh;display:flex;flex-direction:column;justify-content:center}
.meta{display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--sub);border-bottom:1px solid var(--rule);padding-bottom:10px}
.display{font-family:var(--disp);font-weight:800;font-size:clamp(46px,11vw,130px);line-height:.92;letter-spacing:-.02em;text-transform:uppercase;margin-top:clamp(24px,6vh,54px)}
.tag{margin-top:18px;color:var(--sub);max-width:28em}
.cta{margin-top:22px;display:flex;gap:14px;align-items:center}
.btn{background:var(--accent);color:var(--bg);padding:10px 18px;border-radius:999px;font-size:13px;font-weight:600}
.lnk{color:var(--accent);font-size:13px;border-bottom:1px solid var(--accent)}
.works{margin-top:clamp(30px,8vh,70px)}
.wrow{display:grid;grid-template-columns:4rem 1fr;border-top:1px solid var(--rule);padding:20px 0;gap:4px 14px}
.wrow .no{font-family:'JetBrains Mono',monospace;color:var(--sub);font-size:12px;padding-top:4px}
.k{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub)}
.t{font-family:var(--disp);font-weight:750;font-size:clamp(20px,3.4vw,34px);letter-spacing:-.015em}
.h{color:var(--sub);font-size:13px;max-width:42em;margin-top:4px}
.h b{color:var(--accent);font-weight:600}
.praise{border-top:1px solid var(--rule);padding:26px 0}
blockquote{font-size:clamp(17px,2.4vw,24px);font-weight:500;line-height:1.45;max-width:30em}
.who{margin-top:10px;color:var(--sub);font-size:12px}
.contact{border-top:1px solid var(--rule);padding:clamp(30px,7vh,64px) 0 34px}
.mail{font-family:var(--disp);font-weight:750;font-size:clamp(24px,5vw,54px);color:var(--ink);letter-spacing:-.02em}
.mail:hover{color:var(--accent)}
.sub{margin-top:10px;color:var(--sub);font-size:13px}
/* bento */
.bgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:clamp(24px,6vh,60px) 0}
.cell{background:color-mix(in srgb,var(--ink) 6%,var(--bg));border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:8px;min-height:120px;transition:transform .25s ease}
.cell:hover{transform:scale(1.02)}
.cell.wide{grid-column:span 2}
.big{font-size:clamp(24px,3.4vw,34px);font-weight:700;letter-spacing:-.02em;color:var(--accent)}
.quote{font-size:14px;line-height:1.45}
/* window / retro os */
.win{border:2px solid;border-color:color-mix(in srgb,var(--ink) 70%,transparent) color-mix(in srgb,var(--ink) 25%,transparent) color-mix(in srgb,var(--ink) 25%,transparent) color-mix(in srgb,var(--ink) 70%,transparent);background:color-mix(in srgb,var(--bg) 88%,#fff);box-shadow:3px 3px 0 rgba(0,0,0,.45);display:flex;flex-direction:column}
.titlebar{background:linear-gradient(90deg,#000080,#1084d0);color:#fff;font-size:13px;font-weight:700;padding:4px 6px;display:flex;justify-content:space-between;align-items:center}
.tbtns{display:flex;gap:3px}.tbtn{background:#c0c0c0;border:2px solid;border-color:#dfdfdf #404040 #404040 #dfdfdf;width:18px;height:16px;display:grid;place-items:center;font-size:9px;color:#000}
.menubar{font-size:12px;padding:3px 8px;border-bottom:1px solid #808080;display:flex;gap:14px}
.body{padding:clamp(14px,3vw,30px);display:flex;flex-direction:column;flex:1}
.group{border:2px groove color-mix(in srgb,var(--ink) 40%,transparent);padding:12px 14px;display:grid;gap:8px;font-size:12px;margin-top:18px}
.btnrow{margin-top:18px;display:flex;gap:8px;justify-content:flex-end}
.btnrow .btn{border:2px solid;border-color:#dfdfdf #404040 #404040 #dfdfdf;background:#c0c0c0;color:#000;box-shadow:1px 1px 0 #000;border-radius:0}
.taskbar{margin-top:12px;border:2px solid;border-color:#dfdfdf #404040 #404040 #dfdfdf;background:#c0c0c0;padding:4px;display:flex;gap:8px;font-size:12px}
.taskbtn{border:2px solid;border-color:#404040 #dfdfdf #dfdfdf #404040;background:#c0c0c0;padding:3px 12px;font-weight:700}
/* rail */
.rail{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:10px 0 18px}
.rail .card{flex:none;width:min(340px,78vw);scroll-snap-align:start;border:1px solid var(--rule);border-radius:10px;padding:18px;display:flex;flex-direction:column;gap:10px;min-height:280px;background:color-mix(in srgb,var(--ink) 6%,var(--bg))}
.rail .card.hi{background:var(--accent);color:var(--bg);border-color:var(--accent)}
.rail .card.hi .no,.rail .card.hi .h{color:color-mix(in srgb,var(--bg) 65%,transparent)}
.rail .t{font-size:22px;font-weight:700;letter-spacing:-.02em;margin-top:auto}.rail .h{font-size:12px}
.hint{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--sub);margin-top:4px}
/* asym */
.field{position:relative;min-height:82svh}
.piece{position:absolute;line-height:.95}
.p1{font-weight:900;font-size:clamp(56px,12vw,150px);text-transform:uppercase;letter-spacing:-.03em;top:4%;left:4%;transform:rotate(-4deg)}
.p2{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(28px,6vw,72px);top:36%;right:6%;transform:rotate(3deg);color:var(--accent)}
.p3{font-family:'JetBrains Mono',monospace;font-size:clamp(11px,1.6vw,15px);top:58%;left:14%;max-width:30em;transform:rotate(-1deg);border-top:2px solid var(--ink);padding-top:10px}
.p4{font-weight:900;font-size:clamp(38px,8.5vw,104px);text-transform:uppercase;bottom:6%;right:8%;transform:rotate(2deg);color:transparent;-webkit-text-stroke:2px var(--ink)}
.p5{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;bottom:14%;left:4%;transform:rotate(-6deg);color:var(--accent)}
.p6{font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(14px,2vw,20px);bottom:2%;left:30%;transform:rotate(1deg);color:color-mix(in srgb,var(--ink) 60%,transparent)}
/* sidebar */
.side{display:grid;gap:7px;align-content:start}
.tab{background:color-mix(in srgb,var(--ink) 6%,var(--bg));border-radius:10px;padding:8px 12px;font-size:12px;font-weight:800;box-shadow:0 2px 6px rgba(0,0,0,.05)}
.tab.on{background:var(--ink);color:var(--bg)}
/* contour */
.contours{position:fixed;inset:0;width:100%;height:100%;z-index:-1}
.contours path{fill:none;stroke:color-mix(in srgb,var(--rule) 70%,transparent);stroke-width:1;opacity:.5}
.contours path.mj{stroke:var(--rule);opacity:.75}
/* ascii */
canvas{display:block;width:100%;height:260px;border:1px solid var(--rule);margin-top:10px}
/* cardgrid */
.cgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:clamp(24px,6vh,60px) 0}
.cgrid .cell{background:color-mix(in srgb,var(--ink) 6%,var(--bg));border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:8px;min-height:120px;transition:transform .25s ease}
.cgrid .cell:hover{transform:scale(1.02)}
.cgrid .cell.wide{grid-column:span 2}
.cgrid .big{font-size:clamp(24px,3.4vw,34px);font-weight:700;letter-spacing:-.02em;color:var(--accent)}
.cgrid .quote{font-size:14px;line-height:1.45}
@media(max-width:720px){.bgrid,.cgrid{grid-template-columns:1fr}.cell.wide{grid-column:span 1}.field{min-height:60svh}.p1{font-size:clamp(40px,9vw,80px)}.p4{font-size:clamp(28px,7vw,60px)}.shell[style*="grid-template-columns:220px"]{grid-template-columns:1fr}}
.dim{display:flex;align-items:center;gap:10px;font-size:9px;color:var(--sub);margin-top:12px;letter-spacing:.14em;text-transform:uppercase}
.dim::before,.dim::after{content:'';flex:1;height:1px;background:var(--rule)}
@media(max-width:720px){.wrow{grid-template-columns:2.4rem 1fr}}
`;

const BASE_JS = `
(function(){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  document.documentElement.style.scrollBehavior = 'auto';
  var lenis = new Lenis({ lerp: 0.11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
  gsap.ticker.lagSmoothing(0);

  /* Preloader: counter 000..100, tirai terangkat. */
  var pre = document.querySelector('.pre');
  var pnum = pre && pre.querySelector('.pre__num');
  if (pre) {
    gsap.set(pre, { autoAlpha: 1 });
    var counter = { v: 0 };
    gsap.timeline()
      .to(counter, { v: 100, duration: 0.7, ease: 'power2.inOut', onUpdate: function () { if (pnum) pnum.textContent = String(Math.round(counter.v)).padStart(3, '0'); } })
      .to('.pre__bar', { scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, 0)
      .to(pre, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, '+=0.04');
  }

  /* Cursor ring (pointer presisi). */
  if (matchMedia('(pointer: fine)').matches) {
    var ring = document.querySelector('.cursor');
    if (ring) {
      gsap.set(ring, { autoAlpha: 1, xPercent: -50, yPercent: -50 });
      var rX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' });
      var rY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' });
      window.addEventListener('pointermove', function (e) { rX(e.clientX); rY(e.clientY); });
      document.addEventListener('pointerover', function (e) {
        var t = e.target instanceof Element ? e.target : null;
        var hot = t && t.closest('a, button, [data-cursor]');
        gsap.to(ring, { scale: hot ? 2 : 1, duration: 0.3, ease: 'power3.out' });
      });
    }
  }

  /* Progres baca di atas. */
  gsap.to('.pbar', { width: '100%', ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true } });

  /* Anchor halus + tombol close ke situs induk. */
  document.addEventListener('click', function (e) {
    var t = e.target instanceof Element ? e.target : null;
    if (t && t.closest('[data-close]')) {
      e.preventDefault();
      window.parent && window.parent.postMessage('v8close', '*');
      return;
    }
    var a = t && t.closest('a[href^="#"]');
    if (!a) return;
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: -60, duration: 1.2 });
  });

  /* Reveal: fade-up sekali. */
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.from(el, { y: 26, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  /* Heading display: dibelah per baris ber-mask. */
  document.fonts.ready.then(function () {
    gsap.utils.toArray('[data-split]').forEach(function (el) {
      try {
        var sp = SplitText.create(el, { type: 'lines', mask: 'lines' });
        gsap.from(sp.lines, { yPercent: 115, duration: 1.05, ease: 'power4.out', stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%' } });
      } catch (e) { /* biarkan tampil polos */ }
    });
    ScrollTrigger.refresh();
  });

  /* Count-up untuk [data-count]. */
  gsap.utils.toArray('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (!target) return;
    var o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true,
      onEnter: function () { gsap.to(o, { v: target, duration: 1.4, ease: 'power2.out',
        onUpdate: function () { el.textContent = String(Math.round(o.v)); } }); } });
  });

  /* Tilt lembut untuk [data-tilt]. */
  if (matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt] .card, [data-tilt] .wrow').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 600, duration: 0.4 });
      });
      card.addEventListener('pointerleave', function () { gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5 }); });
    });
  }
})();
`;

const PRESETS = {
  typed: `
  /* Preset typed: .typed diketik saat masuk viewport. */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      var el = en.target, text = en.target.getAttribute('data-text') || '', i = 0;
      (function tick(){ el.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(tick, 12); })();
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.typed').forEach(function (el) { io.observe(el); });`,

  flicker: '',
  jolt: `
  /* Preset jolt: reveal ber-step keras (tanpa kurva halus). */
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.from(el, { y: 18, autoAlpha: 0, duration: 0.35, ease: 'steps(4)', scrollTrigger: { trigger: el, start: 'top 92%' } });
  });
  gsap.utils.toArray('[data-split]').forEach(function (el) {
    try {
      var sp = SplitText.create(el, { type: 'lines', mask: 'lines' });
      gsap.from(sp.lines, { yPercent: 100, duration: 0.4, ease: 'steps(6)', stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 90%' } });
    } catch (e) {}
  });`,
  parallax: `
  /* Preset parallax: elemen bergeser melawan gulir. */
  gsap.utils.toArray('.huge, .work .row, .wrow').forEach(function (el, i) {
    gsap.fromTo(el, { xPercent: i % 2 ? 6 : -6 }, { xPercent: i % 2 ? -6 : 6, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });`,
  tilt: '',
  count: '',
  draw: `
  /* Preset draw: garis svg digambar (stroke-dash) saat masuk viewport. */
  gsap.utils.toArray('.draw').forEach(function (p) {
    var len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(p, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut',
      scrollTrigger: { trigger: p, start: 'top 85%' } });
  });`,
  ascii: `
  /* Preset ascii: medan karakter berdenyut. */
  (function () {
    var cv = document.getElementById('ascii');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var RAMP = ' .:-=+*#%@';
    var t = 0;
    function size(){ cv.width = Math.floor(cv.clientWidth / 9); cv.height = 26; }
    size();
    function frame() {
      var out = '';
      for (var y = 0; y < cv.height; y++) {
        for (var x = 0; x < cv.width; x++) {
          var v = Math.sin(x * 0.14 + t) + Math.sin(y * 0.19 - t * 0.8) + Math.sin((x + y) * 0.09 + t * 0.5);
          var idx = Math.max(0, Math.min(RAMP.length - 1, Math.floor((v + 3) / 6 * RAMP.length)));
          out += RAMP[idx];
        }
        out += '\\n';
      }
      ctx.fillStyle = '#050805';
      ctx.fillRect(0, 0, cv.width * 9, cv.height * 14);
      ctx.fillStyle = '#7be07b';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText(out, 0, 12);
      t += 0.045;
      requestAnimationFrame(frame);
    }
    frame();
  })();`,
};

const WORKROWS = `<div class="wrow" data-reveal><span class="no">01</span><div><p class="k">AI build Â· Revenue ops</p><p class="t">CRM pipeline</p><p class="h">~11h runtime vs 300+h manual (96% less) â€” 9 Python + LLM agents, human-in-the-loop.</p></div></div>
  <div class="wrow" data-reveal><span class="no">02</span><div><p class="k">Enablement Â· Curriculum</p><p class="t">Chatbot curriculum engine</p><p class="h">5 programs Â· 25+ live sessions Â· 150+ participants, owned end to end.</p></div></div>
  <div class="wrow" data-reveal><span class="no">03</span><div><p class="k">Web build</p><p class="t">Web builds that prove shipping</p><p class="h">3 sites live â€” Next.js + TypeScript + Vercel, plus 4 alumni videos and 24 published posts.</p></div></div>`;

const LAYOUTS = {
  editorial: (s) => `<main class="shell">
    <header class="hero">
      <div class="meta"><span>NUR FAJAR</span><span>FOLIO â€” OCT 2026</span></div>
      <h1 class="display" data-split>Nur Fajar</h1>
      <p class="tag" data-reveal>AI specialist who builds apps and communities.</p>
      ${s.heroExtra || ''}
      <div class="cta" data-reveal><a class="btn" href="#">See selected work</a><a class="lnk" href="#">hi@nurfajar.com</a></div>
    </header>
    ${s.heroAfter || ''}
    <section class="works">${WORKROWS}</section>
    <section class="praise" data-reveal><blockquote>"He takes ownership, learns fast, and delivers."</blockquote><p class="who">Arnold Doray â€” Former manager, Terra AI Â· Now CTO, Wingfin</p></section>
    <footer class="contact" data-reveal><a class="mail" href="mailto:hi@nurfajar.com">hi@nurfajar.com</a><p class="sub">Available immediately Â· remote or hybrid, onsite Indonesia, open to relocate Â· replies within 24 hours.</p></footer>
  </main>`,
  centered: (s) => `<main class="shell" style="text-align:center">
    <header class="hero" style="align-items:center">
      <div class="meta" style="justify-content:center;gap:2em"><span>NUR FAJAR</span><span>FOLIO â€” OCT 2026</span></div>
      <h1 class="display" data-split>Nur Fajar</h1>
      <p class="tag" data-reveal style="margin-left:auto;margin-right:auto">AI specialist who builds apps and communities.</p>
      ${s.heroExtra || ''}
      <div class="cta" data-reveal style="justify-content:center"><a class="btn" href="#">See selected work</a><a class="lnk" href="#">hi@nurfajar.com</a></div>
    </header>
    ${s.heroAfter || ''}
    <section class="works" style="text-align:left">${WORKROWS}</section>
    <section class="praise" data-reveal style="text-align:left"><blockquote>"He takes ownership, learns fast, and delivers."</blockquote><p class="who">Arnold Doray â€” Former manager, Terra AI Â· Now CTO, Wingfin</p></section>
    <footer class="contact" data-reveal style="text-align:left"><a class="mail" href="mailto:hi@nurfajar.com">hi@nurfajar.com</a><p class="sub">Available immediately Â· replies within 24 hours.</p></footer>
  </main>`,
  manifesto: (s) => `<main class="shell">
    <header class="hero" style="min-height:70svh;justify-content:center">
      <div class="meta"><span>NUR FAJAR</span><span>2026</span></div>
      <h1 class="display" data-split style="font-size:clamp(30px,6vw,66px);line-height:1.1;max-width:16em">AI specialist who builds apps and communities.</h1>
      <p class="tag" data-reveal style="max-width:32em">Hi there! I'm Fajar, and I enjoy turning ideas into things that help people learn, work, and solve problems better.</p>
    </header>
    <section class="works">
      <div class="wrow" data-reveal><span class="no">01</span><div><p class="k">AI build Â· Revenue ops</p><p class="t">CRM pipeline</p><p class="h">~11h runtime vs 300+h manual (96% less).</p></div></div>
      <div class="wrow" data-reveal><span class="no">02</span><div><p class="k">Enablement Â· Curriculum</p><p class="t">Chatbot curriculum engine</p><p class="h">5 programs Â· 150+ participants.</p></div></div>
    </section>
    <footer class="contact" data-reveal><a class="mail" href="mailto:hi@nurfajar.com">hi@nurfajar.com</a><p class="sub">Available immediately Â· replies within 24 hours.</p></footer>
  </main>`,
  minimal: (s) => `<main class="shell" style="min-height:100svh;display:flex;flex-direction:column;justify-content:center">
    <div class="meta"><span>NUR FAJAR</span><span>FOLIO 2026</span></div>
    <h1 class="display" data-split style="font-size:clamp(30px,6vw,64px);max-width:12em">Nur Fajar</h1>
    <p class="tag" data-reveal style="font-size:13px;max-width:22em">AI specialist who builds apps and communities.</p>
    <p class="tag" data-reveal style="font-size:11px;color:var(--sub);margin-top:6px">Available immediately.</p>
    <a class="mail" href="mailto:hi@nurfajar.com" style="margin-top:clamp(30px,6vh,60px)">hi@nurfajar.com</a>
  </main>`,
  bento: (s) => `<main class="shell"><div class="bgrid">
    <div class="cell wide" data-reveal><p class="k">Hello</p><h1 class="display" style="font-size:clamp(30px,5.5vw,56px)">Nur Fajar</h1><p class="tag">AI specialist who builds apps and communities.</p></div>
    <div class="cell" data-reveal><p class="k">Now</p><p class="big">Open to work</p><p class="sub">Full-time Â· immediately</p></div>
    <div class="cell" data-reveal><p class="k">Impact</p><p class="big">96% less</p><p class="sub">manual outreach time</p></div>
    <div class="cell" data-reveal><p class="k">Work 01</p><p class="t">CRM pipeline</p><p class="sub">AI build Â· Revenue ops</p></div>
    <div class="cell" data-reveal><p class="k">Praise</p><p class="quote">"He takes ownership, learns fast, and delivers."</p><p class="sub">Arnold Doray â€” Former manager, Terra AI</p></div>
    <div class="cell" data-reveal><p class="k">Say hi</p><p class="t"><a href="mailto:hi@nurfajar.com">hi@nurfajar.com</a></p><p class="sub">Replies within 24 hours</p></div>
  </div></main>`,
  window: (s) => `<main class="shell"><div class="win">
    <div class="titlebar"><span>NUR_FAJAR.EXE â€” Portfolio 2026</span><span class="tbtns"><span class="tbtn">_</span><span class="tbtn">â–¡</span><span class="tbtn">Ã—</span></span></div>
    <div class="menubar"><span>File</span><span>Edit</span><span>View</span><span>Help</span></div>
    <div class="body">
      <h1 class="display" data-split>Nur Fajar</h1>
      <p class="tag">AI specialist who builds apps and communities.</p>
      <div class="group" data-reveal><p class="k">C:\\work\\crm-pipeline</p><p>AI build Â· Revenue ops â€” 9 Python + LLM agents, human approval before sending.</p><p class="h">Result: ~11h runtime vs 300+h manual (96% less)</p></div>
      <div class="btnrow"><span class="btn">Download CV</span><span class="btn">Email me</span></div>
    </div>
  </div>
  <div class="taskbar"><span class="taskbtn">Start</span><span>Nur_Fajar.exe â€” running</span></div></main>`,
  rail: (s) => `<main class="shell">
    <div class="meta"><span>Selected work</span><span>Scroll sideways â†’</span></div>
    <div class="rail">
      <div class="card hi" data-reveal><span class="no">01</span><span class="t">CRM pipeline</span><span class="h">AI build Â· Revenue ops â€” ~11h runtime vs 300+h manual (96% less)</span></div>
      <div class="card" data-reveal><span class="no">02</span><span class="t">Curriculum engine</span><span class="h">5 programs Â· 150+ participants</span></div>
      <div class="card" data-reveal><span class="no">03</span><span class="t">Web builds</span><span class="h">3 sites live â€” Next.js + TS</span></div>
      <div class="card" data-reveal><span class="no">04</span><span class="t">Social content</span><span class="h">4 alumni videos Â· 24 posts</span></div>
      <div class="card" data-reveal><span class="no">05</span><span class="t">Remember</span><span class="h">Desktop app Â· in development</span></div>
      <div class="card" data-reveal><span class="no">06</span><span class="t">Nyunda</span><span class="h">Android app Â· in development</span></div>
    </div>
    <p class="hint">â† drag / scroll â†’</p>
    <footer class="contact" data-reveal><a class="mail" href="mailto:hi@nurfajar.com">hi@nurfajar.com</a><p class="sub">Available immediately Â· replies within 24 hours.</p></footer>
  </main>`,
  asym: (s) => `<main class="shell"><div class="field">
    <span class="piece p1" data-split>Nur Fajar</span>
    <span class="piece p2" data-reveal>builds apps<br />&amp; communities</span>
    <span class="piece p3" data-reveal>WORK 01 â€” CRM pipeline. AI build, revenue ops. 9 Python + LLM agents, human review before anything sends. ~11h runtime vs 300+h manual (96% less).</span>
    <span class="piece p4" data-split>Folio</span>
    <span class="piece p5">OCT 2026</span>
    <span class="piece p6" data-reveal>"He takes ownership, learns fast, and delivers." â€” Arnold Doray, CTO, Wingfin</span>
  </div>
  <footer class="contact" data-reveal style="margin-top:40px"><a class="mail" href="mailto:hi@nurfajar.com">hi@nurfajar.com</a></footer></main>`,
  sidebar: (s) => `<main class="shell" style="display:grid;grid-template-columns:220px 1fr;gap:24px">
    <aside class="side">
      <span class="tab on">Nur Fajar — AI specialist</span>
      <span class="tab">CRM pipeline · 96% less</span>
      <span class="tab">Curriculum engine · 150+</span>
      <span class="tab">hi@nurfajar.com</span>
    </aside>
    <div>
      <div class="meta"><span>NUR FAJAR</span><span>FOLIO — OCT 2026</span></div>
      <h1 class="display" data-split>Nur Fajar</h1>
      <p class="tag" data-reveal>AI specialist who builds apps and communities.</p>
      <div class="cta" data-reveal><a class="btn" href="#">See selected work</a><a class="lnk" href="#">hi@nurfajar.com</a></div>
    </div>
  </main>`,
  magazine: (s) => `<main class="shell">
    <div class="maghead">
      <div class="meta"><span>NUR FAJAR — FOLIO</span><span>OCT 2026 · VOL. 01</span></div>
      <h1 class="display" data-split>Nur Fajar</h1>
    </div>
    <div class="maggrid">
      <div class="magcol">
        <p class="tag" data-reveal>AI specialist who builds apps and communities. Hi there! I'm Fajar, and I enjoy turning ideas into things that help people learn, work, and solve problems better.</p>
        <p class="magfact" data-reveal><b>Work 01</b> — CRM pipeline. 9 Python + LLM agents, human-in-the-loop. <b>96% less</b> manual outreach.</p>
      </div>
      <div class="magcol">
        <p class="magfact" data-reveal><b>Work 02</b> — Chatbot curriculum engine. 5 programs · 150+ participants.</p>
        <p class="magfact" data-reveal><b>Work 03</b> — Web builds. 3 sites live — Next.js + TS + Vercel.</p>
        <p class="magquote" data-reveal>"He takes ownership, learns fast, and delivers." — Arnold Doray, CTO, Wingfin</p>
        <p class="magmail" data-reveal><a href="mailto:hi@nurfajar.com">hi@nurfajar.com</a> · Available immediately</p>
      </div>
    </div>
  </main>`,
  timeline: (s) => `<main class="shell">
    <header class="hero" style="min-height:60svh">
      <div class="meta"><span>NUR FAJAR</span><span>FOLIO — OCT 2026</span></div>
      <h1 class="display" data-split>Nur Fajar</h1>
      <p class="tag" data-reveal>AI specialist who builds apps and communities.</p>
    </header>
    <ol class="timeline">
      <li class="tlitem" data-reveal><span class="tldot"></span><div><p class="tlk">01 · AI build · Revenue ops</p><p class="tlt">CRM pipeline</p><p class="tlh">9 Python + LLM agents · ~11h runtime vs 300+h manual (96% less)</p></div></li>
      <li class="tlitem" data-reveal><span class="tldot"></span><div><p class="tlk">02 · Enablement · Curriculum</p><p class="tlt">Chatbot curriculum engine</p><p class="tlh">5 programs · 25+ live sessions · 150+ participants</p></div></li>
      <li class="tlitem" data-reveal><span class="tldot"></span><div><p class="tlk">03 · Web build</p><p class="tlt">Web builds that prove shipping</p><p class="tlh">3 sites live — Next.js + TypeScript + Vercel</p></div></li>
      <li class="tlitem" data-reveal><span class="tldot"></span><div><p class="tlk">Praise</p><p class="tlt">"He takes ownership, learns fast, and delivers."</p><p class="tlh">Arnold Doray — Former manager, Terra AI · Now CTO, Wingfin</p></div></li>
    </ol>
    <footer class="contact" data-reveal><a class="mail" href="mailto:hi@nurfajar.com">hi@nurfajar.com</a><p class="sub">Available immediately · replies within 24 hours.</p></footer>
  </main>`,
  typeonly: (s) => `<main class="shell" style="min-height:100svh;display:flex;flex-direction:column;justify-content:center">
    <div class="meta"><span>NUR FAJAR</span><span>FOLIO 2026</span></div>
    <h1 class="display" data-split style="font-size:clamp(26px,5.2vw,56px);max-width:16em;line-height:1.15">AI specialist who builds apps and communities.</h1>
    <p class="tag" data-reveal style="font-size:12px;max-width:26em">Available immediately. Onsite Indonesia, open to relocate. Replies within 24 hours.</p>
    <a class="mail" href="mailto:hi@nurfajar.com" style="margin-top:clamp(40px,8vh,80px)">hi@nurfajar.com</a>
  </main>`,
  poster: (s) => `<main class="shell" style="display:grid;grid-template-columns:auto 1fr;gap:24px 40px;align-items:end;min-height:100svh">
    <div class="posternum">01</div>
    <div>
      <div class="meta"><span>NUR FAJAR</span><span>FOLIO — OCT 2026</span></div>
      <h1 class="display" data-split>Nur Fajar</h1>
      <p class="tag" data-reveal>AI specialist who builds apps and communities.</p>
      <p class="posterfact" data-reveal>CRM pipeline — <b>96% less</b> manual outreach. 9 Python + LLM agents, human approval before sending.</p>
      <a class="mail" href="mailto:hi@nurfajar.com" style="font-size:clamp(18px,3vw,30px);margin-top:24px">hi@nurfajar.com</a>
    </div>
  </main>`,
  sidebar: (s) => `<main class="shell" style="display:grid;grid-template-columns:220px 1fr;gap:24px">
    <aside class="side">
      <span class="tab on">Nur Fajar â€” AI specialist</span>
      <span class="tab">CRM pipeline Â· 96% less</span>
      <span class="tab">Curriculum engine Â· 150+</span>
      <span class="tab">hi@nurfajar.com</span>
    </aside>
    <div>
      <div class="meta"><span>NUR FAJAR</span><span>FOLIO â€” OCT 2026</span></div>
      <h1 class="display" data-split>Nur Fajar</h1>
      <p class="tag" data-reveal>AI specialist who builds apps and communities.</p>
      <div class="cta" data-reveal><a class="btn" href="#">See selected work</a><a class="lnk" href="#">hi@nurfajar.com</a></div>
    </div>
  </main>`,
  cardgrid: (s) => `<main class="shell">
    <header class="hero">
      <div class="meta"><span>NUR FAJAR</span><span>FOLIO â€” OCT 2026</span></div>
      <h1 class="display" data-split>Nur Fajar</h1>
      <p class="tag" data-reveal>AI specialist who builds apps and communities.</p>
    </header>
    <div class="cgrid">
      <div class="cell" data-reveal><p class="k">Now</p><p class="big">Open to work</p><p class="sub">Full-time Â· immediately</p></div>
      <div class="cell" data-reveal><p class="k">Impact</p><p class="big">96% less</p><p class="sub">manual outreach time</p></div>
      <div class="cell" data-reveal><p class="k">Work 01</p><p class="t">CRM pipeline</p><p class="sub">AI build Â· Revenue ops</p></div>
      <div class="cell" data-reveal><p class="k">Work 02</p><p class="t">Curriculum engine</p><p class="sub">5 programs Â· 150+</p></div>
      <div class="cell" data-reveal><p class="k">Praise</p><p class="quote">"He takes ownership, learns fast, and delivers."</p><p class="sub">Arnold Doray</p></div>
      <div class="cell" data-reveal><p class="k">Say hi</p><p class="t"><a href="mailto:hi@nurfajar.com">hi@nurfajar.com</a></p><p class="sub">Replies within 24h</p></div>
    </div>
  </main>`,
};

function shell(s) {
  var body = s.body || LAYOUTS[s.layout || 'editorial'](s);
  var varCss = Object.entries(s.vars)
    .map(([k, v]) => `--${k}:${v};`)
    .join('');
  var motion = s.motion || 'reveal';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${s.title} â€” Nur Fajar (mockup)</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${FONTS}" rel="stylesheet" />
<style>:root{${varCss}}
${BASE_CSS}
${s.css || ''}
</style>
</head>
<body data-motion="${motion}">
<div class="pre"><p class="pre__name">Nur Fajar</p><p class="pre__num">000</p><span class="pre__bar"></span></div>
<div class="pbar"></div>
<div class="cursor"></div>
<div class="grain"></div>
<div class="bar"><span>${s.title} â€” mockup</span><span class="lk"><a href="#" data-close>â† close</a></span></div>
${body}
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/SplitText.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.14/dist/lenis.min.js"></script>
<script>
${BASE_JS}
${PRESETS[motion] || ''}
</script>
</body>
</html>
`;
}

mkdirSync(OUT, { recursive: true });
var made = 0;
for (var s of STYLES) {
  writeFileSync(join(OUT, s.id + '.html'), shell(s));
  made++;
}
console.log('generated ' + made + ' mockup files');

/* â”€â”€ Regenerasi hub dengan daftar lengkap 48 arah â”€â”€ */
var allLinks = FLAGSHIPS.map(
  (f) =>
    `<a class="item" href="${f.file}"><span class="no">${f.no}</span><span class="t">${f.title}</span><span class="go">open â†’</span><span class="d">${f.desc}</span></a>`
).join('\n    ');
var genLinks = STYLES.map(
  (s) =>
    `<a class="item" href="${s.id}.html"><span class="no">${s.id.slice(0, 2)}</span><span class="t">${s.title}</span><span class="go">open â†’</span><span class="d">${s.desc}</span></a>`
).join('\n    ');

var hub = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Mockups â€” v8 full-motion directions</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${FONTS}" rel="stylesheet" />
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#101014;color:#f2f2f2;font-family:Inter,sans-serif}
.wrap{max-width:860px;margin:0 auto;padding:clamp(40px,9vh,100px) 24px 80px}
.k{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#ff4d00}
h1{font-size:clamp(30px,5vw,52px);font-weight:700;letter-spacing:-.03em;margin-top:14px}
p.desc{margin-top:16px;color:#999;line-height:1.7;font-size:14px;max-width:46em}
p.desc b{color:#ddd;font-weight:600}
h2{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#666;margin:44px 0 16px}
.list{display:grid;gap:10px}
.item{display:grid;grid-template-columns:3.4rem 1fr auto;gap:6px 18px;align-items:baseline;border:1px solid #26262c;border-radius:12px;padding:18px 20px;text-decoration:none;color:#f2f2f2;transition:border-color .2s,transform .2s}
.item:hover{border-color:#ff4d00;transform:translateX(4px)}
.item .no{font-family:'JetBrains Mono',monospace;font-size:12px;color:#ff4d00}
.item .t{font-weight:600;font-size:16px}
.item .d{grid-column:2;font-size:12px;color:#888;line-height:1.6}
.item .go{font-family:'JetBrains Mono',monospace;font-size:12px;color:#666}
.others{margin-top:44px;border-top:1px solid #26262c;padding-top:24px;font-size:13px;color:#999;line-height:2}
.others a{color:#ff4d00;text-decoration:none}
@media(max-width:720px){.item{grid-template-columns:2.4rem 1fr}.item .go{display:none}.item .d{grid-column:1}}
</style>
</head>
<body>
<div class="wrap">
  <p class="k">Mockups â€” full motion</p>
  <h1>48 arah, versi maksimal.</h1>
  <p class="desc">Empat puluh dua arah digenerate dari satu mesin motion bersama (Lenis + GSAP + SplitText: preloader, reveal, heading ber-mask, count-up, tilt, garis digambar) â€” ditambah <b>enam flagship</b> yang dibuat manual lebih dalam. Konten tetap kanon v7. Arah <b>Atlas (08)</b> versi penuhnya ada di <b>/v8</b> (Next.js).</p>
  <h2>Flagship â€” dibuat manual</h2>
  <div class="list">
    ${allLinks}
  </div>
  <h2>Generated â€” satu mesin motion bersama</h2>
  <div class="list">
    ${genLinks}
  </div>
  <div class="others">
    Pembanding cepat versi statis: <a href="../style-board.html">style-board.html</a> (48 arah).<br />
    Semua mockup berdiri sendiri dan tidak mengganggu build Next.js maupun deploy.
  </div>
</div>
</body>
</html>
`;
/* Hub ditulis ke folder sumber mockups/ (file:// browsing) â€” TIDAK ke public,
   supaya tidak bertabrakan dengan route /mockups di Next.js. */
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html'), hub);
console.log('hub regenerated');
