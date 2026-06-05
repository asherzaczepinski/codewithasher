export const LR_TOTAL_STEPS = 7;

export const LR_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Fitting a Line',
  2: 'Beyond One Feature',
};

export const LR_STEPS = [
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  { id: 2, title: 'The Model: y = wx + b', shortTitle: 'The Model', part: 1 },
  { id: 3, title: 'Measuring Error: MSE', shortTitle: 'MSE', part: 1 },
  { id: 4, title: 'Fitting with Gradient Descent', shortTitle: 'Training', part: 1 },
  { id: 5, title: 'The Normal Equation', shortTitle: 'Normal Equation', part: 2 },
  { id: 6, title: 'Multiple Features', shortTitle: 'Multiple Features', part: 2 },
  { id: 7, title: 'Evaluating & Overfitting', shortTitle: 'Evaluation', part: 2 },
];
