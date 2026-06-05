export const LLME_TOTAL_STEPS = 8;

export const LLME_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Training & Alignment',
  2: 'Prompting, Serving & Eval',
};

export const LLME_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Training & Alignment
  { id: 2, title: 'Pretraining', shortTitle: 'Pretraining', part: 1 },
  { id: 3, title: 'Instruction Tuning & SFT', shortTitle: 'Fine-Tuning', part: 1 },
  { id: 4, title: 'Alignment: RLHF & Preference Optimization', shortTitle: 'RLHF', part: 1 },
  { id: 5, title: 'Parameter-Efficient Fine-Tuning: LoRA', shortTitle: 'LoRA & PEFT', part: 1 },
  // Part 2: Prompting, Serving & Eval
  { id: 6, title: 'Prompting & RAG', shortTitle: 'Prompting & RAG', part: 2 },
  { id: 7, title: 'Safety, Bias & Hallucinations', shortTitle: 'Safety', part: 2 },
  { id: 8, title: 'Evaluation, Efficiency & Serving', shortTitle: 'Eval & Serving', part: 2 },
];
