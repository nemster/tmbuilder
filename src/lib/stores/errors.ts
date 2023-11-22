import { writable } from "svelte/store";
export const NO_COINS_SELECTED = "no coins selected!";
export const NO_COINS_INPUT = "put some coins in the worktop first";
export const NO_ACCOUNT = "specify an account first";
export const INVALID_ACCOUNT = "invalid account!";
export const actionError = writable("");
