'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { RNN_STEPS, RNN_TOTAL_STEPS, RNN_PART_NAMES } from '@/lib/rnnStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/rnnProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: RNN_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/rnn-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= RNN_TOTAL_STEPS) import(`@/app/rnn-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/rnn',
  courseName: 'RNNs & LSTMs',
  courseSubtitle: 'Neural Networks with Memory',
  certificateDescription:
    `Congratulations! You've completed all ${RNN_TOTAL_STEPS} modules, covering recurrent neural networks, ` +
    'hidden state recurrence, backpropagation through time, vanishing gradients, LSTM gates, and real-world sequence modeling applications.',
  certificateCanvasLines: [
    `has successfully completed all ${RNN_TOTAL_STEPS} modules of the RNNs & LSTMs course,`,
    'demonstrating understanding of recurrent neural networks, hidden state recurrence,',
    'LSTM gates, vanishing gradients, and sequence modeling from first principles.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-RNN',
  steps: RNN_STEPS,
  totalSteps: RNN_TOTAL_STEPS,
  partNames: RNN_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function RNNPage() {
  return <CourseShell config={config} />;
}
