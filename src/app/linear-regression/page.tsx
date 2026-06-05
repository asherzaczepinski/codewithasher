'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { LR_STEPS, LR_TOTAL_STEPS, LR_PART_NAMES } from '@/lib/linear-regressionStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/linear-regressionProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: LR_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/linear-regression-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= LR_TOTAL_STEPS) import(`@/app/linear-regression-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/linear-regression',
  courseName: 'Linear Regression',
  courseSubtitle: 'Predicting Numbers from Data',
  certificateDescription:
    `Congratulations! You've completed all ${LR_TOTAL_STEPS} modules, covering the linear model, ` +
    'mean squared error, gradient descent, the normal equation, multiple features, and model evaluation.',
  certificateCanvasLines: [
    `has successfully completed all ${LR_TOTAL_STEPS} modules of the Linear Regression course,`,
    'demonstrating mastery of the linear model, MSE, gradient descent, the normal equation,',
    'multiple features, R², train/test splitting, and regularization concepts.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-LR',
  steps: LR_STEPS,
  totalSteps: LR_TOTAL_STEPS,
  partNames: LR_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function LinearRegressionPage() {
  return <CourseShell config={config} />;
}
