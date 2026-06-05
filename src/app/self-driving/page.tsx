'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { SDC_STEPS, SDC_TOTAL_STEPS, SDC_PART_NAMES } from '@/lib/self-drivingStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/self-drivingProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: SDC_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/self-driving-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= SDC_TOTAL_STEPS) import(`@/app/self-driving-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/self-driving',
  courseName: 'Self-Driving Cars',
  courseSubtitle: 'How Autonomous Vehicles Sense, Think, and Drive',
  certificateDescription:
    `Congratulations! You've completed all ${SDC_TOTAL_STEPS} modules, covering the full autonomy stack — ` +
    'sensors, perception, sensor fusion, localization, path planning, and closed-loop control.',
  certificateCanvasLines: [
    `has successfully completed all ${SDC_TOTAL_STEPS} modules of the Self-Driving Cars course,`,
    'demonstrating mastery of autonomous vehicle perception, sensor fusion, path planning,',
    'and PID-based closed-loop control from first principles.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-SDC',
  steps: SDC_STEPS,
  totalSteps: SDC_TOTAL_STEPS,
  partNames: SDC_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function SelfDrivingPage() {
  return <CourseShell config={config} />;
}
