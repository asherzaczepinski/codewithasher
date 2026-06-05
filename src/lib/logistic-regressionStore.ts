export const LOG_TOTAL_STEPS = 7;

export const LOG_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'From Scores to Probabilities',
  2: 'Training',
};

export const LOG_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: From Scores to Probabilities
  { id: 2, title: 'Why a Line Falls Short', shortTitle: 'The Problem', part: 1 },
  { id: 3, title: 'The Sigmoid Function', shortTitle: 'Sigmoid', part: 1 },
  { id: 4, title: 'The Decision Boundary', shortTitle: 'Decision Boundary', part: 1 },
  // Part 2: Training
  { id: 5, title: 'Cross-Entropy Loss', shortTitle: 'Loss', part: 2 },
  { id: 6, title: 'Training with Gradient Descent', shortTitle: 'Training', part: 2 },
  { id: 7, title: 'Multiclass: Softmax', shortTitle: 'Softmax', part: 2 },
];
