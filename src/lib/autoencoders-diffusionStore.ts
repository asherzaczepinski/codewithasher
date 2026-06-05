export const AED_TOTAL_STEPS = 7;

export const AED_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Autoencoders',
  2: 'Generative Models',
};

export const AED_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Autoencoders
  { id: 2, title: 'Autoencoders', shortTitle: 'Autoencoders', part: 1 },
  { id: 3, title: 'Denoising & Other Autoencoders', shortTitle: 'Denoising AE', part: 1 },
  { id: 4, title: 'Variational Autoencoders', shortTitle: 'VAEs', part: 1 },
  // Part 2: Generative Models
  { id: 5, title: 'Diffusion: The Forward Process', shortTitle: 'Diffusion Forward', part: 2 },
  { id: 6, title: 'Diffusion: Learning to Denoise', shortTitle: 'Diffusion Reverse', part: 2 },
  { id: 7, title: 'Generative Models Compared', shortTitle: 'Comparison', part: 2 },
];
