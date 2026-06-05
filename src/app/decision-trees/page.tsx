'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { DT_STEPS, DT_TOTAL_STEPS, DT_PART_NAMES } from '@/lib/decision-treesStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/decision-treesProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: DT_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/decision-trees-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= DT_TOTAL_STEPS) import(`@/app/decision-trees-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/decision-trees',
  courseName: 'Decision Trees & Forests',
  courseSubtitle: 'Learning with Yes/No Questions',
  certificateDescription:
    `Congratulations! You've completed all ${DT_TOTAL_STEPS} modules, covering decision tree construction, ` +
    'impurity measures, information gain, overfitting, pruning, and random forest ensembles.',
  certificateCanvasLines: [
    `has successfully completed all ${DT_TOTAL_STEPS} modules of the Decision Trees & Forests course,`,
    'demonstrating understanding of tree construction, Gini impurity, entropy, information gain,',
    'overfitting, pruning, and random forest ensemble methods.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-DT',
  steps: DT_STEPS,
  totalSteps: DT_TOTAL_STEPS,
  partNames: DT_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function DecisionTreesPage() {
  return <CourseShell config={config} />;
}
