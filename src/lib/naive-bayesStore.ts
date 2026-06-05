export const NB_TOTAL_STEPS = 6;

export const NB_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Bayesian Thinking',
  2: 'The Classifier',
};

export const NB_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Bayesian Thinking
  { id: 2, title: 'Conditional Probability Recap', shortTitle: 'Conditional', part: 1 },
  { id: 3, title: "Bayes' Theorem for Classification", shortTitle: 'Bayes Rule', part: 1 },
  // Part 2: The Classifier
  { id: 4, title: 'The "Naive" Assumption', shortTitle: 'Naive Assumption', part: 2 },
  { id: 5, title: 'Spam Classifier Worked Example', shortTitle: 'Worked Example', part: 2 },
  { id: 6, title: 'Practical Notes', shortTitle: 'Practical Notes', part: 2 },
];
