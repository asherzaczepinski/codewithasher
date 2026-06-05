'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { MLF_STEPS, MLF_TOTAL_STEPS, MLF_PART_NAMES } from '@/lib/ml-foundationsStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/ml-foundationsProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: MLF_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/ml-foundations-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= MLF_TOTAL_STEPS) import(`@/app/ml-foundations-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/ml-foundations',
  courseName: 'ML Foundations',
  courseSubtitle: 'How Machine Learning Really Works',
  certificateDescription:
    `Congratulations! You've completed all ${MLF_TOTAL_STEPS} modules, covering what machine learning ` +
    'is, how to frame a problem, datasets and features, data splits, exploratory analysis, ' +
    'feature preprocessing, and the end-to-end ML workflow with industry-standard tools.',
  certificateCanvasLines: [
    `has successfully completed all ${MLF_TOTAL_STEPS} modules of the ML Foundations course,`,
    'demonstrating understanding of the ML workflow, data preparation, feature engineering,',
    'and the principles of supervised and unsupervised machine learning.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-MLF',
  steps: MLF_STEPS,
  totalSteps: MLF_TOTAL_STEPS,
  partNames: MLF_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function MLFoundationsPage() {
  return <CourseShell config={config} />;
}
