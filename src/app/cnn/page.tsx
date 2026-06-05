'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { CNN_STEPS, CNN_TOTAL_STEPS } from '@/lib/cnnStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/cnnProgress';

const CNN_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Images as Data',
  2: 'The Convolution',
};

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: CNN_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/cnn-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= CNN_TOTAL_STEPS) import(`@/app/cnn-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/cnn',
  courseName: 'Convolutional Neural Networks',
  courseSubtitle: 'How Machines See Images',
  certificateDescription:
    `Congratulations! You've completed all ${CNN_TOTAL_STEPS} modules, covering how images are represented as data, ` +
    'the convolution operation, filter learning, feature maps, pooling, and the full CNN architecture used in modern image recognition.',
  certificateCanvasLines: [
    `has successfully completed all ${CNN_TOTAL_STEPS} modules of the Convolutional Neural Networks course,`,
    'demonstrating understanding of convolution, learned filters, feature maps, pooling,',
    'and end-to-end CNN architecture for image classification.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-CNN',
  steps: CNN_STEPS,
  totalSteps: CNN_TOTAL_STEPS,
  partNames: CNN_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function CNNPage() {
  return <CourseShell config={config} />;
}
