'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { TF_STEPS, TF_TOTAL_STEPS, TF_PART_NAMES } from '@/lib/transformersStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/transformersProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: TF_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/transformers-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= TF_TOTAL_STEPS) import(`@/app/transformers-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/transformers',
  courseName: 'Transformers',
  courseSubtitle: 'The Architecture Behind Modern AI',
  certificateDescription:
    `Congratulations! You've completed all ${TF_TOTAL_STEPS} modules, covering the full transformer architecture: ` +
    'tokenization, positional encoding, self-attention, multi-head attention, residual blocks, ' +
    'encoder/decoder designs, efficient attention, and scaling laws.',
  certificateCanvasLines: [
    `has successfully completed all ${TF_TOTAL_STEPS} modules of the Transformers course,`,
    'demonstrating deep understanding of self-attention, multi-head attention, transformer blocks,',
    'encoder/decoder architectures, efficient attention mechanisms, and neural scaling laws.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-TF',
  steps: TF_STEPS,
  totalSteps: TF_TOTAL_STEPS,
  partNames: TF_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function TransformersPage() {
  return <CourseShell config={config} />;
}
