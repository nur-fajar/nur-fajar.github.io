// components/retro/CvOverlay.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CONTACT, ORG, PROJECTS, SKILLS, WORK } from '@/lib/retro/content';
import { RichText } from './RichText';

function CvSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <>
      <h3 className="mt-6 border-b-2 border-[var(--ink)] pb-1.5 font-pixel text-[10px]">{heading}</h3>
      {children}
    </>
  );
}

export function CvOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Full CV"
          className="fixed inset-0 z-80 overflow-y-auto bg-[var(--cream)] px-4.5 pb-16 pt-5 text-[var(--ink)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mx-auto max-w-[760px]">
            <button
              type="button"
              onClick={onClose}
              className="sticky top-0 float-right bg-[var(--ink)] px-2.5 py-2 font-pixel text-[9px] text-[var(--cream)]"
            >
              CLOSE ✕
            </button>
            <h1 className="font-pixel text-[15px] leading-relaxed">NUR FAJAR</h1>
            <p className="mb-4.5 text-[var(--ink-2)]">
              Learning &amp; Development · Instructional Design · Program Management · AI Automation
              <br />
              Indonesia — hello@nurfajar.com — linkedin.com/in/nurfajar
            </p>
            <p>
              Designs learning programs end to end, from analysis to evaluation, and builds the automation that
              runs the process. Experience leading cross-discipline teams, building a community chapter from zero,
              and shipping products real users rely on.
            </p>

            <CvSection heading="WORK EXPERIENCE">
              {WORK.map((d) => (
                <div key={d.tag} className="mt-4">
                  <h4 className="font-pixel text-[9px]">{d.title}</h4>
                  <p className="text-[var(--ink-2)]">{d.sub}</p>
                  <p>
                    <RichText text={d.problem} /> <RichText text={d.resolution} />
                  </p>
                </div>
              ))}
            </CvSection>

            <CvSection heading="PROJECTS">
              {PROJECTS.map((d) => (
                <div key={d.tag} className="mt-4">
                  <h4 className="font-pixel text-[9px]">{d.title}</h4>
                  <p className="text-[var(--ink-2)]">{d.sub}</p>
                  <p>
                    <RichText text={d.problem} /> <RichText text={d.resolution} />
                  </p>
                </div>
              ))}
            </CvSection>

            <CvSection heading="ORGANIZATIONS &amp; LEADERSHIP">
              {ORG.map((d) => (
                <div key={d.tag} className="mt-4">
                  <h4 className="font-pixel text-[9px]">{d.title}</h4>
                  <p className="text-[var(--ink-2)]">{d.sub}</p>
                  <p>
                    <RichText text={d.problem} /> <RichText text={d.resolution} />
                  </p>
                </div>
              ))}
            </CvSection>

            <h3 className="mt-6 border-b-2 border-[var(--ink)] pb-1.5 font-pixel text-[10px]">SKILLS</h3>
            {SKILLS.map((s) => (
              <div key={s.name} className="mt-3">
                <h4 className="font-pixel text-[9px]">{s.plainName.toUpperCase()}</h4>
                <ul className="ml-5 list-disc">
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}

            <h3 className="mt-6 border-b-2 border-[var(--ink)] pb-1.5 font-pixel text-[10px]">CONTACT</h3>
            <ul className="ml-5 list-disc">
              {CONTACT.map((c) => (
                <li key={c.tag}>
                  {c.tag} — <a href={c.href}>{c.value}</a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
