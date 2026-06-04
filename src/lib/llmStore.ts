export const LLM_TOTAL_STEPS = 8;

export const LLM_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Tokens & Meaning',
  2: 'The Transformer',
};

export const LLM_STEPS = [
  // Intro
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  { id: 2, title: 'What Is a Language Model?', shortTitle: 'What Is an LLM', part: 0 },
  // Part 1: Tokens & Meaning
  { id: 3, title: 'Tokenization: Turning Text into Numbers', shortTitle: 'Tokenization', part: 1 },
  { id: 4, title: 'Embeddings: Words as Vectors', shortTitle: 'Embeddings', part: 1 },
  // Part 2: The Transformer
  { id: 5, title: 'Attention: Words Looking at Words', shortTitle: 'Attention', part: 2 },
  { id: 6, title: 'Self-Attention by Hand: Q, K, V', shortTitle: 'Q, K, V', part: 2 },
  { id: 7, title: 'Stacking Blocks: The Transformer', shortTitle: 'Transformer', part: 2 },
  { id: 8, title: 'Generating Text: Next-Token Prediction', shortTitle: 'Generation', part: 2 },
];
