// "01. Title ————" — the numbered section heading every section below the
// hero shares (see .numbered-heading in globals.css). A plain <h2>, so it
// carries no semantic weight beyond what section headings already had.
export default function SectionHeading({ num, title }: { num: string; title: string }) {
  return (
    <h2 className="numbered-heading">
      <span className="num">{num}.</span>
      {title}
      <span className="rule" aria-hidden="true" />
    </h2>
  );
}
