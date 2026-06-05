'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { SVM_STEPS, SVM_TOTAL_STEPS, SVM_PART_NAMES } from '@/lib/svmStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/svmProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: SVM_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/svm-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= SVM_TOTAL_STEPS) import(`@/app/svm-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/svm',
  courseName: 'Support Vector Machines',
  courseSubtitle: 'Finding the Widest Margin',
  certificateDescription:
    `Congratulations! You've completed all ${SVM_TOTAL_STEPS} modules, covering the SVM decision boundary, ` +
    'margin maximization, support vectors, the soft-margin trade-off, and the kernel trick for nonlinear classification.',
  certificateCanvasLines: [
    `has successfully completed all ${SVM_TOTAL_STEPS} modules of the Support Vector Machines course,`,
    'demonstrating mastery of margin maximization, support vectors, soft-margin SVMs,',
    'and kernel methods for nonlinear classification.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-SVM',
  steps: SVM_STEPS,
  totalSteps: SVM_TOTAL_STEPS,
  partNames: SVM_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function SVMPage() {
  return <CourseShell config={config} />;
}
