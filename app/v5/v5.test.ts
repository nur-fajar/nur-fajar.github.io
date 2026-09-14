import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const CSS = readFileSync(path.join(process.cwd(), 'app', 'v5', 'v5.css'), 'utf8');
const COMPONENTS = path.join(process.cwd(), 'components', 'v5');

function componentFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return componentFiles(full);
    return entry.name.endsWith('.tsx') ? [full] : [];
  });
}

function positionedClasses(): string[] {
  const top = CSS.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const found = new Set<string>();
  for (const match of top.matchAll(/^([^{}\n][^{}]*)\{([^{}]*)\}/gm)) {
    const [, selector, body] = match;
    if (!/position:\s*(absolute|fixed)/.test(body)) continue;
    for (const part of selector.split(',')) {
      const classes = [...part.matchAll(/\.([a-zA-Z0-9_-]+)/g)].map((m) => m[1]);
      if (classes.length) found.add(classes[classes.length - 1]);
    }
  }
  return [...found];
}

describe('v5 class scoping', () => {
  it('positioned classes are used by at most one component', () => {
    const files = componentFiles(COMPONENTS);
    const sources = files.map((file) => ({ file, text: readFileSync(file, 'utf8') }));
    for (const className of positionedClasses()) {
      const token = new RegExp(`className=(?:"|\`|')[^"\`']*\\b${className}\\b`);
      const users = sources.filter((s) => token.test(s.text));
      expect(users.length, `.${className} positioned but used by ${users.length}`).toBeLessThanOrEqual(1);
    }
  });

  it('theme tokens live in .v5-root, never :root', () => {
    const rootBlocks = [...CSS.matchAll(/^:root[^{]*\{([^}]*)\}/gm)].map((m) => m[1]);
    for (const block of rootBlocks) {
      expect(block).not.toMatch(/--v5-/);
    }
  });

  it('only three breakpoints exist', () => {
    const queries = [...CSS.matchAll(/@media[^{]*max-width:\s*(\d+)px/g)].map((m) => m[1]);
    for (const q of queries) {
      expect(['640', '980', '1240']).toContain(q);
    }
  });
});

describe('v5 nav scrollspy', () => {
  it('resolves sections fresh on every pick (Work remounts on pin <-> tab switch)', () => {
    /* Regresi: Nav pernah cache getElementById sekali saat mount. Work
       ganti mode pin <-> tab dengan me-remount <section id="work">, jadi
       cache menunjuk node mati (rect nol) dan highlight nyangkut di Work
       padahal masih di Capabilities. */
    const nav = readFileSync(path.join(COMPONENTS, 'Nav.tsx'), 'utf8');
    expect(nav).toMatch(/addEventListener\('scroll'/);
    const pickBody = nav.slice(nav.indexOf('const pick'));
    expect(pickBody).toMatch(/document\.getElementById/);
  });

  it('renders Contact as a right-end CTA, not a centered link', () => {
    const nav = readFileSync(path.join(COMPONENTS, 'Nav.tsx'), 'utf8');
    expect(nav).toMatch(/v5-nav__cta/);
    expect(nav).toMatch(/#contact/);
  });
});
describe('v5 mask reveal', () => {  it('whileInView is never on the clipped line', () => {
    const clipped = ['v5-mask__line'];
    for (const file of componentFiles(COMPONENTS)) {
      const text = readFileSync(file, 'utf8');
      for (const tag of text.matchAll(/<m\.[a-zA-Z]+([^>]*)>/g)) {
        const attrs = tag[1];
        if (!/whileInView/.test(attrs)) continue;
        for (const c of clipped) {
          expect(attrs.includes(c), `${path.basename(file)}: whileInView on .${c}`).toBe(false);
        }
      }
    }
  });
});

describe('v5 canon drift guard', () => {
  it('Hero renders the H1 from canon (titleLead + indexPrompt), never hardcoded copy', () => {
    const hero = readFileSync(path.join(COMPONENTS, 'Hero.tsx'), 'utf8');
    expect(hero).toMatch(/V5_HERO\.titleLead/);
    expect(hero).toMatch(/V5_HERO\.indexPrompt/);
    expect(hero).toMatch(/V5_PILLARS/);
    expect(hero).not.toMatch(/for all of it\./);
    expect(hero).not.toMatch(/who ships/);
    expect(hero).not.toMatch(/AI generalist/);
  });

  it('no motion.* component under strict LazyMotion (use m.* instead)', () => {
    /* MotionProvider runs LazyMotion strict: rendering motion.* throws an
       uncaught error on every render, killing hydration and stranding the
       loader. This test failed on HeroArt before the fix. */
    for (const file of componentFiles(COMPONENTS)) {
      const text = readFileSync(file, 'utf8');
      for (const match of text.matchAll(/<(\/?)motion\./g)) {
        expect(
          false,
          `${path.basename(file)}: <${match[1]}motion.* under strict LazyMotion throws at runtime, use m.*`,
        ).toBe(true);
      }
    }
  });
});
