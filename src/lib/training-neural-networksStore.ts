export const TNN_TOTAL_STEPS = 8;

export const TNN_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'The Building Blocks',
  2: 'Making Training Stable',
};

export const TNN_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: The Building Blocks
  { id: 2, title: 'Activation Functions', shortTitle: 'Activations', part: 1 },
  { id: 3, title: 'Backpropagation, Deeper', shortTitle: 'Backprop', part: 1 },
  { id: 4, title: 'Weight Initialization', shortTitle: 'Initialization', part: 1 },
  // Part 2: Making Training Stable
  { id: 5, title: 'Vanishing & Exploding Gradients', shortTitle: 'Gradient Problems', part: 2 },
  { id: 6, title: 'Residual Connections', shortTitle: 'Residuals', part: 2 },
  { id: 7, title: 'Dropout & Regularization', shortTitle: 'Dropout', part: 2 },
  { id: 8, title: 'Batch & Layer Normalization', shortTitle: 'Normalization', part: 2 },
];
