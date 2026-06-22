export const PCA_TOTAL_STEPS = 14;

export const PCA_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'The Problem',
  2: 'Measuring Spread',
  3: 'The Method',
  4: 'Using PCA',
};

export const PCA_STEPS = [
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  { id: 2, title: 'The Shape of Correlated Data', shortTitle: 'Correlation', part: 0 },
  { id: 3, title: 'The Curse of Dimensionality', shortTitle: 'Curse', part: 1 },
  { id: 4, title: 'Variance = Information', shortTitle: 'Variance', part: 2 },
  { id: 5, title: 'Variance Along Any Direction', shortTitle: 'Directions', part: 2 },
  { id: 6, title: 'Covariance', shortTitle: 'Covariance', part: 2 },
  { id: 7, title: 'The Covariance Matrix', shortTitle: 'Cov Matrix', part: 2 },
  { id: 8, title: 'Principal Components = Eigenvectors', shortTitle: 'Components', part: 3 },
  { id: 9, title: 'Finding Eigenvectors by Hand', shortTitle: 'Eigen by Hand', part: 3 },
  { id: 10, title: 'Projecting the Data', shortTitle: 'Projection', part: 3 },
  { id: 11, title: 'Reconstruction & What We Lose', shortTitle: 'Reconstruction', part: 3 },
  { id: 12, title: 'Choosing How Many Components', shortTitle: 'How Many', part: 4 },
  { id: 13, title: 'The Full PCA Pipeline', shortTitle: 'Pipeline', part: 4 },
  { id: 14, title: 'PCA in the Real World', shortTitle: 'Real World', part: 4 },
];
