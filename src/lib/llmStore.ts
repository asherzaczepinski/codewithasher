export const LLM_TOTAL_STEPS = 20;

export const LLM_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Text to Numbers',
  2: 'Attention',
  3: 'The Transformer Block',
  4: 'Prediction & Training',
};

export const LLM_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome: What We Are Building', shortTitle: 'Welcome', part: 0 },
  // Part 1: Text to Numbers
  { id: 2, title: 'Tokenization: Splitting Text into Tokens', shortTitle: 'Tokenization', part: 1 },
  { id: 3, title: 'How the Tokenizer Learns Its Vocabulary', shortTitle: 'Learning Tokens', part: 1 },
  // Part 2: Attention
  { id: 4, title: 'Tokens Become Vectors', shortTitle: 'Vectors', part: 2 },
  { id: 5, title: 'Why a Fixed Vector Is Not Enough', shortTitle: 'The Context Problem', part: 2 },
  { id: 6, title: 'The Idea of Attention', shortTitle: 'Idea of Attention', part: 2 },
  { id: 7, title: 'Queries, Keys, and Values', shortTitle: 'Q, K, V', part: 2 },
  { id: 8, title: 'Attention Scores: Query Meets Key', shortTitle: 'Scores', part: 2 },
  { id: 9, title: 'Softmax: From Scores to Weights', shortTitle: 'Softmax', part: 2 },
  { id: 10, title: 'Scaling by the Square Root of d', shortTitle: 'Scaling by √d', part: 2 },
  { id: 11, title: 'The Context Vector: Blending the Values', shortTitle: 'Context Vector', part: 2 },
  { id: 12, title: 'Multi-Head Attention: Many Questions at Once', shortTitle: 'Multi-Head', part: 2 },
  // Part 3: The Transformer Block
  { id: 13, title: 'The Feed-Forward Network', shortTitle: 'Feed-Forward', part: 3 },
  { id: 14, title: 'Residuals, LayerNorm, and the Full Block', shortTitle: 'The Full Block', part: 3 },
  { id: 15, title: 'Position and Depth', shortTitle: 'Position & Depth', part: 3 },
  // Part 4: Prediction & Training
  { id: 16, title: 'From the Final Vector to Logits', shortTitle: 'Logits', part: 4 },
  { id: 17, title: 'The Reveal: Softmax and Temperature', shortTitle: 'The Reveal', part: 4 },
  { id: 18, title: 'The Generation Loop: Watch It Write', shortTitle: 'Generation', part: 4 },
  { id: 19, title: 'How an LLM Is Trained', shortTitle: 'Training', part: 4 },
  { id: 20, title: 'From Base Model to Assistant', shortTitle: 'Real World', part: 4 },
];
