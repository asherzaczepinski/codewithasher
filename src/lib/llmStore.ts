export const LLM_TOTAL_STEPS = 15;

export const LLM_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Tokens & Meaning',
  2: 'Attention',
  3: 'The Transformer',
  4: 'Generation & Training',
};

export const LLM_STEPS = [
  // Intro
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  { id: 2, title: 'What Is a Language Model?', shortTitle: 'What Is an LLM', part: 0 },
  // Part 1: Tokens & Meaning
  { id: 3, title: 'Tokenization: Turning Text into Numbers', shortTitle: 'Tokenization', part: 1 },
  { id: 4, title: 'Embeddings: Words as Vectors', shortTitle: 'Embeddings', part: 1 },
  { id: 5, title: 'Measuring Meaning: Dot Product & Cosine', shortTitle: 'Similarity', part: 1 },
  // Part 2: Attention
  { id: 6, title: 'Why Context Matters: The Idea of Attention', shortTitle: 'Attention', part: 2 },
  { id: 7, title: 'Queries, Keys, and Values', shortTitle: 'Q, K, V', part: 2 },
  { id: 8, title: 'Attention by Hand: A Worked Example', shortTitle: 'Attention by Hand', part: 2 },
  { id: 9, title: 'Multi-Head Attention: Many Perspectives', shortTitle: 'Multi-Head', part: 2 },
  // Part 3: The Transformer
  { id: 10, title: 'The Transformer Block', shortTitle: 'The Block', part: 3 },
  { id: 11, title: 'Position, Depth, and the Context Window', shortTitle: 'Position & Depth', part: 3 },
  // Part 4: Generation & Training
  { id: 12, title: 'Logits, Softmax, and Temperature', shortTitle: 'Temperature', part: 4 },
  { id: 13, title: 'The Generation Loop: Watch It Write', shortTitle: 'Generation', part: 4 },
  { id: 14, title: 'How an LLM Is Trained', shortTitle: 'Training', part: 4 },
  { id: 15, title: 'From Base Model to Assistant', shortTitle: 'Real World', part: 4 },
];
