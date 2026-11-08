'use client';

import { useEffect, useRef } from 'react';

/**
 * Pita cahaya di belakang hero.
 *
 * Idiom ini diambil dari komponen "Shader Background" di 21st.dev (1 459
 * unduhan, featured), tapi kodenya ditulis sendiri: shader fullscreen butuh
 * satu quad dan satu fragment shader, bukan satu dependensi.
 *
 * Keputusan yang tidak bisa dinegosiasi:
 *   - Tanpa WebGL: canvas dibiarkan kosong, fallback CSS (radial gradient
 *     di .v9-hero__fallback) tetap menjadi latar. Halaman tidak pernah
 *     kehilangan ground.
 *   - prefers-reduced-motion: satu frame statis digambar, lalu rAF berhenti.
 *     Pita tidak berputar untuk orang yang minta gerak minimal.
 *   - Canvas diberi aria-hidden: ia dekorasi, bukan isi.
 */

/* Vertex: satu segitiga fullscreen, tanpa matriks apa pun. */
const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

/*
 * Fragment: ground kertas + pita cahaya.
 *
 * Pita dibuat dari tujuh kurva sinus yang ditumpuk; setiap kurva memberi
 * glow gaussian di sekitar jaraknya ke kurva itu. Warna dicampur antara
 * biru dan violet menurut kurva mana yang paling dekat, jadi pita
 * bergerak dari biru ke violet saat gelombang berjalan.
 */
const FRAG = `
precision mediump float;

uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_paper;
uniform vec3 u_glow_a;
uniform vec3 u_glow_b;

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 p = (frag - 0.5 * u_res) / u_res.y;

  // Ground kertas: sedikit lebih gelap di bawah, seperti cahaya dari atas.
  vec3 col = mix(u_paper * 0.965, u_paper, smoothstep(0.0, 1.0, frag.y / u_res.y));

  float glow = 0.0;
  float mixv = 0.0;

  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    float t = u_time * 0.13;
    float phase = fi * 0.86;

    float y = -0.34 + 0.05 * fi
      + 0.155 * sin(p.x * (1.25 + 0.3 * fi) + t * (0.8 + 0.09 * fi) + phase)
      + 0.05 * sin(p.x * (2.85 + 0.22 * fi) - t * 0.6 + phase * 1.6);

    float d = abs(p.y - y);
    float w = 0.0068 + 0.0015 * fi;
    float g = exp(-(d * d) / (w * w));

    glow += g * (1.0 - 0.065 * fi);
    mixv += g * (fi / 6.0);
  }

  glow = clamp(glow, 0.0, 1.0);
  mixv = clamp(mixv, 0.0, 1.0);

  // Pita menumpuk di bagian bawah-tengah; bagian atas dibiarkan tenang
  // supaya headline (tinta gelap) selalu punya latar yang rata.
  float band = smoothstep(-0.95, -0.62, p.y) * (1.0 - smoothstep(0.02, 0.5, p.y));

  vec3 ribbon = mix(u_glow_a, u_glow_b, mixv);
  col = mix(col, ribbon, glow * 0.46 * band);
  col += vec3(1.0) * pow(glow, 4.0) * 0.14 * band;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function Shader() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    // Tanpa WebGL: fallback CSS yang menjadi latar. Tidak ada yang rusak.
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // Kegagalan diam-diam adalah bug yang lebih buruk: canvasnya jadi
        // kotak hitam dan tidak ada yang tahu kenapa.
        console.error('[v9] shader compile failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, VERT);
    const fragment = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[v9] program link failed:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, 'a_pos');
    if (position < 0) {
      console.error('[v9] atribut a_pos tidak ditemukan di program');
      return;
    }
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_res');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uPaper = gl.getUniformLocation(program, 'u_paper');
    const uGlowA = gl.getUniformLocation(program, 'u_glow_a');
    const uGlowB = gl.getUniformLocation(program, 'u_glow_b');

    gl.uniform3f(uPaper, 1, 1, 1);
    gl.uniform3f(uGlowA, 0.231, 0.51, 0.965);
    gl.uniform3f(uGlowB, 0.114, 0.306, 0.847);

    const resize = () => {
      // DPR dibatasi 1.5: di atas itu pita tidak makin tajam, hanya makin
      // mahal di HP.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uRes, width, height);
    };

    const draw = (time: number) => {
      resize();
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let raf = 0;
    let running = false;

    const loop = (now: number) => {
      draw(now / 1000);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };

    // Reduced motion: satu frame statis, lalu berhenti. Pita tetap ada
    // sebagai gambar, tidak lagi sebagai gerakan.
    const paintStatic = () => {
      stop();
      draw(0);
    };

    const syncWithMotion = () => {
      if (motion.matches) paintStatic();
      else start();
    };

    syncWithMotion();

    // Berhenti saat canvas tidak terlihat atau tab disembunyikan: canvas
    // fullscreen yang tetap jalan hanya membakar baterai.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (motion.matches) return;
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!motion.matches) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onMotionChange = () => syncWithMotion();
    motion.addEventListener('change', onMotionChange);

    const onResize = () => {
      resize();
      if (motion.matches) draw(0);
    };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onMotionChange);
      window.removeEventListener('resize', onResize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <canvas ref={ref} className="v9-hero__canvas" aria-hidden="true" />;
}
