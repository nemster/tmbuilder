<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { find_fungible_symbol } from "../../content";
  import PrecisionNumber from "../PrecisionNumber";
  import type { WalletFungible } from "../stores/accounts";
  import { UNKNOWN_QUANTITY } from "../stores/accounts";
  import {
    NO_FUNGIBLES_ON_WORKTOP,
    actionError,
    validateAvailableFungibles,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import AddActionButton from "./AddActionButton.svelte";
  import QuantityInputWithAll from "./QuantityInputWithAll.svelte";

  export let handleAddAction: () => Promise<void>;
  export let listedFungibleAddresses: string[] | undefined = undefined;
  export let noFungiblesOnWorktopError: string = NO_FUNGIBLES_ON_WORKTOP;
  export let sendFungibles: Map<string, WalletFungible>;
  export let sendFungibleAddress = "";
  export let quantity = "";
  export let allQuantity = true;
  let maxQuantity: PrecisionNumber | undefined = undefined;
  // fungible address -> fungible symbol
  let receiveFungibles: Map<string, string> = new Map();
  export let receiveFungibleAddress = "";
  export let customReceiveFungibles: Map<string, string> | undefined =
    undefined;

  onMount(() => {
    actionError.set("");
  });

  $: if (customReceiveFungibles !== undefined) {
    receiveFungibles = customReceiveFungibles;
    if (
      receiveFungibleAddress === "" ||
      !receiveFungibles.has(receiveFungibleAddress)
    ) {
      receiveFungibleAddress = receiveFungibles.keys().next().value;
    }
  }

  function updateSelectors() {
    if (!sendFungibles.has(sendFungibleAddress)) {
      sendFungibleAddress = "";
    }
    if (sendFungibleAddress === "" && sendFungibles.size > 0) {
      sendFungibleAddress = sendFungibles.keys().next().value;
    }

    if (listedFungibleAddresses !== undefined) {
      receiveFungibles.clear();
      for (let resourceAddress of listedFungibleAddresses) {
        if (resourceAddress !== sendFungibleAddress) {
          receiveFungibles.set(
            resourceAddress,
            find_fungible_symbol(resourceAddress)
          );
        }
      }

      // update svelte state
      receiveFungibles = receiveFungibles;
    }

    if (customReceiveFungibles !== undefined) {
      receiveFungibles = customReceiveFungibles;
    }

    if (
      receiveFungibleAddress === "" ||
      !receiveFungibles.has(receiveFungibleAddress)
    ) {
      receiveFungibleAddress = receiveFungibles.keys().next().value;
    }
    const prevMaxQuantity = maxQuantity;
    const amount = sendFungibles.get(sendFungibleAddress)?.amount;
    if (amount !== UNKNOWN_QUANTITY) {
      maxQuantity = amount;
    }
    if (
      maxQuantity !== undefined &&
      (quantity === "" || prevMaxQuantity !== maxQuantity)
    ) {
      quantity = maxQuantity.toString();
    }
  }

  afterUpdate(() => {
    updateSelectors();
    validateQuantity(quantity, maxQuantity);
    validateAvailableFungibles(sendFungibles, noFungiblesOnWorktopError);
  });

  onDestroy(() => {
    validationErrors.clear();
  });

  async function handleAddActionWithSelectorsUpdate() {
    await handleAddAction();
    updateSelectors();
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <label class="label">
      <span class="label-text">Coin to send</span>
      <select
        class="select select-secondary select-sm w-3/5 text-end"
        bind:value={sendFungibleAddress}
      >
        {#each Array.from(sendFungibles.values()) as sendFungible}
          <option value={sendFungible.address}>
            {sendFungible.symbol}
          </option>
        {/each}
      </select>
    </label>
    <QuantityInputWithAll bind:value={quantity} bind:all={allQuantity} />

    <label class="label">
      <span class="label-text">Coin to receive</span>
      <select
        class="select select-secondary select-sm w-3/5 text-end"
        bind:value={receiveFungibleAddress}
      >
        {#each Array.from(receiveFungibles) as [address, symbol]}
          <option value={address}>
            {symbol}
          </option>
        {/each}
      </select>
    </label>
  </div>
  <AddActionButton handleAddAction={handleAddActionWithSelectorsUpdate} />
</div>
