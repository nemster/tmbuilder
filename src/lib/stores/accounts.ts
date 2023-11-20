import { writable } from "svelte/store";
import { EPSILON } from "../../content";

export interface WalletFungible {
  address: string;
  symbol: string;
  amount: number;
}

export interface WalletNonFungible {
  key: string;
  address: string;
  symbol: string;
  id: string;
}

export interface WalletAccount {
  address: string;
  label: string;

  // keys are addresses,
  // addresses are also duplicated in the values for esier access
  fungibles: Map<string, WalletFungible>;

  // address + " " + id is the key
  nonFungibles: Map<string, WalletNonFungible>;
}

function createAccounts() {
  const { subscribe, update } = writable<Map<string, WalletAccount>>(new Map());

  function updateAccount(address: string, label: string) {
    // wipes out fungibles and nonFungibles data
    const account: WalletAccount = {
      address,
      label,
      fungibles: new Map(),
      nonFungibles: new Map(),
    };

    update((accounts) => {
      accounts.set(address, account);
      return accounts;
    });
  }

  function updateFungible(
    accountAddress: string,
    address: string,
    amount: number,
    symbol: string
  ) {
    update((accounts) => {
      const account = accounts.get(accountAddress);
      if (account) {
        account.fungibles.set(address, {
          address,
          symbol,
          amount,
        });
        accounts.set(accountAddress, account);
      } else {
        console.error(
          `Could not update symbol=${symbol}, account [${accountAddress}] not found`
        );
      }
      return accounts;
    });
  }

  function removeFungible(accountAddress: string, address: string, q: number) {
    update((accounts) => {
      const account = accounts.get(accountAddress);
      if (account) {
        const fungible = account.fungibles.get(address);
        if (fungible) {
          fungible.amount -= q;
          if (fungible.amount < EPSILON) {
            account.fungibles.delete(address);
          } else {
            account.fungibles.set(address, fungible);
          }
          accounts.set(accountAddress, account);
        } else {
          console.error(
            `Could not remove fungible, account [${accountAddress}] not found`
          );
        }
      } else {
        console.error(
          `Could not remove fungible, account [${accountAddress}] not found`
        );
      }
      return accounts;
    });
  }

  function updateNonFungible(
    accountAddress: string,
    address: string,
    symbol: string,
    id: string
  ) {
    update((accounts) => {
      const account = accounts.get(accountAddress);
      if (account) {
        const key = `${address} ${id}`;
        account.nonFungibles.set(key, {
          key,
          address,
          symbol,
          id,
        });
        accounts.set(accountAddress, account);
      } else {
        console.error(
          `Could not update symbol=${symbol}, account [${accountAddress}] not found`
        );
      }
      return accounts;
    });
  }

  function removeNonFungible(accountAddress: string, addressId: string) {
    update((accounts) => {
      const account = accounts.get(accountAddress);
      if (account) {
        account.nonFungibles.delete(addressId);
        accounts.set(accountAddress, account);
      } else {
        console.error(
          `Could not remove non fungible, account [${accountAddress}] not found`
        );
      }
      return accounts;
    });
  }

  return {
    subscribe,
    updateAccount,
    updateFungible,
    updateNonFungible,
    removeFungible,
    removeNonFungible,
  };
}

export const accounts = createAccounts();
