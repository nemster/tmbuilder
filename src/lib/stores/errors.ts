import { writable, get } from "svelte/store";
import { worktop } from "./worktop";
import { XRD } from "../../content";
export const NO_COINS_SELECTED = "no coins selected!";
export const NO_COINS_ON_WORKTOP = "put some coins on the worktop first";
export const NO_ACCOUNT = "specify an account first";
export const INVALID_ACCOUNT = "invalid account!";
export const NO_FUNGIBLES_ON_WORKTOP =
  "put some fungible coins on the worktop first";
export const INVALID_QUANTITY = "invalid quantity!";
export const NO_QUANTITY = "specify quantity first";
export const NOT_ENOUGH_COINS_ON_WORKTOP = "not enough coins on the worktop!";
export const NO_XRD_ON_WORKTOP = "put some XRDs on the worktop first";
export const NOT_ENOUGH_XRD_ON_WORKTOP = "not enough XRDs on the worktop";

export const actionError = writable("");

function createValidationErrors() {
  const { subscribe, update, set } = writable<Set<string>>(new Set());

  function add(error: string) {
    update((errors) => {
      errors.add(error);
      return errors;
    });
  }

  function clear() {
    set(new Set());
  }

  function del(error: string) {
    update((errors) => {
      errors.delete(error);
      return errors;
    });
  }

  return {
    subscribe,
    add,
    del,
    clear,
  };
}
export const validationErrors = createValidationErrors();

export function isValidQuantity(quantity: string): boolean {
  return /^[0-9]+(\.[0-9]+)?$/.test(quantity);
}

export function isValidAccount(account: string): boolean {
  return /^account_rdx1[0-9a-z]{54}$/.test(account);
}

export function validateAccount(account: string) {
  if (account !== "" && !isValidAccount(account)) {
    validationErrors.add(INVALID_ACCOUNT);
  } else if (get(validationErrors).has(INVALID_ACCOUNT)) {
    validationErrors.del(INVALID_ACCOUNT);
  }
}

export function validateMultipleAccounts(accountAddresses: string[]) {
  // if any account addresses is not valid set the error
  const invalidAddress = accountAddresses.find(
    (a) => a !== "" && !isValidAccount(a)
  );

  if (invalidAddress) {
    validationErrors.add(INVALID_ACCOUNT);
  } else if (get(validationErrors).has(INVALID_ACCOUNT)) {
    validationErrors.del(INVALID_ACCOUNT);
  }
}

export function validateQuantity(quantity: string) {
  if (quantity !== "" && !isValidQuantity(quantity)) {
    validationErrors.add(INVALID_QUANTITY);
  } else if (get(validationErrors).has(INVALID_QUANTITY)) {
    validationErrors.del(INVALID_QUANTITY);
  }
}

export function validateAvailableXRD(atLeast = 90) {
  const availableXRDs = get(worktop).fungibles.get(XRD);
  if (!availableXRDs || availableXRDs.amount < atLeast) {
    validationErrors.add(NOT_ENOUGH_XRD_ON_WORKTOP);
  } else if (get(validationErrors).has(NOT_ENOUGH_XRD_ON_WORKTOP)) {
    validationErrors.del(NOT_ENOUGH_XRD_ON_WORKTOP);
  }
}

export function validateAvailableFungibles() {
  const availableFungibles = get(worktop).fungibles;
  if (availableFungibles.size === 0) {
    validationErrors.add(NO_FUNGIBLES_ON_WORKTOP);
  } else if (get(validationErrors).has(NO_FUNGIBLES_ON_WORKTOP)) {
    validationErrors.del(NO_FUNGIBLES_ON_WORKTOP);
  }
}

export function validateAvailableCoins() {
  const availableNonFugibles = get(worktop).nonFungibles;
  const availableFungibles = get(worktop).fungibles;

  if (availableNonFugibles.size === 0 && availableFungibles.size === 0) {
    validationErrors.add(NO_COINS_ON_WORKTOP);
  } else if (get(validationErrors).has(NO_COINS_ON_WORKTOP)) {
    validationErrors.del(NO_COINS_ON_WORKTOP);
  }
}
