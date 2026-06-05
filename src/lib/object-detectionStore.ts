export const OD_TOTAL_STEPS = 8;

export const OD_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'The Building Blocks',
  2: 'YOLO',
};

export const OD_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: The Building Blocks
  { id: 2, title: 'Bounding Boxes', shortTitle: 'Boxes', part: 1 },
  { id: 3, title: 'The Naive Sliding Window', shortTitle: 'Sliding Window', part: 1 },
  { id: 4, title: 'Intersection over Union (IoU)', shortTitle: 'IoU', part: 1 },
  // Part 2: YOLO
  { id: 5, title: 'The YOLO Idea: A Grid', shortTitle: 'The Grid', part: 2 },
  { id: 6, title: 'Anchor Boxes', shortTitle: 'Anchors', part: 2 },
  { id: 7, title: 'Non-Max Suppression', shortTitle: 'NMS', part: 2 },
  { id: 8, title: 'The Full YOLO Pipeline', shortTitle: 'Full Pipeline', part: 2 },
];
