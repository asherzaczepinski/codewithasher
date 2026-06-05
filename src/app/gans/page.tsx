'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { GAN_STEPS, GAN_TOTAL_STEPS, GAN_PART_NAMES } from '@/lib/gansStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/gansProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: GAN_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/gans-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= GAN_TOTAL_STEPS) import(`@/app/gans-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/gans',
  courseName: 'Generative Adversarial Networks',
  courseSubtitle: 'Machines That Create',
  certificateDescription:
    `Congratulations! You've completed all ${GAN_TOTAL_STEPS} modules, covering generative vs discriminative models, ` +
    'the Generator and Discriminator architecture, the adversarial minimax game, GAN training dynamics, ' +
    'failure modes and fixes, and real-world applications and ethics.',
  certificateCanvasLines: [
    `has successfully completed all ${GAN_TOTAL_STEPS} modules of the Generative Adversarial Networks course,`,
    'demonstrating understanding of the adversarial training framework, Generator and Discriminator',
    'dynamics, GAN failure modes, and the ethical landscape of generative AI.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-GAN',
  steps: GAN_STEPS,
  totalSteps: GAN_TOTAL_STEPS,
  partNames: GAN_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function GANsPage() {
  return <CourseShell config={config} />;
}
