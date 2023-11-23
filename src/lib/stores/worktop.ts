import { derived, writable } from "svelte/store";
import type { WalletFungible, WalletNonFungible } from "./accounts";
import {
  EPSILON,
  find_fungible_symbol,
  find_non_fungible_symbol,
} from "../../content";
import { pool_units } from "../../validators";

export interface Worktop {
  fungibles: Map<string, WalletFungible>;
  nonFungibles: Map<string, WalletNonFungible>;
}

function createWorktop() {
  const { subscribe, update } = writable<Worktop>({
    fungibles: new Map(),
    nonFungibles: new Map(),
  });

  function addFungible(address: string, amount: number) {
    update((worktop) => {
      if (worktop.fungibles.has(address)) {
        const existingFungible = worktop.fungibles.get(address);
        if (existingFungible) {
          existingFungible.amount += amount;
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

  function removeFungible(address: string, amount: number) {
    update((worktop) => {
      if (worktop.fungibles.has(address)) {
        const existing = worktop.fungibles.get(address);
        if (existing) {
          existing.amount -= amount;
          if (existing.amount < EPSILON) {
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

  return {
    subscribe,
    addFungible,
    removeFungible,
    addNonFungible,
    removeNonFungible,
    clearWorktop,
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
