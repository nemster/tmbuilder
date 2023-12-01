import { get, writable } from "svelte/store";
import { find_fungible_symbol, find_non_fungible_symbol } from "../../content";
import PrecisionNumber from "../PrecisionNumber";
import { CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY } from "./errors";

export const UNKNOWN_QUANTITY = "[unknown quantity]";
export const UNKNOWN_ID = "unknown-id-";

export interface WalletFungible {
  address: string;
  symbol: string;
  amount: PrecisionNumber | typeof UNKNOWN_QUANTITY;
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

export interface NonFungibleFound {
  key: string;
  address: string;
  symbol: string;
  id: string;
  account: string;
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

  function addFungible(
    accountAddress: string,
    address: string,
    amount: PrecisionNumber | typeof UNKNOWN_QUANTITY
  ) {
    const symbol = find_fungible_symbol(address);
    update((accounts) => {
      const account = accounts.get(accountAddress);
      if (account) {
        let existingFungible = account.fungibles.get(address);
        if (existingFungible) {
          if (existingFungible.amount === UNKNOWN_QUANTITY) {
            return accounts;
          } else if (amount === UNKNOWN_QUANTITY) {
            existingFungible.amount = UNKNOWN_QUANTITY;
          } else {
            existingFungible.amount = existingFungible.amount.plus(amount);
          }
          account.fungibles.set(address, existingFungible);
        } else {
          existingFungible = {
            address,
            symbol,
            amount,
          };
          account.fungibles.set(address, existingFungible);
        }
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

  function removeFungible(
    accountAddress: string,
    address: string,
    q: PrecisionNumber
  ) {
    update((accounts) => {
      const account = accounts.get(accountAddress);
      if (account) {
        const fungible = account.fungibles.get(address);
        if (fungible) {
          if (fungible.amount === UNKNOWN_QUANTITY) {
            throw new Error(CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY);
          }
          fungible.amount = fungible.amount.minus(q);
          if (fungible.amount.isLessThanOrEqualTo(PrecisionNumber.ZERO())) {
            account.fungibles.delete(address);
          } else {
            account.fungibles.set(address, fungible);
          }
          accounts.set(accountAddress, account);
        } else {
          throw new Error(
            `Could not remove fungible, account [${accountAddress}] not found`
          );
        }
      } else {
        throw new Error(
          `Could not remove fungible, account [${accountAddress}] not found`
        );
      }
      return accounts;
    });
  }

  function addNonFungible(accountAddress: string, address: string, id: string) {
    update((accounts) => {
      const account = accounts.get(accountAddress);
      const symbol = find_non_fungible_symbol(address);
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

  function filterAllNonFungibles(
    resourceAddress: string
  ): Map<string, NonFungibleFound> {
    const filteredNonFungibles = new Map<string, NonFungibleFound>();

    for (const account of get(accounts).values()) {
      for (const nonFungible of account.nonFungibles.values()) {
        if (nonFungible.address === resourceAddress) {
          filteredNonFungibles.set(nonFungible.key, {
            key: nonFungible.key,
            address: nonFungible.address,
	    symbol: nonFungible.symbol,
            id: nonFungible.id,
            account: account.address
	  });
        }
      }
    }

    return filteredNonFungibles;
  }

  return {
    subscribe,
    updateAccount,
    addFungible,
    addNonFungible,
    removeFungible,
    removeNonFungible,
    filterAllNonFungibles,
  };
}

export const accounts = createAccounts();
