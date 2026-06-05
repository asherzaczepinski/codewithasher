'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { EVAL_STEPS, EVAL_TOTAL_STEPS, EVAL_PART_NAMES } from '@/lib/model-evaluationStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/model-evaluationProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: EVAL_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/model-evaluation-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= EVAL_TOTAL_STEPS) import(`@/app/model-evaluation-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/model-evaluation',
  courseName: 'Model Evaluation',
  courseSubtitle: 'Measuring What Actually Matters',
  certificateDescription:
    `Congratulations! You've completed all ${EVAL_TOTAL_STEPS} modules, covering regression and classification metrics, ` +
    'confusion matrices, ROC curves, cross-validation, bias-variance tradeoff, and probability calibration.',
  certificateCanvasLines: [
    `has successfully completed all ${EVAL_TOTAL_STEPS} modules of the Model Evaluation course,`,
    'demonstrating mastery of loss functions, classification metrics, ROC & AUC,',
    'cross-validation, bias-variance tradeoff, and calibration techniques.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-EVAL',
  steps: EVAL_STEPS,
  totalSteps: EVAL_TOTAL_STEPS,
  partNames: EVAL_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function ModelEvaluationPage() {
  return <CourseShell config={config} />;
}
