/**
 * Baca attachment gambar dari opencode.db (SQLite) lewat node:sqlite.
 * Cari baris yang mengandung 'data:image/*;base64' lalu simpan sebagai file.
 */
import { DatabaseSync } from 'node:sqlite';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DB = 'C:/Users/ASUS/.local/share/opencode/opencode.db';
const OUT = 'public/v6/sprites/_inbox';
mkdirSync(OUT, { recursive: true });

const db = new DatabaseSync(DB, { readOnly: true });

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('tables:', tables.map((t) => t.name).join(', '));

const found = [];
for (const t of tables) {
  let cols;
  try {
    cols = db.prepare(`PRAGMA table_info(${t.name})`).all();
  } catch {
    continue;
  }
  for (const col of cols) {
    const colName = col.name;
    let rows;
    try {
      rows = db
        .prepare(`SELECT rowid AS rid, ${colName} AS v FROM ${t.name} WHERE ${colName} LIKE '%data:image/%base64%'`)
        .all();
    } catch {
      continue;
    }
    for (const row of rows) {
      const value = row.v;
      if (typeof value !== 'string' && !(value instanceof Uint8Array)) continue;
      const text = typeof value === 'string' ? value : Buffer.from(value).toString('utf8');
      const matches = text.match(/data:image\/[a-z+]+;base64,[A-Za-z0-9+/=]+/g) ?? [];
      for (const match of matches) {
        found.push({ table: t.name, col: colName, rid: row.rid, dataUrl: match });
      }
    }
  }
}
console.log('data-url matches:', found.length);

const seen = new Set();
let n = 0;
for (const item of found) {
  if (seen.has(item.dataUrl)) continue;
  const m = item.dataUrl.match(/^data:image\/([a-z+]+);base64,(.+)$/s);
  if (!m) continue;
  const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length < 40000) continue;
  const hash = buf.length;
  n += 1;
  const file = join(OUT, `db-${n}-${item.table}-${item.rid}.${ext}`);
  writeFileSync(file, buf);
  console.log(`${file}  ${buf.length} bytes  (${item.table}.${item.col} rowid ${item.rid})`);
}
console.log('saved:', n);
