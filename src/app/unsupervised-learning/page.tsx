'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { UL_STEPS, UL_TOTAL_STEPS, UL_PART_NAMES } from '@/lib/unsupervised-learningStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/unsupervised-learningProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: UL_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/unsupervised-learning-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= UL_TOTAL_STEPS) import(`@/app/unsupervised-learning-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/unsupervised-learning',
  courseName: 'Unsupervised Learning',
  courseSubtitle: 'Finding Structure Without Labels',
  certificateDescription:
    `Congratulations! You've completed all ${UL_TOTAL_STEPS} modules, covering the full landscape of ` +
    'unsupervised learning — clustering, dimensionality reduction, anomaly detection, and association methods.',
  certificateCanvasLines: [
    `has successfully completed all ${UL_TOTAL_STEPS} modules of the Unsupervised Learning course,`,
    'demonstrating mastery of clustering, dimensionality reduction, generative models,',
    'anomaly detection, association rules, and matrix factorization.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-UL',
  steps: UL_STEPS,
  totalSteps: UL_TOTAL_STEPS,
  partNames: UL_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function UnsupervisedLearningPage() {
  return <CourseShell config={config} />;
}
