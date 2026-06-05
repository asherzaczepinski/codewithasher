'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { SYS_STEPS, SYS_TOTAL_STEPS, SYS_PART_NAMES } from '@/lib/applied-ml-systemsStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/applied-ml-systemsProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: SYS_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/applied-ml-systems-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= SYS_TOTAL_STEPS) import(`@/app/applied-ml-systems-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/applied-ml-systems',
  courseName: 'Applied ML & MLOps',
  courseSubtitle: 'From Notebook to Production',
  certificateDescription:
    `Congratulations! You've completed all ${SYS_TOTAL_STEPS} modules, covering ML application domains, ` +
    'data and training pipelines, deployment patterns, production monitoring, and responsible ML governance.',
  certificateCanvasLines: [
    `has successfully completed all ${SYS_TOTAL_STEPS} modules of the Applied ML & MLOps course,`,
    'demonstrating mastery of ML application domains, MLOps pipelines, deployment and inference,',
    'production monitoring, A/B testing, and ML governance from first principles.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-SYS',
  steps: SYS_STEPS,
  totalSteps: SYS_TOTAL_STEPS,
  partNames: SYS_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function AppliedMLSystems() {
  return <CourseShell config={config} />;
}
