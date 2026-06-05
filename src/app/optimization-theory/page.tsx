'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { OPT_STEPS, OPT_TOTAL_STEPS, OPT_PART_NAMES } from '@/lib/optimization-theoryStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/optimization-theoryProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: OPT_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/optimization-theory-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= OPT_TOTAL_STEPS) import(`@/app/optimization-theory-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/optimization-theory',
  courseName: 'Optimization & Learning Theory',
  courseSubtitle: 'How Models Train and Why They Generalize',
  certificateDescription:
    `Congratulations! You've completed all ${OPT_TOTAL_STEPS} modules, covering momentum, adaptive optimizers, ` +
    'learning-rate schedules, convexity, regularization, MLE/MAP, and statistical learning theory.',
  certificateCanvasLines: [
    `has successfully completed all ${OPT_TOTAL_STEPS} modules of the Optimization & Learning Theory course,`,
    'demonstrating mastery of modern optimizers, regularization, maximum likelihood estimation,',
    'and the statistical foundations of generalization and sample complexity.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-OPT',
  steps: OPT_STEPS,
  totalSteps: OPT_TOTAL_STEPS,
  partNames: OPT_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function OptimizationTheory() {
  return <CourseShell config={config} />;
}
