export const TF_TOTAL_STEPS = 8;

export const TF_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Attention',
  2: 'The Architecture & Scaling',
};

export const TF_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Attention
  { id: 2, title: 'Tokens, Embeddings & Positional Encoding', shortTitle: 'Tokens & Position', part: 1 },
  { id: 3, title: 'Self-Attention: Q, K, V', shortTitle: 'Q, K, V', part: 1 },
  { id: 4, title: 'Multi-Head & Masked Attention', shortTitle: 'Multi-Head', part: 1 },
  // Part 2: The Architecture & Scaling
  { id: 5, title: 'The Transformer Block', shortTitle: 'The Block', part: 2 },
  { id: 6, title: 'Encoder, Decoder & Generation', shortTitle: 'Architectures', part: 2 },
  { id: 7, title: 'Efficient Attention & Long Context', shortTitle: 'Efficiency', part: 2 },
  { id: 8, title: 'Vision, Multimodal & Scaling Laws', shortTitle: 'Beyond Text', part: 2 },
];
