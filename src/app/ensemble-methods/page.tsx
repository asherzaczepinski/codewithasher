'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { ENS_STEPS, ENS_TOTAL_STEPS, ENS_PART_NAMES } from '@/lib/ensemble-methodsStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/ensemble-methodsProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: ENS_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/ensemble-methods-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= ENS_TOTAL_STEPS) import(`@/app/ensemble-methods-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/ensemble-methods',
  courseName: 'Ensemble Methods & Boosting',
  courseSubtitle: 'Why Many Models Beat One',
  certificateDescription:
    `Congratulations! You've completed all ${ENS_TOTAL_STEPS} modules, covering ensemble learning ` +
    'from bagging and random forests through gradient boosting, XGBoost, LightGBM, CatBoost, and stacking.',
  certificateCanvasLines: [
    `has successfully completed all ${ENS_TOTAL_STEPS} modules of the Ensemble Methods & Boosting course,`,
    'demonstrating mastery of bagging, random forests, gradient boosting, XGBoost,',
    'LightGBM, CatBoost, and model stacking techniques.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-ENS',
  steps: ENS_STEPS,
  totalSteps: ENS_TOTAL_STEPS,
  partNames: ENS_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function EnsembleMethodsPage() {
  return <CourseShell config={config} />;
}
