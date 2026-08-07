import SectionHeading from './SectionHeading';
import FlipCard from './FlipCard';
import Reveal from './motion/Reveal';

export default function Playground() {
  return (
    <section id="playground" className="section">
      <Reveal as="div">
        <SectionHeading num="04" title="Playground" />
        <p className="section-lede">
          A small terminal instead of a big bio photo — flip through it: a portrait, a draggable zodiac globe, a
          sudoku generator, a hand-rolled chess engine, and a rotating shelf of book quotes.
        </p>
      </Reveal>
      <Reveal as="div">
        <FlipCard />
      </Reveal>
    </section>
  );
}
