import { V9_BIO } from '@/content/v9';

/**
 * Blok bio v9.
 *
 * Paragrafnya verbatim founder dan tidak boleh dirapikan: ini satu-satunya
 * tempat suara orang pertama dipakai di halaman ini. Yang ditambahkan di
 * sini cuma tautan dan logo untuk perusahaan yang disebut, dan itu pun
 * diambil dari kanon, bukan diketik tangan.
 *
 * Paragraf pertama dibuat lebih besar (1.18rem) sebagai pintu masuk, sisa
 * paragraf mengikuti sebagai tubuh.
 */
function BioParagraph({ text }: { text: string }) {
  const marks = V9_BIO.links
    .map((link) => ({ ...link, at: text.indexOf(link.phrase) }))
    .filter((mark) => mark.at >= 0)
    .sort((a, b) => a.at - b.at);

  if (!marks.length) return <p>{text}</p>;

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const { phrase, href, logo, size, at } of marks) {
    if (at < cursor) continue;
    if (at > cursor) nodes.push(text.slice(cursor, at));
    const label = text.slice(at, at + phrase.length);
    const isHttp = href.startsWith('http');
    nodes.push(
      <a
        key={`${at}-${phrase}`}
        href={href}
        className={logo ? 'v9-bio__chip' : undefined}
        {...(isHttp ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {logo ? (
          <img src={logo} alt="" style={{ height: size ? `${size}em` : '1em' }} />
        ) : null}
        {label}
      </a>,
    );
    cursor = at + phrase.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return <p>{nodes}</p>;
}

export default function Bio() {
  return (
    <section className="v9-section" id="about" aria-labelledby="about-h">
      <div className="v9-shell">
        <div className="v9-section__head">
          <h2 className="v9-h2" id="about-h" data-reveal>
            {V9_BIO.heading}
          </h2>
        </div>

        <div className="v9-bio" data-reveal>
          {V9_BIO.paragraphs.map((paragraph) => (
            <BioParagraph key={paragraph} text={paragraph} />
          ))}
        </div>
      </div>
    </section>
  );
}
