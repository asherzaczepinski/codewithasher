export const KNN_TOTAL_STEPS = 6;

export const KNN_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'How It Works',
  2: 'Using It Well',
};

export const KNN_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: How It Works
  { id: 2, title: 'Distance Metrics', shortTitle: 'Distance', part: 1 },
  { id: 3, title: 'Classifying by Vote', shortTitle: 'Voting', part: 1 },
  // Part 2: Using It Well
  { id: 4, title: 'Choosing k', shortTitle: 'Choosing k', part: 2 },
  { id: 5, title: 'KNN for Regression', shortTitle: 'Regression', part: 2 },
  { id: 6, title: 'Scaling & the Curse of Dimensionality', shortTitle: 'Pitfalls', part: 2 },
];
