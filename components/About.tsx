import Image from 'next/image';
import Reveal from './motion/Reveal';

const HIGHLIGHTS = [
  'Instructional Design',
  'GenAI Curriculum',
  'Facilitation & Train the Trainers',
  'Python + LLM APIs',
  'AI Agent Automation',
  'Program Management',
];

export default function About() {
  return (
    <section id="about">
      <Reveal as="div">
        <h2 className="numbered-heading">
          <span className="num mono">01.</span> About Me
        </h2>
      </Reveal>

      <div className="about-grid">
        <Reveal as="div" className="about-text">
          <div>
            <p>
              Hello! I&apos;m Nur Fajar, and I design the systems that turn a room full of strangers into people who
              can actually do the thing — chatbots, GenAI workflows, prompt engineering. My path here started at{' '}
              <span className="inline-link">Universitas Siliwangi</span>, graduating as best graduate of the Faculty
              of Engineering with a 3.94 GPA while founding the first Google Developer Student Clubs chapter on
              campus and running a village service program of 16 students at the same time.
            </p>
            <p>
              That habit of leading and building in parallel carried straight into work. As a Machine Learning
              Mentor at <span className="inline-link">Bangkit Academy</span> I coached 50+ students to a 90%+
              graduation rate; at Terra AI I trained 100+ professionals on generative AI with a 9.0/10 satisfaction
              score. These days, at Terra Weather, I still design and deliver the curriculum — but I also built the
              B2B outreach automation running underneath it, a 9-agent pipeline that cut per-prospect prep time by
              83%.
            </p>
            <p>Here are a few things I work with day to day:</p>
          </div>

          <ul className="about-skills mono">
            {HIGHLIGHTS.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="div" className="about-photo" index={1}>
          <div className="frame">
            <Image className="img" src="/foto-profile-nf.jpg" alt="Nur Fajar" width={300} height={300} priority />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
