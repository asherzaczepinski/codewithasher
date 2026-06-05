'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { PML_STEPS, PML_TOTAL_STEPS, PML_PART_NAMES } from '@/lib/probabilistic-mlStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/probabilistic-mlProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: PML_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/probabilistic-ml-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= PML_TOTAL_STEPS) import(`@/app/probabilistic-ml-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/probabilistic-ml',
  courseName: 'Probabilistic ML',
  courseSubtitle: 'Modeling Uncertainty and Hidden Structure',
  certificateDescription:
    `Congratulations! You've completed all ${PML_TOTAL_STEPS} modules, covering probabilistic graphical models, ` +
    'Bayesian networks, hidden Markov models, Bayesian inference, MCMC sampling, and variational inference from first principles.',
  certificateCanvasLines: [
    `has successfully completed all ${PML_TOTAL_STEPS} modules of the Probabilistic ML course,`,
    'demonstrating mastery of graphical models, Bayesian inference, MCMC sampling,',
    'variational inference, and principled uncertainty estimation in machine learning.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-PML',
  steps: PML_STEPS,
  totalSteps: PML_TOTAL_STEPS,
  partNames: PML_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function ProbabilisticML() {
  return <CourseShell config={config} />;
}
