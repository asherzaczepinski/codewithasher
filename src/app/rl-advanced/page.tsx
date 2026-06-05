'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { RLA_STEPS, RLA_TOTAL_STEPS } from '@/lib/rl-advancedStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/rl-advancedProgress';

const RLA_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Value-Based Methods',
  2: 'Policy-Based & Beyond',
};

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: RLA_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/rl-advanced-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= RLA_TOTAL_STEPS) import(`@/app/rl-advanced-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/rl-advanced',
  courseName: 'Advanced Reinforcement Learning',
  courseSubtitle: 'Modern Methods for Learning to Act',
  certificateDescription:
    `Congratulations! You've completed all ${RLA_TOTAL_STEPS} modules, covering Markov Decision Processes, ` +
    'dynamic programming, temporal-difference learning, policy gradients, actor-critic methods, deep RL, ' +
    'and the frontiers of imitation, offline, and multi-agent reinforcement learning.',
  certificateCanvasLines: [
    `has successfully completed all ${RLA_TOTAL_STEPS} modules of the Advanced Reinforcement Learning course,`,
    'demonstrating mastery of MDPs, TD learning, policy gradients, actor-critic methods,',
    'deep RL with function approximation, and modern frontiers of the field.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-RLA',
  steps: RLA_STEPS,
  totalSteps: RLA_TOTAL_STEPS,
  partNames: RLA_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function AdvancedRL() {
  return <CourseShell config={config} />;
}
