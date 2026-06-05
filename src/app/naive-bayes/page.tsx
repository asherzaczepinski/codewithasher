'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { NB_STEPS, NB_TOTAL_STEPS, NB_PART_NAMES } from '@/lib/naive-bayesStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/naive-bayesProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: NB_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/naive-bayes-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= NB_TOTAL_STEPS) import(`@/app/naive-bayes-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/naive-bayes',
  courseName: 'Naive Bayes',
  courseSubtitle: 'Classifying with Probability',
  certificateDescription:
    `Congratulations! You've completed all ${NB_TOTAL_STEPS} modules, covering Bayesian reasoning, ` +
    'conditional probability, the Naive Bayes classifier, and the practical techniques that make it robust in the real world.',
  certificateCanvasLines: [
    `has successfully completed all ${NB_TOTAL_STEPS} modules of the Naive Bayes course,`,
    'demonstrating understanding of Bayesian reasoning, conditional probability,',
    'the Naive Bayes classifier, Laplace smoothing, and log-space computation.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-NB',
  steps: NB_STEPS,
  totalSteps: NB_TOTAL_STEPS,
  partNames: NB_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function NaiveBayesPage() {
  return <CourseShell config={config} />;
}
