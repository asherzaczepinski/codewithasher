export const RL_TOTAL_STEPS = 8;

export const RL_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'The Framework',
  2: 'Learning to Act',
};

export const RL_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: The Framework
  { id: 2, title: 'Agent, Environment, Reward', shortTitle: 'The Loop', part: 1 },
  { id: 3, title: 'States & Actions', shortTitle: 'States & Actions', part: 1 },
  { id: 4, title: 'The Policy', shortTitle: 'Policy', part: 1 },
  { id: 5, title: 'Rewards & Return', shortTitle: 'Return', part: 1 },
  // Part 2: Learning to Act
  { id: 6, title: 'Value Functions', shortTitle: 'Value', part: 2 },
  { id: 7, title: 'Q-Learning', shortTitle: 'Q-Learning', part: 2 },
  { id: 8, title: 'Exploration vs Exploitation', shortTitle: 'Exploration', part: 2 },
];
