export interface BookQuote {
  text: string;
  author: string;
  book: string;
}

export const FLIP_TOOLTIPS = [
  "Hi, I'm Nur Fajar — most people call me NF or Fajar. Thanks for visiting my site. Flip this card to see how I actually think — how I read patterns, solve problems, lead, and keep growing.",
  "I've read the night sky since I was a kid, tracing patterns in stars scattered light-years apart. It's where I first learned to step back, see the bigger picture, and connect things that don't look connected yet — the start of how I think strategically.",
  'Sudoku is how I practice solving: weigh every possibility, rule out what doesn’t hold, and commit to the one answer left — a calculated risk, not a guess.',
  'Chess is how I practice leading: make the move, own what it costs, and think past my own next step to how the other side will respond.',
  'Books are how I keep growing: every one pushes me to adapt, rethink what I know, and become a little more than I was before.',
];

export const BOOK_QUOTES: BookQuote[] = [
  {
    text: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    author: 'James Clear',
    book: 'Atomic Habits',
  },
  { text: 'Begin with the end in mind.', author: 'Stephen R. Covey', book: 'The 7 Habits of Highly Effective People' },
  {
    text: 'When we are no longer able to change a situation, we are challenged to change ourselves.',
    author: 'Viktor E. Frankl',
    book: "Man's Search for Meaning",
  },
  {
    text: 'Whatever the mind can conceive and believe, it can achieve.',
    author: 'Napoleon Hill',
    book: 'Think and Grow Rich',
  },
  { text: 'Becoming is better than being.', author: 'Carol S. Dweck', book: 'Mindset' },
  { text: 'Enthusiasm is common. Endurance is rare.', author: 'Angela Duckworth', book: 'Grit' },
];
