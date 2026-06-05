'use client';

import dynamic from 'next/dynamic';
import CourseShell, { type CourseConfig } from '@/components/CourseShell';
import { OD_STEPS, OD_TOTAL_STEPS, OD_PART_NAMES } from '@/lib/object-detectionStore';
import { getCompletedSteps, markStepComplete, markStepIncomplete } from '@/lib/object-detectionProgress';

const StepFallback = () => (
  <div className="step-loader">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" />
    <div className="skeleton skeleton-text short" />
    <div className="skeleton skeleton-text" />
  </div>
);

const stepComponents = Array.from({ length: OD_TOTAL_STEPS }, (_, i) =>
  dynamic(() => import(`@/app/object-detection-steps/Step${i + 1}`), { loading: StepFallback, ssr: false })
);

const preloadStep = (stepNum: number) => {
  if (stepNum >= 1 && stepNum <= OD_TOTAL_STEPS) import(`@/app/object-detection-steps/Step${stepNum}`);
};

const config: CourseConfig = {
  basePath: '/object-detection',
  courseName: 'Object Detection & YOLO',
  courseSubtitle: 'Finding and Locating Objects in Images',
  certificateDescription:
    `Congratulations! You've completed all ${OD_TOTAL_STEPS} modules, covering bounding boxes, ` +
    'IoU, the YOLO grid, anchor boxes, non-max suppression, and the full single-shot detection pipeline.',
  certificateCanvasLines: [
    `has successfully completed all ${OD_TOTAL_STEPS} modules of the Object Detection & YOLO course,`,
    'demonstrating understanding of bounding boxes, IoU, the YOLO grid, anchor boxes,',
    'non-max suppression, and the full real-time object detection pipeline.',
  ],
  instructor: 'Asher Zaczepinski',
  credentialPrefix: 'CWA-YOLO',
  steps: OD_STEPS,
  totalSteps: OD_TOTAL_STEPS,
  partNames: OD_PART_NAMES,
  stepComponents,
  preloadStep,
  progress: { getCompletedSteps, markStepComplete, markStepIncomplete },
};

export default function ObjectDetectionPage() {
  return <CourseShell config={config} />;
}
