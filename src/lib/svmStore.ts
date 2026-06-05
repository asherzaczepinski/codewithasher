export const SVM_TOTAL_STEPS = 6;

export const SVM_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'The Margin',
  2: 'Going Nonlinear',
};

export const SVM_STEPS = [
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  { id: 2, title: 'Boundary & Margin', shortTitle: 'Margin', part: 1 },
  { id: 3, title: 'Support Vectors', shortTitle: 'Support Vectors', part: 1 },
  { id: 4, title: 'Maximizing the Margin', shortTitle: 'Max Margin', part: 1 },
  { id: 5, title: 'Soft Margin', shortTitle: 'Soft Margin', part: 2 },
  { id: 6, title: 'The Kernel Trick', shortTitle: 'Kernels', part: 2 },
];
