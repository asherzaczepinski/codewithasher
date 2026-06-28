export const LLM_TOTAL_STEPS = 26;

export const LLM_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Text to Numbers',
  2: 'Numbers to Meaning',
  3: 'Attention',
  4: 'The Transformer Block',
  5: 'Prediction & Training',
};

export const LLM_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome: What We Are Building', shortTitle: 'Welcome', part: 0 },
  { id: 2, title: 'The Whole Machine: An Interactive Overview', shortTitle: 'The Whole Machine', part: 0 },
  // Part 1: Text to Numbers
  { id: 3, title: 'Tokenization: Splitting Text into Tokens', shortTitle: 'Tokenization', part: 1 },
  { id: 4, title: 'How the Tokenizer Learns Its Vocabulary', shortTitle: 'Learning Tokens', part: 1 },
  // Part 2: Numbers to Meaning
  { id: 5, title: 'Embeddings: Token IDs Become Vectors', shortTitle: 'Embeddings', part: 2 },
  { id: 6, title: 'Inside an Embedding: Learned Features', shortTitle: 'Learned Features', part: 2 },
  { id: 7, title: 'How an Embedding Learns Its Numbers', shortTitle: 'Watch It Learn', part: 2 },
  { id: 8, title: 'Embeddings in the Wild: Word2Vec and Beyond', shortTitle: 'In the Wild', part: 2 },
  { id: 9, title: 'Comparing Vectors: The Dot Product', shortTitle: 'Dot Product', part: 2 },
  { id: 10, title: 'Cosine Similarity: Direction Without Size', shortTitle: 'Cosine', part: 2 },
  // Part 3: Attention
  { id: 11, title: 'Why a Fixed Vector Is Not Enough', shortTitle: 'The Context Problem', part: 3 },
  { id: 12, title: 'The Idea of Attention', shortTitle: 'Idea of Attention', part: 3 },
  { id: 13, title: 'Queries, Keys, and Values', shortTitle: 'Q, K, V', part: 3 },
  { id: 14, title: 'Attention Scores: Query Meets Key', shortTitle: 'Scores', part: 3 },
  { id: 15, title: 'Softmax: From Scores to Weights', shortTitle: 'Softmax', part: 3 },
  { id: 16, title: 'Scaling by the Square Root of d', shortTitle: 'Scaling by √d', part: 3 },
  { id: 17, title: 'The Context Vector: Blending the Values', shortTitle: 'Context Vector', part: 3 },
  { id: 18, title: 'Multi-Head Attention: Many Questions at Once', shortTitle: 'Multi-Head', part: 3 },
  // Part 4: The Transformer Block
  { id: 19, title: 'The Feed-Forward Network', shortTitle: 'Feed-Forward', part: 4 },
  { id: 20, title: 'Residuals, LayerNorm, and the Full Block', shortTitle: 'The Full Block', part: 4 },
  { id: 21, title: 'Position and Depth', shortTitle: 'Position & Depth', part: 4 },
  // Part 5: Prediction & Training
  { id: 22, title: 'From the Final Vector to Logits', shortTitle: 'Logits', part: 5 },
  { id: 23, title: 'The Reveal: Softmax and Temperature', shortTitle: 'The Reveal', part: 5 },
  { id: 24, title: 'The Generation Loop: Watch It Write', shortTitle: 'Generation', part: 5 },
  { id: 25, title: 'How an LLM Is Trained', shortTitle: 'Training', part: 5 },
  { id: 26, title: 'From Base Model to Assistant', shortTitle: 'Real World', part: 5 },
];
