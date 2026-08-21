'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { m } from 'framer-motion';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { ADDIE_PHASES, ADDIE_SECTION, type AddieBlock } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * Satu program, dibaca lewat lima fase ADDIE.
 *
 * BENTUKNYA satu kolom yang ditumpuk: kepala section rata kiri, lalu satu
 * panel selebar penuh dengan lima tab bergaya browser di kepalanya sendiri.
 * Panelnya bertinggi tetap, dan isinya yang berganti mengikuti tab.
 *
 * Dua bentuk sebelumnya sudah dicoba dan dibuang, dan keduanya jatuh di
 * tempat yang sama, yaitu tinggi. Grid bento lima kartu menaruh isi fase di
 * balik dialog, jadi lima fase berarti lima kali buka-tutup untuk membaca
 * satu proses yang gunanya dibaca berurutan. Accordion menghapus dialognya
 * tapi menukarnya dengan section yang panjangnya berubah-ubah: Analysis punya
 * lima blok dan Evaluation dua belas, jadi membuka fase terakhir menggeser
 * separuh halaman ke bawah.
 *
 * Panel bertinggi tetap menutup keduanya. Isinya menggulir di dalam panel,
 * bukan di halaman, jadi tidak ada fase yang perlu diringkas demi muat dan
 * tidak ada yang bergerak di luar panel apa pun yang dipilih pembaca.
 *
 * TIDAK ADA AUTO-REVEAL di sini, dan itu keputusan yang dibalik dari draft
 * accordion. Tab pertama (Analysis) aktif sejak render server, jadi section
 * ini terbaca lengkap bahkan sebelum JavaScript sempat jalan; sisanya
 * dipilih pembaca. Reveal berurutan masuk akal untuk isi yang ditumpuk di
 * jalur scroll, dan tidak masuk akal untuk lima pilihan yang berbagi satu
 * wadah, karena di sana ia cuma akan mengganti-ganti isi panel sendiri saat
 * halaman digulir.
 */

const TAG_ORDER: Record<string, string> = {
  Concept: 'a',
  Discussion: 'b',
  Practice: 'c',
  Demo: 'd',
};

/** Satu blok konten. Setiap `kind` punya bentuknya sendiri; tidak ada yang
 *  dirender lewat dangerouslySetInnerHTML, jadi tidak ada HTML dari kedelapan
 *  dokumen sumber yang ikut masuk membawa warna dan spacing-nya sendiri. */
function Block({ block }: { block: AddieBlock }) {
  switch (block.kind) {
    case 'prose':
      return <p className="phase__prose">{block.body}</p>;

    case 'note':
      return (
        <aside className="phase__note">
          <p className="phase__note-title">{block.title}</p>
          <p className="phase__note-body">{block.body}</p>
        </aside>
      );

    /* Tabel gap dirender sebagai <table> betulan, bukan grid div. Ia memang
       tabel: tiga baris yang cuma punya arti kalau kolom "current" dan
       "desired" dibaca berpasangan, dan pembaca screen reader butuh hubungan
       baris-kolom itu diumumkan, bukan disimpulkan dari urutan. */
    case 'gapTable':
      return (
        <div className="phase__block">
          <div className="phase__table-scroll">
            <table className="gap">
              <thead>
                <tr>
                  <th scope="col">Dimension</th>
                  <th scope="col">Where they were</th>
                  <th scope="col">Where they needed to be</th>
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row.dimension}>
                    <th scope="row">{row.dimension}</th>
                    <td>{row.current}</td>
                    <td className="gap__desired">{row.desired}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="phase__footnote">{block.footnote}</p>
        </div>
      );

    case 'constraints':
      return (
        <ul className="constraints">
          {block.items.map((item) => (
            <li className="constraint" key={item.code}>
              <span className="constraint__code">{item.code}</span>
              <span className="constraint__title">{item.title}</span>
              <span className="constraint__body">{item.body}</span>
            </li>
          ))}
        </ul>
      );

    case 'decision':
      return (
        <div className="finding">
          <div className="finding__side">
            <span className="finding__label">Finding</span>
            <p className="finding__text">{block.finding}</p>
          </div>
          <div className="finding__side finding__side--out">
            <span className="finding__label">Decision</span>
            <p className="finding__text">{block.decision}</p>
          </div>
        </div>
      );

    /* Piramida Bloom. Lebarnya diturunkan dari posisi di array, dari puncak
       (Create, tersempit) ke dasar (Remember, penuh), jadi menambah atau
       menghapus satu level tidak menuntut satu angka pun diubah tangan. */
    case 'bloom':
      return (
        <ol className="bloom" aria-label="Bloom's taxonomy, mapped onto the four sessions">
          {block.levels.map((level, index) => {
            const step = index / (block.levels.length - 1);
            return (
              <li
                className="bloom__row"
                key={level.level}
                style={
                  {
                    '--w': `${44 + step * 56}%`,
                    '--t': step,
                  } as CSSProperties
                }
              >
                <span className="bloom__bar">
                  <span className="bloom__level">{level.level}</span>
                </span>
                <span className="bloom__day">{level.day}</span>
              </li>
            );
          })}
        </ol>
      );

    case 'objectives':
      return (
        <ul className="objectives">
          {block.items.map((item) => (
            <li className="objective" key={item.level}>
              <span className="objective__level">{item.level}</span>
              <p className="objective__text">{item.objective}</p>
              <p className="objective__evidence">
                <span className="objective__evidence-label">Measured by</span>
                {item.evidence}
              </p>
            </li>
          ))}
        </ul>
      );

    case 'stepper':
      return (
        <ol className="stepper">
          {block.steps.map((step) => (
            <li className="step" key={step.day}>
              <span className="step__day">{step.day}</span>
              <span className="step__date">{step.date}</span>
              <span className="step__title">{step.title}</span>
              <span className="step__body">{step.body}</span>
            </li>
          ))}
        </ol>
      );

    case 'linkCard':
      return (
        <a
          className="livecard"
          href={block.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="livecard__domain">{block.domain}</span>
          <span className="livecard__title">{block.title}</span>
          <span className="livecard__body">{block.body}</span>
          <span className="livecard__cta">
            {block.cta}
            <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
          </span>
        </a>
      );

    case 'frames':
      return (
        <ol className="frames">
          {block.items.map((frame) => (
            <li className="frame" key={frame.time}>
              <span className="frame__time">{frame.time}</span>
              <span className="frame__head">
                <span className="frame__title">{frame.title}</span>
                <span className={`frame__tag frame__tag--${TAG_ORDER[frame.tag]}`}>
                  {frame.tag}
                </span>
              </span>
              <span className="frame__goal">{frame.goal}</span>
            </li>
          ))}
        </ol>
      );

    case 'qa':
      return (
        <div className="qa">
          <p className="qa__q">
            <span className="qa__mark" aria-hidden="true">
              Q
            </span>
            {block.question}
          </p>
          <p className="qa__a">
            <span className="qa__mark qa__mark--a" aria-hidden="true">
              A
            </span>
            {block.answer}
          </p>
        </div>
      );

    case 'checklist':
      return (
        <div className="phase__block">
          <p className="phase__block-title">{block.title}</p>
          <ul className="checklist">
            {block.items.map((item) => (
              <li className="checklist__item" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    /* Rubrik mini. Yang ditampilkan adalah RANGKANYA, bukan isinya: empat
       kriteria kali empat nama level, tanpa deskripsi sel. Deskripsi lengkap
       ada di dokumen sumber, dan menempelkannya di sini mengubah highlight
       reel jadi dokumen yang harus dibaca, bukan dipindai. */
    case 'rubric':
      return (
        <div className="phase__block">
          <div className="phase__table-scroll">
            <table className="rubric">
              <caption className="sr-only">
                The shape of the rubric: four criteria against four levels of achievement. Each cell
                is described in full in the source document.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Criterion</th>
                  {block.levels.map((level) => (
                    <th scope="col" key={level}>
                      {level}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.criteria.map((criterion) => (
                  <tr key={criterion}>
                    <th scope="row">{criterion}</th>
                    {block.levels.map((level) => (
                      <td key={level}>
                        <span className="rubric__dot" aria-hidden="true" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="phase__footnote">{block.footnote}</p>
        </div>
      );

    /* Bar skor. Angkanya ditulis lengkap dengan penyebutnya di tiap baris
       (4.5 / 5), dan baris method di bawahnya membawa pecahan respondennya.
       Bar tanpa angka, atau angka tanpa penyebut, adalah dua cara berbeda
       untuk terlihat lebih meyakinkan daripada datanya. */
    case 'scores':
      return (
        <div className="phase__block">
          <ul className="scores">
            {block.items.map((item) => (
              <li className="score" key={item.label}>
                <span className="score__label">{item.label}</span>
                <span className="score__track">
                  <span
                    className="score__fill"
                    style={{ width: `${(item.value / block.of) * 100}%` }}
                  />
                </span>
                <span className="score__value">
                  {item.value.toFixed(1)}
                  <span className="score__of"> / {block.of}</span>
                </span>
              </li>
            ))}
          </ul>
          {/* Baris metode dirender kondisional. Bidangnya dibiarkan ada di tipe
              supaya keterangan cakupan bisa dipasang kembali tanpa mengubah
              bentuk data, tapi selama ia kosong, tidak ada paragraf kosong
              yang ikut menyisakan jarak di bawah bar. */}
          {block.method ? <p className="phase__footnote">{block.method}</p> : null}
        </div>
      );

    case 'quotes':
      return (
        <ul className="quotes">
          {block.items.map((quote) => (
            <li key={quote.by}>
              <figure className="quote">
                <blockquote className="quote__text">{quote.text}</blockquote>
                <figcaption className="quote__by">{quote.by}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      );

    case 'divider':
      return (
        <p className="phase__divider">
          <span>{block.label}</span>
        </p>
      );
  }
}

/**
 * Kolom kiri: judul, dua paragraf pembuka, dan lima tab.
 * Kolom kanan: satu panel bertinggi tetap yang isinya berganti mengikuti tab.
 *
 * Roving tabindex, bukan lima tombol yang semuanya bisa di-Tab.
 *
 * Itu pola ARIA baku untuk tablist dan alasannya praktis: dengan lima tombol
 * biasa, pengguna keyboard menekan Tab lima kali sebelum sampai ke isi panel,
 * dan empat di antaranya cuma memindahkan fokus di dalam satu kontrol yang
 * sama. Di sini Tab masuk sekali ke tab yang aktif, panah kiri/kanan atau
 * atas/bawah berpindah antar fase, dan Tab berikutnya sudah keluar ke panel.
 *
 * Pindah fase lewat panah LANGSUNG mengganti isi panel, tidak menunggu Enter.
 * Untuk tablist yang panelnya sudah dirender di klien, itu perilaku yang
 * diharapkan; menunggu konfirmasi cuma masuk akal kalau berpindah tab mahal,
 * misalnya kalau ia memicu request.
 */

/** Satu id panel, dipakai di dua tempat: aria-controls di tab dan id di
 *  panelnya. Ditulis sekali supaya keduanya tidak pernah berbeda. */
const panelIdFor = (id: string) => `phase-panel-${id}`;
const tabIdFor = (id: string) => `phase-tab-${id}`;

export default function InsideOneProgram() {
  const [activeId, setActiveId] = useState(ADDIE_PHASES[0].id);
  const active = ADDIE_PHASES.find((phase) => phase.id === activeId) ?? ADDIE_PHASES[0];
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Panel kembali ke atas setiap kali fasenya berganti.
     Tanpa ini, pembaca yang sudah menggulir jauh ke dalam Evaluation lalu
     memilih Development mendarat di tengah dokumen yang baru, di posisi
     scroll yang tidak punya hubungan apa pun dengan isinya. */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeId]);

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    let next: number | null = null;
    if (event.key in keys) {
      /* Berputar di ujungnya. Tab kelima yang mati saat ditekan panah bawah
         terbaca sebagai keyboard yang berhenti bekerja, bukan sebagai batas. */
      next = (index + keys[event.key] + ADDIE_PHASES.length) % ADDIE_PHASES.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = ADDIE_PHASES.length - 1;
    }
    if (next === null) return;
    event.preventDefault();
    setActiveId(ADDIE_PHASES[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="program">
      {/* Kepala section ditumpuk di atas panel selebar penuh.

          Versi sebelumnya menaruh judul dan dua paragraf ini di kolom kiri, di
          samping panel. Masalahnya bukan selera: kolom kiri habis di sekitar
          390px sementara panel jatuh ke 740px, jadi sepertiga bawah kolom itu
          selalu kosong, dan lubang sebesar itu di sebelah kotak yang penuh
          terbaca sebagai tata letak yang belum selesai, bukan sebagai ruang
          napas.

          Ditumpuk, tidak ada lagi dua kolom yang harus sama tinggi, dan panel
          mendapat seluruh lebar shell, yang justru dibutuhkan isinya: tabel
          empat kolom dan stepper lima langkah sebelumnya harus muat di sekitar
          530px.

          Syarat lama tetap dipegang dengan sendirinya di sini, yaitu panel
          tidak pernah naik melewati judul. Ditumpuk, itu bukan lagi aturan
          yang harus dijaga, itu urutan DOM. */}
      <Reveal className="program__head">
        <p className="eyebrow">{ADDIE_SECTION.eyebrow}</p>
        <h3 className="program__title">{ADDIE_SECTION.title}</h3>
        <p className="program__lede">{ADDIE_SECTION.lede}</p>
      </Reveal>

      <Reveal delay={0.08}>
        {/* Tab pindah ke kepala panel dan mengambil bentuk tab browser.

            Bukan cuma pindah tempat: tab yang duduk di atas isinya sendiri
            mengatakan sesuatu yang tab di kolom terpisah tidak bisa katakan,
            yaitu bahwa kelima fase itu lima isi dari SATU wadah yang sama.
            Yang aktif berbagi warna dengan panel di bawahnya dan kehilangan
            garis bawahnya, jadi keduanya terbaca menyambung; yang lain duduk
            di bilah yang lebih gelap, di belakang. */}
        <div className="panel">
          <div className="panel__bar" role="tablist" aria-label={ADDIE_SECTION.tablistLabel}>
            {ADDIE_PHASES.map((phase, index) => {
              const on = phase.id === activeId;
              return (
                <button
                  type="button"
                  key={phase.id}
                  id={tabIdFor(phase.id)}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  className={on ? 'phasetab phasetab--on' : 'phasetab'}
                  role="tab"
                  aria-selected={on}
                  aria-controls={panelIdFor(phase.id)}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActiveId(phase.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  <span className="phasetab__index" aria-hidden="true">
                    {phase.index}
                  </span>
                  <span className="phasetab__name">{phase.phase}</span>
                </button>
              );
            })}
          </div>

          {/* Bilah asal-usul, dan ia diam saat isinya digulir.

              Nama fase sengaja TIDAK diulang di sini. Tab yang aktif sudah
              membawanya, dan judul yang sama dicetak dua kali dengan jarak
              40px membuat yang kedua terbaca sebagai judul untuk sesuatu
              yang lain.

              Yang ada di sini adalah dua hal yang tidak dibawa tab: sifat
              dokumennya, dan dokumen mana. Keduanya perlu ikut tergulir
              bersama mata pembaca, karena pertanyaan "ini dari mana?" paling
              sering muncul justru di tengah tabel, bukan di baris pertama. */}
          <div className="panel__head">
            <span className="panel__badge">{ADDIE_SECTION.badge}</span>
            {/* Tanpa label "Source" di depannya. Chip-nya sudah menyebut
                nama dokumennya sendiri, dan berdiri tepat di bawah badge
                "Retrospective documentation" ia sudah terbaca sebagai
                dokumen yang mana. Label yang cuma mengulang apa yang sudah
                jelas dari posisinya adalah satu kata yang harus dibaca
                lima kali, sekali per tab. */}
            <span className="panel__sources">
              {active.sources.map((source) => (
                <span className="panel__source" key={source}>
                  {source}
                </span>
              ))}
            </span>
          </div>

          {/* tabIndex 0 di wadah yang menggulir.
              Tanpa itu, isi panel bisa digulir mouse tapi tidak bisa
              digulir panah keyboard, jadi seluruh fase Evaluation di bawah
              lipatan panel jadi isi yang tidak punya cara dijangkau tanpa
              mouse. Chrome menambahkannya sendiri untuk sebagian kasus,
              Safari tidak, dan menebak-nebak dukungan browser untuk hal
              yang biayanya satu atribut adalah tebakan yang tidak perlu. */}
          <div className="panel__scroll" ref={scrollRef} tabIndex={0}>
            {/* Tanpa AnimatePresence, dan itu koreksi dari versi pertama.

                Dengan `mode="wait"`, animasi keluar fase lama harus selesai
                sebelum yang masuk mulai. Di kartu kecil jeda itu tidak
                kelihatan; di panel setinggi 720px ia jadi kotak putih kosong
                selama hampir setengah detik setiap kali tab diklik, dan
                kotak kosong di tempat yang baru saja berisi terbaca sebagai
                konten yang gagal dimuat.

                `key` di m.div sudah cukup: React membongkar fase lama dan
                memasang yang baru di commit yang sama, jadi isinya berganti
                seketika lalu naik masuk. Tidak ada bingkai kosong di antara
                keduanya karena tidak ada saat di mana keduanya absen. */}
            <m.div
              key={active.id}
              className="panel__body"
              id={panelIdFor(active.id)}
              role="tabpanel"
              aria-labelledby={tabIdFor(active.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="panel__headline">{active.headline}</p>
              <p className="phase__question">
                <span className="phase__question-label">What this phase answers</span>
                {active.question}
              </p>
              {active.blocks.map((block, index) => (
                <Block block={block} key={`${active.id}-${index}`} />
              ))}
            </m.div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
