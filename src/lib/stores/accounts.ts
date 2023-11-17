import { WalletDataStateAccount } from "@radixdlt/radix-dapp-toolkit";
import { writable } from "svelte/store";

export const accounts = writable<WalletDataStateAccount[]>([]);
export const fungibles = writable([]);
export const nonFungibles = writable([]);
