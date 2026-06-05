export const PCA_TOTAL_STEPS = 7;

export const PCA_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'The Problem',
  2: 'The Method',
};

export const PCA_STEPS = [
  // Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // The Problem
  { id: 2, title: 'The Curse of Dimensionality', shortTitle: 'Curse', part: 1 },
  { id: 3, title: 'Variance = Information', shortTitle: 'Variance', part: 1 },
  { id: 4, title: 'Covariance', shortTitle: 'Covariance', part: 1 },
  // The Method
  { id: 5, title: 'Principal Components = Eigenvectors', shortTitle: 'Components', part: 2 },
  { id: 6, title: 'Projecting the Data', shortTitle: 'Projection', part: 2 },
  { id: 7, title: 'Choosing How Many Components', shortTitle: 'How Many', part: 2 },
];
