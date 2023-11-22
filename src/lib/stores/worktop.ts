import { writable } from "svelte/store";
import type { WalletFungible, WalletNonFungible } from "./accounts";
import { EPSILON } from "../../content";

export interface Worktop {
  fungibles: Map<string, WalletFungible>;
  nonFungibles: Map<string, WalletNonFungible>;
}

function createWorktop() {
  const { subscribe, update } = writable<Worktop>({
    fungibles: new Map(),
    nonFungibles: new Map(),
  });

  function addFungible(fungible: WalletFungible) {
    update((worktop) => {
      if (worktop.fungibles.has(fungible.address)) {
        const existing = worktop.fungibles.get(fungible.address);
        if (existing) {
          existing.amount += fungible.amount;
          worktop.fungibles.set(fungible.address, existing);
        }
      } else {
        worktop.fungibles.set(fungible.address, {
          ...fungible,
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

  function addNonFungible(nonFungible: WalletNonFungible) {
    update((worktop) => {
      worktop.nonFungibles.set(nonFungible.key, {
        ...nonFungible,
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
