export const FE_TOTAL_STEPS = 8;

export const FE_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Transforming Features',
  2: 'Text, Time & Imbalance',
};

export const FE_STEPS = [
  // Intro
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Transforming Features
  { id: 2, title: 'Creating Features', shortTitle: 'Feature Creation', part: 1 },
  { id: 3, title: 'Encoding Categorical Variables', shortTitle: 'Encoding', part: 1 },
  { id: 4, title: 'Feature Selection', shortTitle: 'Selection', part: 1 },
  { id: 5, title: 'Feature Extraction & Dimensionality Reduction', shortTitle: 'Extraction', part: 1 },
  // Part 2: Text, Time & Imbalance
  { id: 6, title: 'Text Features', shortTitle: 'Text Features', part: 2 },
  { id: 7, title: 'Time-Based Features & Missing Values', shortTitle: 'Time & Missing', part: 2 },
  { id: 8, title: 'Handling Imbalanced Data & Augmentation', shortTitle: 'Imbalance', part: 2 },
];
