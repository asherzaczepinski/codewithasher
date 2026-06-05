import { TOTAL_STEPS } from './store';

const STORAGE_KEY = 'nn-progress';

export function getCompletedSteps(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    // Drop any stale ids left over from an earlier, longer version of the course
    // (e.g. completed step 19 when the course is now only 16 steps) so the count
    // can never exceed the real total.
    return new Set((JSON.parse(raw) as number[]).filter(n => n >= 1 && n <= TOTAL_STEPS));
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
  return Math.round((completed.size / TOTAL_STEPS) * 100);
}
