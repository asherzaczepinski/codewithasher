export const LA_TOTAL_STEPS = 8;

export const LA_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Vectors',
  2: 'Matrices',
};

export const LA_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Vectors
  { id: 2, title: 'What Is a Vector?', shortTitle: 'Vectors', part: 1 },
  { id: 3, title: 'Vector Operations', shortTitle: 'Operations', part: 1 },
  { id: 4, title: 'The Dot Product', shortTitle: 'Dot Product', part: 1 },
  // Part 2: Matrices
  { id: 5, title: 'What Is a Matrix?', shortTitle: 'Matrices', part: 2 },
  { id: 6, title: 'Matrix Multiplication', shortTitle: 'Matrix Mult', part: 2 },
  { id: 7, title: 'Identity, Transpose & Inverse', shortTitle: 'Special Matrices', part: 2 },
  { id: 8, title: 'Eigenvectors & Why ML Cares', shortTitle: 'Eigenvectors', part: 2 },
];
