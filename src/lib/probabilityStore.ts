export const PROB_TOTAL_STEPS = 8;

export const PROB_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Probability',
  2: 'Statistics & Bayes',
};

export const PROB_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Probability
  { id: 2, title: 'Probability Basics', shortTitle: 'Basics', part: 1 },
  { id: 3, title: 'Combining Probabilities', shortTitle: 'Combining', part: 1 },
  { id: 4, title: 'Conditional Probability', shortTitle: 'Conditional', part: 1 },
  { id: 5, title: 'Random Variables & Distributions', shortTitle: 'Distributions', part: 1 },
  // Part 2: Statistics & Bayes
  { id: 6, title: 'Mean, Variance & Std Dev', shortTitle: 'Variance', part: 2 },
  { id: 7, title: 'The Normal Distribution', shortTitle: 'Normal', part: 2 },
  { id: 8, title: "Bayes' Theorem", shortTitle: 'Bayes', part: 2 },
];
