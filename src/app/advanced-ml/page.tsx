'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { ADV_STEPS, ADV_TOTAL_STEPS, ADV_PART_NAMES } from '@/lib/advanced-mlStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/advanced-mlProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: ADV_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/advanced-ml-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= ADV_TOTAL_STEPS) import(`@/app/advanced-ml-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/advanced-ml',
  courseName: 'Advanced ML Topics',
  courseSubtitle: 'The Frontier: Robustness, Causality, and Beyond',
  certificateDescription:
    `Congratulations! You've completed all ${ADV_TOTAL_STEPS} modules, covering kernel methods, ` +
    'adversarial robustness, causal inference, fairness, interpretability, meta-learning, continual learning, ' +
    'graph neural networks, and AutoML — the frontier of modern machine learning research.',
  certificateCanvasLines: [
    `has successfully completed all ${ADV_TOTAL_STEPS} modules of the Advanced ML Topics course,`,
    'demonstrating mastery of robustness, causality, fairness, meta-learning,',
    'graph neural networks, and the cutting edge of machine learning research.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-ADV',
  steps: ADV_STEPS,
  totalSteps: ADV_TOTAL_STEPS,
  partNames: ADV_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function AdvancedMLPage() {
  return <CourseShell config={config} />;
}
