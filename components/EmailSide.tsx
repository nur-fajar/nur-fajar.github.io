const CONTACT_EMAIL = 'hi.nurfajar@gmail.com';

export default function EmailSide() {
  return (
    <aside className="side side-email" aria-label="Email">
      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      <span className="line" aria-hidden="true" />
    </aside>
  );
}
