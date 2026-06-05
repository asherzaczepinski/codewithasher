export const OPT_TOTAL_STEPS = 8;

export const OPT_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Optimizers',
  2: 'Regularization & Theory',
};

export const OPT_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Optimizers
  { id: 2, title: 'Momentum & Nesterov', shortTitle: 'Momentum', part: 1 },
  { id: 3, title: 'Adaptive Optimizers: AdaGrad, RMSProp, Adam', shortTitle: 'Adam', part: 1 },
  { id: 4, title: 'Learning-Rate Schedules', shortTitle: 'LR Schedules', part: 1 },
  { id: 5, title: 'Convex vs Nonconvex Optimization', shortTitle: 'Convexity', part: 1 },
  // Part 2: Regularization & Theory
  { id: 6, title: 'Regularization: L1, L2, Elastic Net', shortTitle: 'Regularization', part: 2 },
  { id: 7, title: 'MLE, MAP & Hyperparameter Search', shortTitle: 'MLE & Search', part: 2 },
  { id: 8, title: 'Statistical Learning Theory', shortTitle: 'Learning Theory', part: 2 },
];
