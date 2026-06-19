'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { LLM_STEPS, LLM_TOTAL_STEPS, LLM_PART_NAMES } from '@/lib/llmStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/llmProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: LLM_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/llm-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= LLM_TOTAL_STEPS) import(`@/app/llm-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/llms',
  courseName: 'Large Language Models',
  courseSubtitle: 'Building an LLM from the Ground Up',
  certificateDescription:
    `Congratulations! You've completed all ${LLM_TOTAL_STEPS} modules, covering tokenization, embeddings, ` +
    'attention, the transformer architecture, autoregressive text generation, and how LLMs are trained — ' +
    'from pretraining to fine-tuning and RLHF.',
  certificateCanvasLines: [
    `has successfully completed all ${LLM_TOTAL_STEPS} modules of the Large Language Models course,`,
    'demonstrating understanding of tokenization, embeddings, attention, the transformer',
    'architecture, next-token generation, and LLM training from pretraining to RLHF.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-LLM',
  steps: LLM_STEPS,
  totalSteps: LLM_TOTAL_STEPS,
  partNames: LLM_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function LLMsPage() {
  return <CourseShell config={config} />;
}
