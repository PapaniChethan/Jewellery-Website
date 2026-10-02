import { useSyncExternalStore } from 'react';

/**
 * introState
 * -------------------------------------------------------------------------
 * Tiny shared flag for "the brand intro has finished (or was skipped)", so
 * the homepage hero can hold its entrance until the Loader overlay lifts
 * instead of playing it unseen underneath.
 */
let done = false;
const listeners = new Set();

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((fn) => fn());
}

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export function useIntroDone() {
  return useSyncExternalStore(subscribe, () => done, () => done);
}
