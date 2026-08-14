import Image from 'next/image';
import Reveal from './motion/Reveal';
import ScrubText from './motion/ScrubText';
import Keyword from './motion/Keyword';
import ReadingRail from './motion/ReadingRail';
import PhotoFrame from './motion/PhotoFrame';
import StatCountUp from './motion/StatCountUp';
import { BotIcon, CodeIcon, LayersIcon, SparkleIcon, TargetIcon, UsersIcon } from './icons';

const HIGHLIGHTS = [
  { name: 'Instructional Design', icon: LayersIcon },
  { name: 'GenAI Curriculum', icon: SparkleIcon },
  { name: 'Facilitation & Train the Trainers', icon: UsersIcon },
  { name: 'Python + LLM APIs', icon: CodeIcon },
  { name: 'AI Agent Automation', icon: BotIcon },
  { name: 'Program Management', icon: TargetIcon },
];

// The numbers already live inside the prose below — pulled out here too so
// a skimming reader catches them without reading every sentence.
const STATS = [
  { value: '50+', label: 'ML mentees at Bangkit Academy' },
  { value: '100+', label: 'Professionals trained at Terra Weather' },
  { value: '9.0/10', label: 'Training satisfaction score' },
  { value: '83%', label: 'Prep time cut via automation' },
];

const JOURNEY = [
  { place: 'Universitas Siliwangi', detail: 'Best Graduate, Faculty of Engineering' },
  { place: 'GDSC Unsil', detail: 'Founding chapter lead' },
  { place: 'Bangkit Academy', detail: 'ML Mentor · 50+ students' },
  { place: 'Terra Weather', detail: 'L&D + Automation' },
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
        <div className="about-text">
          <ReadingRail>
            <ScrubText>
              Hello! I&apos;m Nur Fajar, and I design the systems that turn a room full of strangers into people who
              can actually do the thing — chatbots, GenAI workflows, prompt engineering. My path here started at{' '}
              <Keyword>Universitas Siliwangi</Keyword>, graduating as best graduate of the Faculty of Engineering with
              a 3.94 GPA while founding the first Google Developer Student Clubs chapter on campus and running a
              village service program of 16 students at the same time.
            </ScrubText>
            <ScrubText>
              That habit of leading and building in parallel carried straight into work. As a Machine Learning Mentor
              at <Keyword>Bangkit Academy</Keyword> I coached 50+ students to a 90%+ graduation rate, then joined
              Terra Weather, where I&apos;ve trained 100+ professionals on generative AI with a 9.0/10 satisfaction
              score and still design and deliver the curriculum today — but I also built the B2B outreach automation
              running underneath it, a 9-agent pipeline that cut per-prospect prep time by 83%.
            </ScrubText>

            <Reveal as="div" className="about-stats" index={2}>
              {STATS.map((s) => (
                <div className="about-stat" key={s.label}>
                  <span className="about-stat-num mono">
                    <StatCountUp value={s.value} />
                  </span>
                  <span className="about-stat-label">{s.label}</span>
                </div>
              ))}
            </Reveal>

            <Reveal as="ol" className="about-journey mono" index={3}>
              {JOURNEY.map((j) => (
                <li key={j.place}>
                  <span className="about-journey-place">{j.place}</span>
                  <span className="about-journey-detail">{j.detail}</span>
                </li>
              ))}
            </Reveal>

            <Reveal as="p" index={4}>
              Here are a few things I work with day to day:
            </Reveal>

            <Reveal as="ul" className="about-skills" index={5}>
              {HIGHLIGHTS.map(({ name, icon: Icon }) => (
                <li key={name}>
                  <Icon />
                  <span>{name}</span>
                </li>
              ))}
            </Reveal>
          </ReadingRail>
        </div>

        <div className="about-photo">
          <PhotoFrame>
            <Image className="img" src="/foto-profile-nf.jpg" alt="Nur Fajar" width={300} height={300} priority />
          </PhotoFrame>
        </div>
      </div>
    </section>
  );
}
