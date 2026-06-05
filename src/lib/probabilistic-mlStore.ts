export const PML_TOTAL_STEPS = 8;

export const PML_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Models with Structure',
  2: 'Inference',
};

export const PML_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Models with Structure
  { id: 2, title: 'Conditional Independence & Generative Models', shortTitle: 'Independence', part: 1 },
  { id: 3, title: 'Bayesian Networks', shortTitle: 'Bayes Nets', part: 1 },
  { id: 4, title: 'Markov Random Fields & CRFs', shortTitle: 'MRFs & CRFs', part: 1 },
  { id: 5, title: 'Hidden Markov Models', shortTitle: 'HMMs', part: 1 },
  // Part 2: Inference
  { id: 6, title: 'Bayesian Inference', shortTitle: 'Bayesian Inference', part: 2 },
  { id: 7, title: 'Sampling & Monte Carlo (MCMC)', shortTitle: 'MCMC', part: 2 },
  { id: 8, title: 'Variational Inference & Uncertainty', shortTitle: 'Variational & Uncertainty', part: 2 },
];
