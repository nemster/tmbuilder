import { get, writable } from "svelte/store";
import { XRD } from "../../content";
import PrecisionNumber from "../PrecisionNumber";
import { UNKNOWN_QUANTITY } from "./accounts";
import type { WalletFungible } from "./accounts";
import { worktop, worktopLSU, worktopUnstakedXrdNft } from "./worktop";
export const DONE = "done";
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
export const NO_LSU_ON_WORKTOP = "put some LSUs on the worktop first";
export const NO_STAKE_CLAIM_NFT_ON_WORKTOP =
  "put a Stake Claim NFT on the worktop first";
export const NO_OCISWAP_COIN_ON_WORKTOP =
  "put some coin listed on Ociswap in the worktop first";
export const NO_OCISWAP_PAIR_ON_WORKTOP =
  "put two different coins listed on Ociswap in the worktop first";
export const NO_OCISWAP_LP_ON_WORKTOP =
  "put some Ociswap LPs in the worktop first";
export const NO_COINS_TO_SEND = "no coins to send!";
export const SOMETHING_WENT_WRONG = "something went wrong";
export const UNKNOWN_XRD_AMOUNT = "unknown XRD amount";
export const CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY =
  "unknown quantity on the worktop, choose another action";
export const NO_LSULP_ON_WORTOP = "there are no LSULP in the worktop";
export const CANNOT_HANDLE_MULTIPLE_LOANS = "can't handle multiple loans";
export const NO_LOAN = "get a loan first";
export const NO_GABLE_LSU = "put some Gable LSUs in the worktop first";
export const NO_DEFIPLAZA_COINS_ON_WORTOP =
  "put some coin listed on DefiPlaza in the worktop first";
export const NO_ALPHADEX_COINS_ON_WORKTOP =
  "put some coin listed on AlphaDEX in the worktop first";
export const NO_WEFT_CLAIMER_NFT = "you don't have a Weft Claimer NFT";

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

export function validateQuantity(quantity: string, max?: PrecisionNumber) {
  if (quantity !== "" && !isValidQuantity(quantity)) {
    validationErrors.add(INVALID_QUANTITY);
  } else if (get(validationErrors).has(INVALID_QUANTITY)) {
    validationErrors.del(INVALID_QUANTITY);
  }

  if (
    max &&
    isValidQuantity(quantity) &&
    new PrecisionNumber(quantity).isGreaterThan(max)
  ) {
    validationErrors.add(NOT_ENOUGH_COINS_ON_WORKTOP);
  } else if (get(validationErrors).has(NOT_ENOUGH_COINS_ON_WORKTOP)) {
    validationErrors.del(NOT_ENOUGH_COINS_ON_WORKTOP);
  }
}

export function validateAvailableXRD(atLeast = new PrecisionNumber("90")) {
  const availableXRDs = get(worktop).fungibles.get(XRD);

  if (availableXRDs?.amount === UNKNOWN_QUANTITY) {
    validationErrors.add(UNKNOWN_XRD_AMOUNT);
    return;
  } else {
    validationErrors.del(UNKNOWN_XRD_AMOUNT);
  }

  if (!availableXRDs || availableXRDs.amount.isLessThan(atLeast)) {
    validationErrors.add(NOT_ENOUGH_XRD_ON_WORKTOP);
  } else if (get(validationErrors).has(NOT_ENOUGH_XRD_ON_WORKTOP)) {
    validationErrors.del(NOT_ENOUGH_XRD_ON_WORKTOP);
  }
}

export function validateAvailableFungibles(
  availableFungibles?: Map<string, WalletFungible>,
  errorMessage: string = NO_FUNGIBLES_ON_WORKTOP
) {
  if (availableFungibles !== undefined) {
    if (availableFungibles.size === 0) {
      validationErrors.add(errorMessage);
    } else if (get(validationErrors).has(errorMessage)) {
      validationErrors.del(errorMessage);
    }
    return;
  }

  const allFungibles = get(worktop).fungibles;
  if (allFungibles.size === 0) {
    validationErrors.add(errorMessage);
  } else if (get(validationErrors).has(errorMessage)) {
    validationErrors.del(errorMessage);
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

export function validateAvailableLSUs(fungibles?: Map<string, WalletFungible>) {
  if (fungibles !== undefined) {
    if (fungibles.size === 0) {
      validationErrors.add(NO_LSU_ON_WORKTOP);
    } else if (get(validationErrors).has(NO_LSU_ON_WORKTOP)) {
      validationErrors.del(NO_LSU_ON_WORKTOP);
    }
    return;
  }
  if (get(worktopLSU).size === 0) {
    validationErrors.add(NO_LSU_ON_WORKTOP);
  } else if (get(validationErrors).has(NO_LSU_ON_WORKTOP)) {
    validationErrors.del(NO_LSU_ON_WORKTOP);
  }
}

export function validateAvailableStakeClaimNFT() {
  if (get(worktopUnstakedXrdNft).size === 0) {
    validationErrors.add(NO_STAKE_CLAIM_NFT_ON_WORKTOP);
  } else if (get(validationErrors).has(NO_STAKE_CLAIM_NFT_ON_WORKTOP)) {
    validationErrors.del(NO_STAKE_CLAIM_NFT_ON_WORKTOP);
  }
}

export function validateOciswapCoinOnWorktop(
  fungibles: Map<string, WalletFungible>
) {
  if (fungibles.size === 0) {
    validationErrors.add(NO_OCISWAP_COIN_ON_WORKTOP);
  } else if (get(validationErrors).has(NO_OCISWAP_COIN_ON_WORKTOP)) {
    validationErrors.del(NO_OCISWAP_COIN_ON_WORKTOP);
  }
}

export function validateOciswapPairOnWorktop(
  fungibles: Map<string, WalletFungible>
) {
  if (fungibles.size < 2) {
    validationErrors.add(NO_OCISWAP_PAIR_ON_WORKTOP);
  } else if (get(validationErrors).has(NO_OCISWAP_PAIR_ON_WORKTOP)) {
    validationErrors.del(NO_OCISWAP_PAIR_ON_WORKTOP);
  }
}
