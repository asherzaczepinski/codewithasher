'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { LLME_STEPS, LLME_TOTAL_STEPS, LLME_PART_NAMES } from '@/lib/llm-engineeringStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/llm-engineeringProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: LLME_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/llm-engineering-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= LLME_TOTAL_STEPS) import(`@/app/llm-engineering-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/llm-engineering',
  courseName: 'LLM Engineering',
  courseSubtitle: 'Training, Aligning, and Deploying LLMs',
  certificateDescription:
    `Congratulations! You've completed all ${LLME_TOTAL_STEPS} modules, covering LLM pretraining, ` +
    'instruction tuning, RLHF, LoRA fine-tuning, prompting, RAG, safety, evaluation, and production serving.',
  certificateCanvasLines: [
    `has successfully completed all ${LLME_TOTAL_STEPS} modules of the LLM Engineering course,`,
    'demonstrating mastery of pretraining, alignment, parameter-efficient fine-tuning,',
    'prompting, retrieval-augmented generation, safety, evaluation, and LLM serving.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-LLME',
  steps: LLME_STEPS,
  totalSteps: LLME_TOTAL_STEPS,
  partNames: LLME_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function LLMEngineering() {
  return <CourseShell config={config} />;
}
