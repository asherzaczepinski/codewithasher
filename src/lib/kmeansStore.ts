export const KM_TOTAL_STEPS = 7;

export const KM_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'The Idea',
  2: 'The Algorithm',
};

export const KM_STEPS = [
  // Intro
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: The Idea
  { id: 2, title: 'Supervised vs Unsupervised', shortTitle: 'Unsupervised', part: 1 },
  { id: 3, title: 'Centroids & Distance', shortTitle: 'Centroids', part: 1 },
  // Part 2: The Algorithm
  { id: 4, title: 'Step 1: Assignment', shortTitle: 'Assignment', part: 2 },
  { id: 5, title: 'Step 2: Update', shortTitle: 'Update', part: 2 },
  { id: 6, title: 'Putting It Together: Convergence', shortTitle: 'Convergence', part: 2 },
  { id: 7, title: 'Choosing k', shortTitle: 'Choosing k', part: 2 },
];
