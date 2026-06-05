export const MATH_TOTAL_STEPS = 7;

export const MATH_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Functions & Their Shapes',
  2: 'Calculus & Optimization Glue',
};

export const MATH_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Functions & Their Shapes
  { id: 2, title: 'Algebra & Functions', shortTitle: 'Functions', part: 1 },
  { id: 3, title: 'Exponentials', shortTitle: 'Exponentials', part: 1 },
  { id: 4, title: 'Logarithms', shortTitle: 'Logarithms', part: 1 },
  // Part 2: Calculus & Optimization Glue
  { id: 5, title: 'Derivatives & Gradients (Recap)', shortTitle: 'Derivatives', part: 2 },
  { id: 6, title: 'Integrals', shortTitle: 'Integrals', part: 2 },
  { id: 7, title: 'Convexity & Optimization', shortTitle: 'Convexity', part: 2 },
];
