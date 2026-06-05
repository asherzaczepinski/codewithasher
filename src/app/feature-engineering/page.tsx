'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { FE_STEPS, FE_TOTAL_STEPS, FE_PART_NAMES } from '@/lib/feature-engineeringStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/feature-engineeringProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: FE_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/feature-engineering-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= FE_TOTAL_STEPS) import(`@/app/feature-engineering-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/feature-engineering',
  courseName: 'Feature Engineering',
  courseSubtitle: 'Turning Raw Data into Signal',
  certificateDescription:
    `Congratulations! You've completed all ${FE_TOTAL_STEPS} modules, covering feature creation, ` +
    'categorical encoding, feature selection, dimensionality reduction, text and time-series features, ' +
    'and handling class imbalance — the full toolkit for turning raw data into signal.',
  certificateCanvasLines: [
    `has successfully completed all ${FE_TOTAL_STEPS} modules of the Feature Engineering course,`,
    'demonstrating mastery of feature creation, encoding, selection, extraction,',
    'text and time-series features, and imbalanced-data techniques.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-FE',
  steps: FE_STEPS,
  totalSteps: FE_TOTAL_STEPS,
  partNames: FE_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function FeatureEngineering() {
  return <CourseShell config={config} />;
}
