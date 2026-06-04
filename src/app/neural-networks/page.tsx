'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { STEPS, TOTAL_STEPS } from '@/lib/store';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/progress';

const PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'The Neuron',
  2: 'Building the Network',
};

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= TOTAL_STEPS) import(`@/app/steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/neural-networks',
  courseName: 'Neural Networks',
  courseSubtitle: 'Building Neural Networks from Scratch',
  certificateDescription:
    `Congratulations! You've completed all ${TOTAL_STEPS} modules, covering neural network ` +
    'architecture, forward propagation, backpropagation, gradient descent, and training from first principles.',
  certificateCanvasLines: [
    `has successfully completed all ${TOTAL_STEPS} modules of the Neural Networks course,`,
    'demonstrating understanding of neural network architecture, forward propagation,',
    'backpropagation, gradient descent, and training from first principles.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-NN',
  steps: STEPS,
  totalSteps: TOTAL_STEPS,
  partNames: PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function NeuralNetworksPage() {
  return <CourseShell config={config} />;
}
