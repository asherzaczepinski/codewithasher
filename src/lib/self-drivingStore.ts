export const SDC_TOTAL_STEPS = 8;

export const SDC_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Perception',
  2: 'Decision & Control',
};

export const SDC_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  { id: 2, title: 'Levels of Autonomy', shortTitle: 'Levels', part: 0 },
  // Part 1: Perception
  { id: 3, title: 'Sensors', shortTitle: 'Sensors', part: 1 },
  { id: 4, title: 'Perception', shortTitle: 'Perception', part: 1 },
  { id: 5, title: 'Sensor Fusion', shortTitle: 'Sensor Fusion', part: 1 },
  // Part 2: Decision & Control
  { id: 6, title: 'Localization & Mapping', shortTitle: 'Localization', part: 2 },
  { id: 7, title: 'Path Planning', shortTitle: 'Planning', part: 2 },
  { id: 8, title: 'Control', shortTitle: 'Control', part: 2 },
];
