export const SYS_TOTAL_STEPS = 8;

export const SYS_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'ML Application Domains',
  2: 'ML Systems & MLOps',
};

export const SYS_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: ML Application Domains
  { id: 2, title: 'Domains: Vision, NLP, Speech & Audio', shortTitle: 'Vision & NLP', part: 1 },
  { id: 3, title: 'Domains: Time Series, Recommenders & Ranking', shortTitle: 'Time Series & RecSys', part: 1 },
  { id: 4, title: 'Domains: Industry Applications', shortTitle: 'Industry', part: 1 },
  // Part 2: ML Systems & MLOps
  { id: 5, title: 'Data & Training Pipelines', shortTitle: 'Pipelines', part: 2 },
  { id: 6, title: 'Deployment & Inference', shortTitle: 'Deployment', part: 2 },
  { id: 7, title: 'Monitoring, Drift & A/B Testing', shortTitle: 'Monitoring', part: 2 },
  { id: 8, title: 'Governance, Security & Privacy', shortTitle: 'Governance', part: 2 },
];
