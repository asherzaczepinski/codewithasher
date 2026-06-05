export const MLF_TOTAL_STEPS = 8;

export const MLF_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Data & The Problem',
  2: 'The ML Workflow',
};

export const MLF_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  { id: 2, title: 'Types of Machine Learning', shortTitle: 'Types of ML', part: 0 },
  // Part 1: Data & The Problem
  { id: 3, title: 'Framing the Problem', shortTitle: 'Problem Framing', part: 1 },
  { id: 4, title: 'Datasets, Features & Labels', shortTitle: 'Data & Features', part: 1 },
  { id: 5, title: 'Train / Validation / Test Splits & Data Leakage', shortTitle: 'Data Splits', part: 1 },
  // Part 2: The ML Workflow
  { id: 6, title: 'Exploratory Data Analysis', shortTitle: 'EDA', part: 2 },
  { id: 7, title: 'Preparing Features', shortTitle: 'Preprocessing', part: 2 },
  { id: 8, title: 'Tools & Reproducibility', shortTitle: 'Tools & Repro', part: 2 },
];
