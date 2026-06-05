export const GAN_TOTAL_STEPS = 6;

export const GAN_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'The Two Networks',
  2: 'Training & Reality',
};

export const GAN_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: The Two Networks
  { id: 2, title: 'Generator & Discriminator', shortTitle: 'The Players', part: 1 },
  { id: 3, title: 'The Adversarial Game', shortTitle: 'The Game', part: 1 },
  // Part 2: Training & Reality
  { id: 4, title: 'The Training Loop', shortTitle: 'Training', part: 2 },
  { id: 5, title: 'When Training Goes Wrong', shortTitle: 'Failure Modes', part: 2 },
  { id: 6, title: 'Applications & Ethics', shortTitle: 'Applications', part: 2 },
];
