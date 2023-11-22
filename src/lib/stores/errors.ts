import { writable } from "svelte/store";
export const NO_COINS_SELECTED = "no coins selected!";
export const NO_COINS_INPUT = "put some coins in the worktop first";
export const NO_ACCOUNT = "specify an account first";
export const INVALID_ACCOUNT = "invalid account!";
export const NO_FUNGIBLES = "put some fungible coins in the worktop first";
export const INVALID_QUANTITY = "invalid quantity!";
export const NO_QUANTITY = "specify quantity first";
export const NOT_ENOUGH_COINS_IN_WORKTOP = "not enough coins in the worktop!";

export const actionError = writable("");

export function isValidQuantity(quantity: string): boolean {
  return /^[0-9]+(\.[0-9]+)?$/.test(quantity);
}

export function isValidAccount(account: string): boolean {
  return /^account_rdx1[0-9a-z]{54}$/.test(account);
}
