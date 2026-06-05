'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { LOG_STEPS, LOG_TOTAL_STEPS } from '@/lib/logistic-regressionStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/logistic-regressionProgress';

const LOG_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'From Scores to Probabilities',
  2: 'Training',
};

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: LOG_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/logistic-regression-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= LOG_TOTAL_STEPS) import(`@/app/logistic-regression-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/logistic-regression',
  courseName: 'Logistic Regression',
  courseSubtitle: 'Classifying with Probabilities',
  certificateDescription:
    `Congratulations! You've completed all ${LOG_TOTAL_STEPS} modules, covering logistic regression, ` +
    'the sigmoid function, decision boundaries, cross-entropy loss, gradient descent, and softmax for multiclass classification.',
  certificateCanvasLines: [
    `has successfully completed all ${LOG_TOTAL_STEPS} modules of the Logistic Regression course,`,
    'demonstrating mastery of sigmoid activation, decision boundaries, cross-entropy loss,',
    'gradient descent training, and softmax multiclass classification.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-LOG',
  steps: LOG_STEPS,
  totalSteps: LOG_TOTAL_STEPS,
  partNames: LOG_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function LogisticRegressionPage() {
  return <CourseShell config={config} />;
}
