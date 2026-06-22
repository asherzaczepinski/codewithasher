export const NB_TOTAL_STEPS = 14;

export const NB_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Bayesian Thinking',
  2: 'The Naive Assumption',
  3: 'A Complete Classifier',
  4: 'Making It Robust',
};

export const NB_STEPS = [
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  { id: 2, title: 'How a Spam Filter Sees Email', shortTitle: 'Bag of Words', part: 0 },
  { id: 3, title: 'Conditional Probability Recap', shortTitle: 'Conditional', part: 1 },
  { id: 4, title: 'Probabilities as Counts', shortTitle: 'Counting', part: 1 },
  { id: 5, title: "Bayes' Theorem for Classification", shortTitle: 'Bayes Rule', part: 1 },
  { id: 6, title: 'Prior, Likelihood, Posterior', shortTitle: 'Belief Update', part: 1 },
  { id: 7, title: 'The "Naive" Independence Assumption', shortTitle: 'Naive Assumption', part: 2 },
  { id: 8, title: 'Why Independence Makes It Tractable', shortTitle: 'Tractability', part: 2 },
  { id: 9, title: 'Building the Likelihood Table', shortTitle: 'Likelihood Table', part: 3 },
  { id: 10, title: 'Spam Classifier Worked Example', shortTitle: 'Worked Example', part: 3 },
  { id: 11, title: 'Try the Classifier Yourself', shortTitle: 'Interactive', part: 3 },
  { id: 12, title: 'Zero Probabilities & Laplace Smoothing', shortTitle: 'Smoothing', part: 4 },
  { id: 13, title: 'Working in Log Space', shortTitle: 'Log Space', part: 4 },
  { id: 14, title: 'Strengths, Weaknesses & Variants', shortTitle: 'Practical Notes', part: 4 },
];
