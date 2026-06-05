'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { CALC_STEPS, CALC_TOTAL_STEPS, CALC_PART_NAMES } from '@/lib/calculusStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/calculusProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: CALC_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/calculus-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= CALC_TOTAL_STEPS) import(`@/app/calculus-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/calculus',
  courseName: 'Calculus for ML',
  courseSubtitle: 'The Math Behind Learning',
  certificateDescription:
    `Congratulations! You've completed all ${CALC_TOTAL_STEPS} modules, covering functions and slope, ` +
    'derivatives, differentiation rules, the chain rule, partial derivatives, and gradients — ' +
    'the calculus that powers every machine learning algorithm.',
  certificateCanvasLines: [
    `has successfully completed all ${CALC_TOTAL_STEPS} modules of the Calculus for ML course,`,
    'demonstrating mastery of derivatives, differentiation rules, the chain rule,',
    'partial derivatives, and gradient descent from first principles.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-CALC',
  steps: CALC_STEPS,
  totalSteps: CALC_TOTAL_STEPS,
  partNames: CALC_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function CalculusPage() {
  return <CourseShell config={config} />;
}
