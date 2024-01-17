<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import commands from "../commands";
  import AccountSelect from "../shared/AccountSelect.svelte";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import FungibleOrNonFungibleInput from "../shared/FungibleOrNonFungibleInput.svelte";
  import type { WalletFungible, WalletNonFungible } from "../stores/accounts";
  import { UNKNOWN_QUANTITY, accounts } from "../stores/accounts";
  import {
    CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY,
    NO_ACCOUNT,
    NO_COINS_SELECTED,
    actionError,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { manifest } from "../stores/transaction";
  import { worktop } from "../stores/worktop";
  import PrecisionNumber from "../PrecisionNumber";

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

  async function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }
    if (!accountAddress) {
      throw new Error(NO_ACCOUNT);
    }
    if (!fungibleAddress && !nonFungibleKey) {
      throw new Error(NO_COINS_SELECTED);
    }

    let command = "";

    if (fungibleAddress !== "") {
      const accountQuantity = fungibles.get(fungibleAddress)?.amount;
      if (
        accountQuantity === undefined ||
        accountQuantity === UNKNOWN_QUANTITY
      ) {
        throw new Error(CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY);
      }
      var q = new PrecisionNumber(fungibleQuantity);
      if (q.isGreaterThanZero()) {
        if (q.isGreaterThan(accountQuantity)) {
          q = accountQuantity;
        }
        command = commands.withdraw(accountAddress, fungibleAddress, q);
        worktop.addFungible(fungibleAddress, q);
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
    <FungibleOrNonFungibleInput
      {fungibles}
      bind:fungibleAddress
      bind:fungibleQuantity
      {nonFungibles}
      bind:nonFungibleKey
    />
  </div>

  <AddActionButton {handleAddAction} />
</div>
