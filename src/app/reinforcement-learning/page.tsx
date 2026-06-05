'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { RL_STEPS, RL_TOTAL_STEPS, RL_PART_NAMES } from '@/lib/reinforcement-learningStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/reinforcement-learningProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: RL_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/reinforcement-learning-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= RL_TOTAL_STEPS) import(`@/app/reinforcement-learning-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/reinforcement-learning',
  courseName: 'Reinforcement Learning',
  courseSubtitle: 'Learning from Rewards',
  certificateDescription:
    `Congratulations! You've completed all ${RL_TOTAL_STEPS} modules, covering the full reinforcement ` +
    'learning framework: agents, environments, policies, return, value functions, Q-learning, and exploration strategies.',
  certificateCanvasLines: [
    `has successfully completed all ${RL_TOTAL_STEPS} modules of the Reinforcement Learning course,`,
    'demonstrating understanding of the RL framework, Bellman equations, Q-learning,',
    'and exploration vs exploitation strategies for training intelligent agents.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-RL',
  steps: RL_STEPS,
  totalSteps: RL_TOTAL_STEPS,
  partNames: RL_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function ReinforcementLearningPage() {
  return <CourseShell config={config} />;
}
