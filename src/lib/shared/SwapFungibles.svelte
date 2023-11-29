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
  import QuantityInput from "./QuantityInput.svelte";

  export let handleAddAction: () => Promise<void>;
  export let listedFungibleAddresses: string[];
  export let noFungiblesOnWorktopError: string = NO_FUNGIBLES_ON_WORKTOP;
  export let availableFungibles: Map<string, WalletFungible>;
  export let sendFungibleAddress = "";
  export let quantity = "";
  export let allQuantity = true;
  let maxQuantity: PrecisionNumber | undefined = undefined;
  // fungible address -> fungible symbol
  let receiveFungibles: Map<string, string> = new Map();
  export let receiveFungibleAddress = "";

  onMount(() => {
    actionError.set("");
  });

  function updateSelectors() {
    if (!availableFungibles.has(sendFungibleAddress)) {
      sendFungibleAddress = "";
    }
    if (sendFungibleAddress === "" && availableFungibles.size > 0) {
      sendFungibleAddress = availableFungibles.keys().next().value;
    }

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
    if (
      receiveFungibleAddress === "" ||
      !receiveFungibles.has(receiveFungibleAddress)
    ) {
      receiveFungibleAddress = receiveFungibles.keys().next().value;
    }
    const prevMaxQuantity = maxQuantity;
    const amount = availableFungibles.get(sendFungibleAddress)?.amount;
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
    validateAvailableFungibles(availableFungibles, noFungiblesOnWorktopError);
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
        {#each Array.from(availableFungibles.values()) as sendFungible}
          <option value={sendFungible.address}>
            {sendFungible.symbol}
          </option>
        {/each}
      </select>
    </label>
    <div class="label space-x-2 !mt-0 pt-0">
      <label class="label cursor-pointer space-x-4 px-0">
        <span class="label-text">all</span>
        <input class="checkbox" type="checkbox" bind:checked={allQuantity} />
      </label>
      <QuantityInput bind:value={quantity} hidden={allQuantity} />
    </div>

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
  <div>
    <AddActionButton handleAddAction={handleAddActionWithSelectorsUpdate} />
  </div>
</div>
