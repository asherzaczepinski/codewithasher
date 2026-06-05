'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { AED_STEPS, AED_TOTAL_STEPS, AED_PART_NAMES } from '@/lib/autoencoders-diffusionStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/autoencoders-diffusionProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: AED_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/autoencoders-diffusion-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= AED_TOTAL_STEPS) import(`@/app/autoencoders-diffusion-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/autoencoders-diffusion',
  courseName: 'Autoencoders & Diffusion',
  courseSubtitle: 'Compressing and Generating Data',
  certificateDescription:
    `Congratulations! You've completed all ${AED_TOTAL_STEPS} modules, covering autoencoders, ` +
    'variational autoencoders, denoising autoencoders, and diffusion models from first principles.',
  certificateCanvasLines: [
    `has successfully completed all ${AED_TOTAL_STEPS} modules of the Autoencoders & Diffusion course,`,
    'demonstrating understanding of encoder-decoder architectures, variational inference,',
    'the ELBO objective, and diffusion-based generative modeling.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-AED',
  steps: AED_STEPS,
  totalSteps: AED_TOTAL_STEPS,
  partNames: AED_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function AutoencodersDiffusionPage() {
  return <CourseShell config={config} />;
}
