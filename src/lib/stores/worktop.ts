import { derived, get, writable } from "svelte/store";
import { find_fungible_symbol, find_non_fungible_symbol } from "../../content";
import { claim_nft, pool_units } from "../../validators";
import PrecisionNumber from "../PrecisionNumber";
import {
  UNKNOWN_QUANTITY,
  WalletFungible,
  WalletNonFungible,
} from "./accounts";

export interface Worktop {
  fungibles: Map<string, WalletFungible>;
  nonFungibles: Map<string, WalletNonFungible>;
}

function createWorktop() {
  const { subscribe, update } = writable<Worktop>({
    fungibles: new Map(),
    nonFungibles: new Map(),
  });

  function addFungible(
    address: string,
    amount: PrecisionNumber | typeof UNKNOWN_QUANTITY
  ) {
    update((worktop) => {
      if (amount === UNKNOWN_QUANTITY) {
        worktop.fungibles.set(address, {
          address,
          amount,
          symbol: find_fungible_symbol(address),
        });
        return worktop;
      }
      if (worktop.fungibles.has(address)) {
        const existingFungible = worktop.fungibles.get(address);
        if (existingFungible) {
          if (existingFungible.amount === UNKNOWN_QUANTITY) {
            return worktop;
          }
          existingFungible.amount = existingFungible.amount.plus(amount);
          worktop.fungibles.set(address, existingFungible);
        }
      } else {
        const symbol = find_fungible_symbol(address);
        worktop.fungibles.set(address, {
          address,
          amount,
          symbol,
        });
      }
      return worktop;
    });
  }

  function removeFungible(address: string, amount: PrecisionNumber) {
    update((worktop) => {
      if (worktop.fungibles.has(address)) {
        const existing = worktop.fungibles.get(address);
        if (existing) {
          if (existing.amount === UNKNOWN_QUANTITY) {
            throw new Error("Cannot substract from unknown quantity");
          }
          existing.amount = existing.amount.minus(amount);
          if (existing.amount.isLessThanOrEqualTo(PrecisionNumber.ZERO())) {
            worktop.fungibles.delete(address);
          } else {
            worktop.fungibles.set(address, existing);
          }
        }
      } else {
        console.error(
          "Attempted to remove fungible that does not exist in worktop",
          address
        );
      }
      return worktop;
    });
  }

  function removeAllFungible(address: string) {
    update((worktop) => {
      worktop.fungibles.delete(address);
      return worktop;
    });
  }

  function addNonFungible(nonFungibleKey: string) {
    const [address, id] = nonFungibleKey.split(" ");
    const symbol = find_non_fungible_symbol(address);
    update((worktop) => {
      worktop.nonFungibles.set(nonFungibleKey, {
        key: nonFungibleKey,
        id,
        address,
        symbol,
      });
      return worktop;
    });
  }

  function removeNonFungible(nonFungibleKey: string) {
    update((worktop) => {
      worktop.nonFungibles.delete(nonFungibleKey);
      return worktop;
    });
  }

  function clearWorktop() {
    update((worktop) => {
      worktop.fungibles = new Map();
      worktop.nonFungibles = new Map();
      return worktop;
    });
  }

  function filterFungibles(resourceAddresses: string[]) {
    const currentFungibles = get({ subscribe }).fungibles;
    const filteredFungibles = new Map<string, WalletFungible>();

    for (const address of resourceAddresses) {
      const fungible = currentFungibles.get(address);
      if (fungible !== undefined) {
        filteredFungibles.set(address, fungible);
      }
    }

    return filteredFungibles;
  }

  return {
    subscribe,
    addFungible,
    removeFungible,
    removeAllFungible,
    addNonFungible,
    removeNonFungible,
    clearWorktop,
    filterFungibles,
  };
}
export const worktop = createWorktop();
export const worktopLSU = derived<typeof worktop, Map<string, WalletFungible>>(
  worktop,
  ($worktop) => {
    const filtered = new Map();

    for (const [address, fungible] of $worktop.fungibles) {
      if (address in pool_units) {
        filtered.set(address, fungible);
      }
    }

    return filtered;
  }
);
export const worktopUnstakedXrdNft = derived<
  typeof worktop,
  Map<string, WalletNonFungible>
>(worktop, ($worktop) => {
  const filtered = new Map();

  for (const [key, nonFungible] of $worktop.nonFungibles) {
    if (nonFungible.address in claim_nft) {
      filtered.set(key, nonFungible);
    }
  }

  return filtered;
});
