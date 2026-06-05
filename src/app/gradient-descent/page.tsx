'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { GD_STEPS, GD_TOTAL_STEPS, GD_PART_NAMES } from '@/lib/gradient-descentStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/gradient-descentProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: GD_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/gradient-descent-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= GD_TOTAL_STEPS) import(`@/app/gradient-descent-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/gradient-descent',
  courseName: 'Gradient Descent',
  courseSubtitle: 'How Models Learn',
  certificateDescription:
    `Congratulations! You've completed all ${GD_TOTAL_STEPS} modules, covering cost functions, ` +
    'the gradient descent update rule, learning rate tuning, stochastic and mini-batch variants, ' +
    'and modern optimizers including momentum and Adam.',
  certificateCanvasLines: [
    `has successfully completed all ${GD_TOTAL_STEPS} modules of the Gradient Descent course,`,
    'demonstrating mastery of cost functions, the update rule, learning rate selection,',
    'stochastic gradient descent, and adaptive optimizers including momentum and Adam.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-GD',
  steps: GD_STEPS,
  totalSteps: GD_TOTAL_STEPS,
  partNames: GD_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function GradientDescentPage() {
  return <CourseShell config={config} />;
}
