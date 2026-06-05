import { TNN_TOTAL_STEPS } from './training-neural-networksStore';

const STORAGE_KEY = 'training-neural-networks-progress';

export function getCompletedSteps(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

export function markStepComplete(step: number): void {
  const completed = getCompletedSteps();
  completed.add(step);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
}

export function markStepIncomplete(step: number): void {
  const completed = getCompletedSteps();
  completed.delete(step);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
}

export function getProgressPercent(): number {
  const completed = getCompletedSteps();
  return Math.round((completed.size / TNN_TOTAL_STEPS) * 100);
}
