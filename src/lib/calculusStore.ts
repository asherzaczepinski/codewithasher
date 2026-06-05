export const CALC_TOTAL_STEPS = 7;

export const CALC_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Derivatives',
  2: 'Gradients',
};

export const CALC_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Derivatives
  { id: 2, title: 'Functions & Slope', shortTitle: 'Slope', part: 1 },
  { id: 3, title: 'The Derivative', shortTitle: 'Derivative', part: 1 },
  { id: 4, title: 'Rules of Differentiation', shortTitle: 'Rules', part: 1 },
  { id: 5, title: 'The Chain Rule', shortTitle: 'Chain Rule', part: 1 },
  // Part 2: Gradients
  { id: 6, title: 'Partial Derivatives', shortTitle: 'Partials', part: 2 },
  { id: 7, title: 'The Gradient', shortTitle: 'Gradient', part: 2 },
];
