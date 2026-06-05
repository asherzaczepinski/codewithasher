export const DT_TOTAL_STEPS = 7;

export const DT_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Growing a Tree',
  2: 'From Trees to Forests',
};

export const DT_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Growing a Tree
  { id: 2, title: 'Splitting Data with Questions', shortTitle: 'Splits', part: 1 },
  { id: 3, title: 'Measuring Purity: Gini & Entropy', shortTitle: 'Purity', part: 1 },
  { id: 4, title: 'Information Gain', shortTitle: 'Info Gain', part: 1 },
  { id: 5, title: 'Building the Tree', shortTitle: 'Building', part: 1 },
  // Part 2: From Trees to Forests
  { id: 6, title: 'Overfitting & Pruning', shortTitle: 'Overfitting', part: 2 },
  { id: 7, title: 'Random Forests', shortTitle: 'Forests', part: 2 },
];
