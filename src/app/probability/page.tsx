'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { PROB_STEPS, PROB_TOTAL_STEPS } from '@/lib/probabilityStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/probabilityProgress';

const PROB_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Probability',
  2: 'Statistics & Bayes',
};

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: PROB_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/probability-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= PROB_TOTAL_STEPS) import(`@/app/probability-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/probability',
  courseName: 'Probability & Statistics',
  courseSubtitle: 'Reasoning Under Uncertainty',
  certificateDescription:
    `Congratulations! You've completed all ${PROB_TOTAL_STEPS} modules, covering probability theory, ` +
    'conditional probability, random variables, statistics, the normal distribution, and Bayesian reasoning.',
  certificateCanvasLines: [
    `has successfully completed all ${PROB_TOTAL_STEPS} modules of the Probability & Statistics course,`,
    'demonstrating understanding of probability theory, conditional probability, random variables,',
    'statistical measures, the normal distribution, and Bayes\' Theorem.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-PROB',
  steps: PROB_STEPS,
  totalSteps: PROB_TOTAL_STEPS,
  partNames: PROB_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function ProbabilityPage() {
  return <CourseShell config={config} />;
}
