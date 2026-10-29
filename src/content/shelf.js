/**
 * Joshua's library for /shelf, and the podcasts pinned on the corkboard. Covers are local copies
 * (public/covers, from Open Library); a book with `cover: null` gets a typeset cover instead.
 */

const book = (id, title, author, topics = [], note = null) => ({ id, title, author, topics, note, cover: `/covers/${id}.jpg` });

export const SHELF = [
  {
    id: "now",
    title: "currently reading",
    books: [
      book("same-as-ever", "Same as Ever", "Morgan Housel", ["psychology", "risk", "investing"]),
      book("socrates-express", "The Socrates Express", "Eric Weiner", ["philosophy", "history of ideas"]),
      book("how-not-to-be-wrong", "How Not to Be Wrong", "Jordan Ellenberg", ["mathematics", "statistics", "reasoning"]),
    ],
  },
  {
    id: "text",
    title: "the textbooks",
    books: [
      book("ddia", "Designing Data-Intensive Applications", "Martin Kleppmann", ["distributed systems", "databases", "data pipelines"]),
      book("designing-ml-systems", "Designing Machine Learning Systems", "Chip Huyen", ["mlops", "data", "deployment"]),
      book("ai-engineering", "AI Engineering", "Chip Huyen", ["llms", "evaluation", "foundation models"]),
    ],
  },
  {
    id: "next",
    title: "up next",
    books: [
      book("zen-flesh", "Zen Flesh, Zen Bones", "Paul Reps & Nyogen Senzaki"),
      book("how-the-world-works", "How the World Really Works", "Vaclav Smil"),
      book("existentialist-cafe", "At the Existentialist Café", "Sarah Bakewell"),
      book("how-to-live", "How to Live: A Life of Montaigne", "Sarah Bakewell"),
      book("laws-of-human-nature", "The Laws of Human Nature", "Robert Greene"),
      book("creative-act", "The Creative Act", "Rick Rubin"),
      book("why-machines-learn", "Why Machines Learn", "Anil Ananthaswamy"),
      book("courage-is-calling", "Courage Is Calling", "Ryan Holiday"),
      book("the-body", "The Body", "Bill Bryson"),
    ],
  },
  {
    id: "read",
    title: "already read",
    books: [
      book("meditations", "Meditations", "Marcus Aurelius"),
      book("changing-world-order", "Principles for Dealing with the Changing World Order", "Ray Dalio"),
      book("deep-work", "Deep Work", "Cal Newport"),
      book("black-swan", "The Black Swan", "Nassim Nicholas Taleb"),
      book("zero", "Zero: The Biography of a Dangerous Idea", "Charles Seife"),
      book("thousand-brains", "A Thousand Brains", "Jeff Hawkins"),
      book("infinite-powers", "Infinite Powers", "Steven Strogatz"),
      book("how-children-succeed", "How Children Succeed", "Paul Tough"),
      book("mans-search", "Man's Search for Meaning", "Viktor Frankl"),
      book("righteous-mind", "The Righteous Mind", "Jonathan Haidt"),
      book("bubble-or-revolution", "Bubble or Revolution?", "Neel Mehta, Aditya Agashe & Parth Detroja"),
      book("cant-hurt-me", "Can't Hurt Me", "David Goggins"),
      book("adam-smith", "How Adam Smith Can Change Your Life", "Russ Roberts"),
      book("chip-war", "Chip War", "Chris Miller"),
      book("ai-snake-oil", "AI Snake Oil", "Arvind Narayanan & Sayash Kapoor"),
      book("thinking-fast-slow", "Thinking, Fast and Slow", "Daniel Kahneman", [], "partway"),
      book("outliers", "Outliers", "Malcolm Gladwell"),
      book("tipping-point", "The Tipping Point", "Malcolm Gladwell"),
    ],
  },
];

/** A Goodreads search for the book: reliable without hand-copied ids. */
export const goodreads = ({ title, author }) => `https://www.goodreads.com/search?q=${encodeURIComponent(`${title} ${author}`)}`;

/** Pinned on the corkboard in creative mode. */
export const PODCASTS = [
  { id: "how-to-take-over-the-world", name: "How to Take Over the World", host: "Ben Wilson", art: "/podcasts/how-to-take-over-the-world.jpg", href: "https://open.spotify.com/show/1gqvQ7h7BxNSVoQVTnwihr" },
  { id: "founders", name: "Founders", host: "David Senra", art: "/podcasts/founders.jpg", href: "https://open.spotify.com/show/7txiovdzPARhjm18NwMUYj" },
  { id: "maxinomics", name: "Maxinomics", host: "Phil Andrews", art: "/podcasts/maxinomics.jpg", href: "https://open.spotify.com/show/3DFQJnh5pZv0sa1yojzoM1" },
  { id: "ai-daily-brief", name: "The AI Daily Brief", host: "Nathaniel Whittemore", art: "/podcasts/ai-daily-brief.jpg", href: "https://open.spotify.com/show/7gKwwMLFLc6RmjmRpbMtEO" },
];
