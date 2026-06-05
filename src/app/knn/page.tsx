'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { KNN_STEPS, KNN_TOTAL_STEPS, KNN_PART_NAMES } from '@/lib/knnStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/knnProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: KNN_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/knn-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= KNN_TOTAL_STEPS) import(`@/app/knn-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/knn',
  courseName: 'K-Nearest Neighbors',
  courseSubtitle: 'Classifying by Similarity',
  certificateDescription:
    `Congratulations! You've completed all ${KNN_TOTAL_STEPS} modules, covering the KNN algorithm, ` +
    'distance metrics, majority-vote classification, regression by averaging, choosing k, ' +
    'feature scaling, and the curse of dimensionality.',
  certificateCanvasLines: [
    `has successfully completed all ${KNN_TOTAL_STEPS} modules of the K-Nearest Neighbors course,`,
    'demonstrating understanding of distance metrics, majority-vote classification,',
    'regression by averaging, feature scaling, and the curse of dimensionality.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-KNN',
  steps: KNN_STEPS,
  totalSteps: KNN_TOTAL_STEPS,
  partNames: KNN_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function KNNPage() {
  return <CourseShell config={config} />;
}
