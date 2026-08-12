// Renderer teks kaya minimal: **bold** jadi <b>, __teks__ jadi <em> (highlight),
// tanpa dangerouslySetInnerHTML — semua lewat elemen React biasa.

const TOKEN = /(\*\*[^*]+\*\*|__[^_]+__)/g;

export function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter((p) => p.length > 0);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <b key={i}>{part.slice(2, -2)}</b>;
        }
        if (part.startsWith('__') && part.endsWith('__')) {
          return <em key={i}>{part.slice(2, -2)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
