export const EVAL_TOTAL_STEPS = 8;

export const EVAL_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Metrics',
  2: 'Validation & Diagnosis',
};

export const EVAL_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Metrics
  { id: 2, title: 'Regression Loss Functions', shortTitle: 'Regression Loss', part: 1 },
  { id: 3, title: 'Classification Loss: Log Loss & Cross-Entropy', shortTitle: 'Cross-Entropy', part: 1 },
  { id: 4, title: 'Confusion Matrix: Accuracy, Precision, Recall, F1', shortTitle: 'Precision & Recall', part: 1 },
  { id: 5, title: 'ROC Curves & AUC', shortTitle: 'ROC & AUC', part: 1 },
  // Part 2: Validation & Diagnosis
  { id: 6, title: 'Cross-Validation', shortTitle: 'Cross-Validation', part: 2 },
  { id: 7, title: 'Bias, Variance, Over/Underfitting', shortTitle: 'Bias-Variance', part: 2 },
  { id: 8, title: 'Calibration & Error Analysis', shortTitle: 'Calibration', part: 2 },
];
