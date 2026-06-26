export const LLM_TOTAL_STEPS = 25;

export const LLM_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'From Text to Meaning',
  2: 'Attention',
  3: 'The Transformer Block',
  4: 'Prediction & Training',
};

export const LLM_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome: What We Are Building', shortTitle: 'Welcome', part: 0 },
  { id: 2, title: 'A Language Model Is a Next-Word Guesser', shortTitle: 'Next-Word Guesser', part: 0 },
  { id: 3, title: 'The Whole Machine: An Interactive Overview', shortTitle: 'The Whole Machine', part: 0 },
  // Part 1: From Text to Meaning
  { id: 4, title: 'Computers Read Numbers, Not Words', shortTitle: 'Text to Numbers', part: 1 },
  { id: 5, title: 'Tokenization: Splitting Text into Tokens', shortTitle: 'Tokenization', part: 1 },
  { id: 6, title: 'Embeddings: Token IDs Become Vectors', shortTitle: 'Embeddings', part: 1 },
  { id: 7, title: 'Inside an Embedding: Learned Features', shortTitle: 'Learned Features', part: 1 },
  { id: 8, title: 'Comparing Vectors: The Dot Product', shortTitle: 'Dot Product', part: 1 },
  { id: 9, title: 'Cosine Similarity: Direction Without Size', shortTitle: 'Cosine', part: 1 },
  // Part 2: Attention
  { id: 10, title: 'Why a Fixed Vector Is Not Enough', shortTitle: 'The Context Problem', part: 2 },
  { id: 11, title: 'The Idea of Attention', shortTitle: 'Idea of Attention', part: 2 },
  { id: 12, title: 'Queries, Keys, and Values', shortTitle: 'Q, K, V', part: 2 },
  { id: 13, title: 'Attention Scores: Query Meets Key', shortTitle: 'Scores', part: 2 },
  { id: 14, title: 'Softmax: From Scores to Weights', shortTitle: 'Softmax', part: 2 },
  { id: 15, title: 'Scaling by the Square Root of d', shortTitle: 'Scaling by √d', part: 2 },
  { id: 16, title: 'The Context Vector: Blending the Values', shortTitle: 'Context Vector', part: 2 },
  { id: 17, title: 'Multi-Head Attention: Many Questions at Once', shortTitle: 'Multi-Head', part: 2 },
  // Part 3: The Transformer Block
  { id: 18, title: 'The Feed-Forward Network', shortTitle: 'Feed-Forward', part: 3 },
  { id: 19, title: 'Residuals, LayerNorm, and the Full Block', shortTitle: 'The Full Block', part: 3 },
  { id: 20, title: 'Position and Depth', shortTitle: 'Position & Depth', part: 3 },
  // Part 4: Prediction & Training
  { id: 21, title: 'From the Final Vector to Logits', shortTitle: 'Logits', part: 4 },
  { id: 22, title: 'The Reveal: Softmax and Temperature', shortTitle: 'The Reveal', part: 4 },
  { id: 23, title: 'The Generation Loop: Watch It Write', shortTitle: 'Generation', part: 4 },
  { id: 24, title: 'How an LLM Is Trained', shortTitle: 'Training', part: 4 },
  { id: 25, title: 'From Base Model to Assistant', shortTitle: 'Real World', part: 4 },
];
