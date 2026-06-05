export const RLA_TOTAL_STEPS = 7;

export const RLA_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Value-Based Methods',
  2: 'Policy-Based & Beyond',
};

export const RLA_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Value-Based Methods
  { id: 2, title: 'MDPs & Dynamic Programming', shortTitle: 'MDPs & DP', part: 1 },
  { id: 3, title: 'TD Learning: SARSA vs Q-Learning', shortTitle: 'TD Learning', part: 1 },
  // Part 2: Policy-Based & Beyond
  { id: 4, title: 'Policy Gradients', shortTitle: 'Policy Gradients', part: 2 },
  { id: 5, title: 'Actor-Critic Methods', shortTitle: 'Actor-Critic', part: 2 },
  { id: 6, title: 'Deep RL & Bandits', shortTitle: 'Deep RL', part: 2 },
  { id: 7, title: 'Imitation, Offline & Multi-Agent RL', shortTitle: 'Frontiers', part: 2 },
];
