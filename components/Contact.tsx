import YearNow from './YearNow';

export default function Contact() {
  return (
    <footer id="contact" className="section">
      <p className="section-label mono">CONTACT</p>
      <div className="panel contact">
        <h2>Open channel.</h2>
        <p>Available for AI L&amp;D programs, GenAI curriculum work, and automation projects.</p>
        <div className="contact-links mono">
          <a href="mailto:hi.nurfajar@gmail.com">hi.nurfajar@gmail.com</a>
          <a href="https://www.linkedin.com/in/nurfajar/" target="_blank" rel="noopener">
            linkedin/nurfajar
          </a>
          <a href="https://github.com/nur-fajar" target="_blank" rel="noopener">
            github/nur-fajar
          </a>
          <a href="/nf.pdf" download="Nur-Fajar-CV-AI-LnD-2026.pdf" target="_blank" rel="noopener">
            CV.PDF ↓
          </a>
          <a href="/lab">lab / pipeline teardown (technical deep-dive, optional) →</a>
        </div>
      </div>
      <p className="foot mono">
        — END OF TRANSMISSION · © <YearNow /> NUR FAJAR —
      </p>
    </footer>
  );
}
