export const GD_TOTAL_STEPS = 7;

export const GD_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'The Core Idea',
  2: 'Making It Work',
};

export const GD_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: The Core Idea
  { id: 2, title: 'Cost Functions', shortTitle: 'Cost', part: 1 },
  { id: 3, title: 'Slope Points the Way', shortTitle: 'Slope', part: 1 },
  { id: 4, title: 'The Update Rule', shortTitle: 'Update Rule', part: 1 },
  // Part 2: Making It Work
  { id: 5, title: 'The Learning Rate', shortTitle: 'Learning Rate', part: 2 },
  { id: 6, title: 'Stochastic & Mini-Batch GD', shortTitle: 'SGD', part: 2 },
  { id: 7, title: 'Momentum & Adam', shortTitle: 'Momentum & Adam', part: 2 },
];
