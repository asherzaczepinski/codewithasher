'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { LA_STEPS, LA_TOTAL_STEPS, LA_PART_NAMES } from '@/lib/linear-algebraStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/linear-algebraProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: LA_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/linear-algebra-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= LA_TOTAL_STEPS) import(`@/app/linear-algebra-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/linear-algebra',
  courseName: 'Linear Algebra',
  courseSubtitle: 'The Language of Machine Learning',
  certificateDescription:
    `Congratulations! You've completed all ${LA_TOTAL_STEPS} modules, covering vectors, matrices, ` +
    'dot products, matrix multiplication, and eigenvectors — the mathematical foundation that powers every modern ML system.',
  certificateCanvasLines: [
    `has successfully completed all ${LA_TOTAL_STEPS} modules of the Linear Algebra course,`,
    'demonstrating mastery of vectors, matrices, dot products, matrix multiplication,',
    'and eigenvectors as they apply to machine learning systems.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-LA',
  steps: LA_STEPS,
  totalSteps: LA_TOTAL_STEPS,
  partNames: LA_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function LinearAlgebraPage() {
  return <CourseShell config={config} />;
}
