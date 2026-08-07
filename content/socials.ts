// Shared contact/social links — used by both the desktop Sidebar and the
// Contact section's link row so the two never drift out of sync.
export const CONTACT_EMAIL = 'hi.nurfajar@gmail.com';

export const SOCIAL_LINKS = [
  { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL, kind: 'mail' },
  { href: 'https://www.linkedin.com/in/nurfajar/', label: 'linkedin/nurfajar', kind: 'linkedin' },
  { href: 'https://github.com/nur-fajar', label: 'github/nur-fajar', kind: 'github' },
] as const;

export const CV_HREF = '/nf.pdf';
export const CV_FILENAME = 'Nur-Fajar-CV-AI-LnD-2026.pdf';
