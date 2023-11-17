import { writable } from "svelte/store";

function createBucketNumber() {
  const { subscribe, set, update } = writable(1);

  return {
    subscribe,
    increment: () => update((n) => n + 1),
    decrement: () => update((n) => n - 1),
    reset: () => set(0),
  };
}
export const bucketNumber = createBucketNumber();

function createProofNumber() {
  const { subscribe, set, update } = writable(1);

  return {
    subscribe,
    increment: () => update((n) => n + 1),
    decrement: () => update((n) => n - 1),
    reset: () => set(0),
  };
}
export const proofNumber = createProofNumber();

export const manifest = writable("");
