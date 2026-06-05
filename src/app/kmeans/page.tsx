'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { KM_STEPS, KM_TOTAL_STEPS, KM_PART_NAMES } from '@/lib/kmeansStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/kmeansProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: KM_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/kmeans-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= KM_TOTAL_STEPS) import(`@/app/kmeans-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/kmeans',
  courseName: 'K-Means Clustering',
  courseSubtitle: 'Finding Groups in Unlabeled Data',
  certificateDescription:
    `Congratulations! You've completed all ${KM_TOTAL_STEPS} modules, covering unsupervised learning, ` +
    'centroids, Euclidean distance, the assign-and-update algorithm, convergence, and how to choose k.',
  certificateCanvasLines: [
    `has successfully completed all ${KM_TOTAL_STEPS} modules of the K-Means Clustering course,`,
    'demonstrating understanding of unsupervised learning, centroid-based clustering,',
    'the assign-update loop, convergence, and hyperparameter selection.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-KM',
  steps: KM_STEPS,
  totalSteps: KM_TOTAL_STEPS,
  partNames: KM_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function KMeansPage() {
  return <CourseShell config={config} />;
}
