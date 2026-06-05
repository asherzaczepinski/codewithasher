'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { PCA_STEPS, PCA_TOTAL_STEPS, PCA_PART_NAMES } from '@/lib/pcaStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/pcaProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: PCA_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/pca-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= PCA_TOTAL_STEPS) import(`@/app/pca-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/pca',
  courseName: 'PCA & Dimensionality Reduction',
  courseSubtitle: 'Compressing Data Without Losing the Signal',
  certificateDescription:
    `Congratulations! You've completed all ${PCA_TOTAL_STEPS} modules, covering the curse of ` +
    'dimensionality, variance, covariance, eigenvectors, projection, and selecting the right number ' +
    'of principal components — all from first principles.',
  certificateCanvasLines: [
    `has successfully completed all ${PCA_TOTAL_STEPS} modules of the PCA & Dimensionality Reduction course,`,
    'demonstrating understanding of variance, covariance matrices, eigenvectors, projection,',
    'and explained variance ratio from first principles.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-PCA',
  steps: PCA_STEPS,
  totalSteps: PCA_TOTAL_STEPS,
  partNames: PCA_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function PCAPage() {
  return <CourseShell config={config} />;
}
