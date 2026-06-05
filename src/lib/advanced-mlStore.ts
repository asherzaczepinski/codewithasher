export const ADV_TOTAL_STEPS = 8;

export const ADV_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Robustness, Causality & Trust',
  2: 'Learning Paradigms & Structure',
};

export const ADV_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Robustness, Causality & Trust
  { id: 2, title: 'Kernel Methods & Structured Prediction', shortTitle: 'Kernels & Structure', part: 1 },
  { id: 3, title: 'Adversarial Examples & Robust Learning', shortTitle: 'Adversarial', part: 1 },
  { id: 4, title: 'Causal Inference', shortTitle: 'Causality', part: 1 },
  { id: 5, title: 'Fairness & Interpretability', shortTitle: 'Fairness & XAI', part: 1 },
  // Part 2: Learning Paradigms & Structure
  { id: 6, title: 'Meta-Learning & Few-Shot Learning', shortTitle: 'Meta-Learning', part: 2 },
  { id: 7, title: 'Continual, Active & Online Learning', shortTitle: 'Continual Learning', part: 2 },
  { id: 8, title: 'Graph Neural Networks & AutoML', shortTitle: 'GNNs & AutoML', part: 2 },
];
