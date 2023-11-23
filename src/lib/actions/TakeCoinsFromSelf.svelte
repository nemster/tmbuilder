<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import commands from "../commands";
  import AccountSelect from "../shared/AccountSelect.svelte";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import CoinInput from "../shared/CoinInput.svelte";
  import type { WalletFungible, WalletNonFungible } from "../stores/accounts";
  import { accounts } from "../stores/accounts";
  import {
    NO_ACCOUNT,
    NO_COINS_SELECTED,
    actionError,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { manifest } from "../stores/transaction";
  import { worktop } from "../stores/worktop";

  let accountAddress: string | null = null;
  let fungibles: Map<string, WalletFungible> = new Map();
  let fungibleAddress: string;
  let fungibleQuantity = "";

  let nonFungibles: Map<string, WalletNonFungible> = new Map();
  let nonFungibleKey: string;

  $: if (accountAddress) {
    fungibles = $accounts.get(accountAddress)!.fungibles;
    nonFungibles = $accounts.get(accountAddress)!.nonFungibles;
  }

  onMount(() => {
    actionError.set("");
  });

  afterUpdate(() => {
    validateQuantity(fungibleQuantity);
  });
  onDestroy(() => {
    validationErrors.clear();
  });

  function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }
    if (!accountAddress) {
      actionError.set(NO_ACCOUNT);
      return;
    }
    if (!fungibleAddress && !nonFungibleKey) {
      actionError.set(NO_COINS_SELECTED);
      return;
    }

    let command = "";

    if (fungibleAddress !== "") {
      var q = parseFloat(fungibleQuantity);
      if (q > 0) {
        if (q > fungibles.get(fungibleAddress)!.amount) {
          q = fungibles.get(fungibleAddress)!.amount;
        }
        command = commands.withdraw(accountAddress, fungibleAddress, q);
        const f = fungibles.get(fungibleAddress);
        if (!f) {
          console.error(`Could not find fungible resource ${fungibleAddress}`);
          return;
        }
        worktop.addFungible(f.address, parseFloat(fungibleQuantity));
        accounts.removeFungible(accountAddress, fungibleAddress, q);
        fungibleAddress = "";
      }
    } else if (nonFungibleKey !== "") {
      const nonFungible = nonFungibles.get(nonFungibleKey)!;
      command = commands.withdrawNonFungibles(
        accountAddress,
        nonFungible.address,
        nonFungible.id
      );
      worktop.addNonFungible(nonFungibleKey);
      accounts.removeNonFungible(accountAddress, nonFungibleKey);
    } else {
      actionError.set(NO_COINS_SELECTED);
      return;
    }

    manifest.update((m) => m + command);
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <AccountSelect bind:accountAddress />
    <CoinInput
      {fungibles}
      bind:fungibleAddress
      bind:fungibleQuantity
      {nonFungibles}
      bind:nonFungibleKey
    />
  </div>

  <div>
    <AddActionButton {handleAddAction} />
  </div>
</div>
