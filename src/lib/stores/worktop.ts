import { writable } from "svelte/store";

export const fungibles = writable(new Map<string, number>());
export const nonFungibles = writable([]);
