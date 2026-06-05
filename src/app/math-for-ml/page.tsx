'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { MATH_STEPS, MATH_TOTAL_STEPS, MATH_PART_NAMES } from '@/lib/math-for-mlStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/math-for-mlProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: MATH_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/math-for-ml-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= MATH_TOTAL_STEPS) import(`@/app/math-for-ml-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/math-for-ml',
  courseName: 'Math for Machine Learning',
  courseSubtitle: 'The Essential Math, From Functions to Optimization',
  certificateDescription:
    `Congratulations! You've completed all ${MATH_TOTAL_STEPS} modules, covering algebra and functions, ` +
    'exponentials, logarithms, derivatives, integrals, and convexity — the essential mathematical ' +
    'toolkit that underpins every machine learning algorithm.',
  certificateCanvasLines: [
    `has successfully completed all ${MATH_TOTAL_STEPS} modules of the Math for Machine Learning course,`,
    'demonstrating mastery of functions, exponentials, logarithms, derivatives,',
    'integrals, and convexity as applied to machine learning.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-MATH',
  steps: MATH_STEPS,
  totalSteps: MATH_TOTAL_STEPS,
  partNames: MATH_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function MathForMLPage() {
  return <CourseShell config={config} />;
}
