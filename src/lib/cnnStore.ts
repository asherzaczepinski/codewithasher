export const CNN_TOTAL_STEPS = 8;

export const CNN_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Images as Data',
  2: 'The Convolution',
};

export const CNN_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Images as Data
  { id: 2, title: 'Images as Numbers', shortTitle: 'Pixels', part: 1 },
  { id: 3, title: 'Why Not a Regular Net?', shortTitle: 'Why CNNs', part: 1 },
  // Part 2: The Convolution
  { id: 4, title: 'The Convolution Operation', shortTitle: 'Convolution', part: 2 },
  { id: 5, title: 'Filters Detect Features', shortTitle: 'Filters', part: 2 },
  { id: 6, title: 'Feature Maps, Stride & Padding', shortTitle: 'Feature Maps', part: 2 },
  { id: 7, title: 'Pooling', shortTitle: 'Pooling', part: 2 },
  { id: 8, title: 'The Full CNN', shortTitle: 'Architecture', part: 2 },
];
