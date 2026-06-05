'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { TNN_STEPS, TNN_TOTAL_STEPS, TNN_PART_NAMES } from '@/lib/training-neural-networksStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/training-neural-networksProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: TNN_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/training-neural-networks-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= TNN_TOTAL_STEPS) import(`@/app/training-neural-networks-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/training-neural-networks',
  courseName: 'Training Neural Networks',
  courseSubtitle: 'Making Deep Networks Actually Learn',
  certificateDescription:
    `Congratulations! You've completed all ${TNN_TOTAL_STEPS} modules, covering activation functions, ` +
    'deep backpropagation, weight initialization, vanishing and exploding gradients, residual connections, ' +
    'dropout, and batch and layer normalization.',
  certificateCanvasLines: [
    `has successfully completed all ${TNN_TOTAL_STEPS} modules of the Training Neural Networks course,`,
    'demonstrating mastery of activation functions, gradient flow, weight initialization,',
    'residual connections, dropout, and normalization techniques for reliable deep learning.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-TNN',
  steps: TNN_STEPS,
  totalSteps: TNN_TOTAL_STEPS,
  partNames: TNN_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function TrainingNeuralNetworks() {
  return <CourseShell config={config} />;
}
