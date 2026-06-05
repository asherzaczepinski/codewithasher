export const RNN_TOTAL_STEPS = 7;

export const RNN_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Sequences & Memory',
  2: 'Better Memory',
};

export const RNN_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Sequences & Memory
  { id: 2, title: 'Why Sequences Need Memory', shortTitle: 'Memory', part: 1 },
  { id: 3, title: 'The Hidden State & Recurrence', shortTitle: 'Recurrence', part: 1 },
  { id: 4, title: 'Unrolling Through Time', shortTitle: 'Unrolling', part: 1 },
  { id: 5, title: 'Backprop Through Time & Vanishing Gradients', shortTitle: 'Vanishing Gradients', part: 1 },
  // Part 2: Better Memory
  { id: 6, title: 'LSTMs: Gates', shortTitle: 'LSTM', part: 2 },
  { id: 7, title: 'Applications & Beyond', shortTitle: 'Applications', part: 2 },
];
