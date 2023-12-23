<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import {
    caviarnine_enabled_validators,
    find_fungible_symbol,
    lsu_pool,
  } from "../../content";
  import { pool_units } from "../../validators";
  import PrecisionNumber from "../PrecisionNumber";
  import commands from "../commands";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import QuantityInputWithAll from "../shared/QuantityInputWithAll.svelte";
  import type { WalletFungible } from "../stores/accounts";
  import { UNKNOWN_QUANTITY } from "../stores/accounts";
  import {
    CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY,
    NO_COINS_SELECTED,
    NO_LSU_ON_WORKTOP,
    NO_QUANTITY,
    DONE,
    actionError,
    validateAvailableFungibles,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { bucketNumber, manifest } from "../stores/transaction";
  import { worktop } from "../stores/worktop";

  let fungiblesToSend: Map<string, WalletFungible> = new Map();
  // address -> symbol
  let fungiblesToReceive: Map<string, string> = new Map();

  let allFungible = true;
  let sendAddress = "";
  let quantity = "";
  let maxQuantity: PrecisionNumber | undefined = undefined;
  let receiveAddress = "";

  function updateSelectors() {
    // available fungibles
    const caviarnineValidators = new Set(
      Object.keys(caviarnine_enabled_validators)
    );
    let poolUnitsCaviarnine: string[] = [];
    Object.entries(pool_units).forEach(
      ([resourceAddress, validatorAddress]) => {
        if (caviarnineValidators.has(validatorAddress)) {
          poolUnitsCaviarnine.push(resourceAddress);
        }
      }
    );
    fungiblesToSend = worktop.filterFungibles(poolUnitsCaviarnine);

    // fungibles to receive
    fungiblesToReceive = new Map();
    for (const lsu of Object.keys(pool_units)) {
      if (
        caviarnine_enabled_validators[pool_units[lsu]] !== undefined &&
        // remove the currently selected fungible from the list of fungibles to receive
        lsu !== sendAddress
      ) {
        const symbol = find_fungible_symbol(lsu);
        fungiblesToReceive.set(lsu, symbol);
      }
    }
    fungiblesToReceive = fungiblesToReceive;

    if (
      (receiveAddress === "" || !fungiblesToReceive.has(receiveAddress)) &&
      fungiblesToReceive.size > 0
    ) {
      receiveAddress = fungiblesToReceive.keys().next().value;
    } else if (fungiblesToReceive.size === 0) {
      receiveAddress = "";
    }

    if (
      (sendAddress === "" || !fungiblesToSend.has(sendAddress)) &&
      fungiblesToSend.size > 0
    ) {
      sendAddress = fungiblesToSend.keys().next().value;
    } else if (fungiblesToSend.size === 0) {
      sendAddress = "";
    }
    const prevMaxQuantity = maxQuantity;
    const amount = $worktop.fungibles.get(sendAddress)?.amount;
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

  onMount(() => {
    actionError.set("");
    updateSelectors();
  });

  afterUpdate(() => {
    updateSelectors();
    validateAvailableFungibles(fungiblesToSend, NO_LSU_ON_WORKTOP);
    validateQuantity(quantity, maxQuantity);
  });

  onDestroy(() => {
    validationErrors.clear();
  });

  async function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }

    if (sendAddress === "") {
      throw new Error(NO_COINS_SELECTED);
    }

    if (!allFungible && sendAddress && quantity === "") {
      throw new Error(NO_QUANTITY);
    }

    if (quantity === UNKNOWN_QUANTITY) {
      throw new Error(CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY);
    }

    const fungible = fungiblesToSend.get(sendAddress);
    if (!fungible) {
      throw new Error(NO_LSU_ON_WORKTOP);
    }

    let q = fungible.amount;
    let command = "";
    if (allFungible) {
      command = commands.putAllResourceToBucket(sendAddress, $bucketNumber);

      worktop.removeAllFungible(sendAddress);
    } else {
      q = new PrecisionNumber(quantity);
      command = commands.putResourceToBucket(sendAddress, q, $bucketNumber);
      worktop.removeFungible(sendAddress, q);
    }

    command += commands.swapToAddress(lsu_pool, $bucketNumber, receiveAddress);
    bucketNumber.increment();
    worktop.addFungible(receiveAddress, q);
    manifest.update((m) => m + command);
    updateSelectors();
    actionError.set(DONE);
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <div class="form-control">
      <label class="label">
        <span class="label-text">LSU to send</span>
        <select
          bind:value={sendAddress}
          class="select select-secondary select-sm w-3/5 text-end"
        >
          {#each Array.from(fungiblesToSend.values()) as fungible}
            <option value={fungible.address}>{fungible.symbol}</option>
          {/each}
        </select>
      </label>

      <QuantityInputWithAll bind:value={quantity} bind:all={allFungible} />
    </div>

    <label class="label">
      <span class="label-text">LSU to receive</span>
      <select
        bind:value={receiveAddress}
        class="select select-secondary select-sm w-3/5 text-end"
      >
        {#each Array.from(fungiblesToReceive.entries()) as [address, symbol]}
          <option value={address}>{symbol}</option>
        {/each}
      </select>
    </label>
  </div>
  <AddActionButton {handleAddAction} />
</div>
