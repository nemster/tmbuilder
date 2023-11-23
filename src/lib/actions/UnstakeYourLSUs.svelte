<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { UNKNOWN_NFT_ID, number_to_string } from "../../content";
  import { claim_nft, pool_units } from "../../validators";
  import commands from "../commands";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import {
    NO_QUANTITY,
    actionError,
    validateAvailableLSUs,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { bucketNumber, manifest } from "../stores/transaction";
  import { worktop, worktopLSU } from "../stores/worktop";

  let allLSU = true;
  let quantity = "";
  let lsuAddress = "";
  let maxQuantity: number | undefined = undefined;

  onMount(() => {
    actionError.set("");
  });

  afterUpdate(() => {
    validateAvailableLSUs();
    validateQuantity(quantity, maxQuantity);
  });

  onDestroy(() => {
    validationErrors.clear();
  });

  $: if (lsuAddress !== "") {
    maxQuantity = $worktopLSU.get(lsuAddress)?.amount;
  }

  $: if (allLSU && lsuAddress !== "" && maxQuantity !== undefined) {
    quantity = number_to_string(maxQuantity);
  }

  function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }
    if (!allLSU && quantity === "") {
      actionError.set(NO_QUANTITY);
      return;
    }

    let command = "";
    let q = parseFloat(quantity);
    let validatorAddress = pool_units[lsuAddress];
    if (allLSU) {
      command = commands.putAllResourceToBucket(lsuAddress, $bucketNumber);
    } else {
      command = commands.putResourceToBucket(lsuAddress, q, $bucketNumber);
    }
    command += commands.unstakeBucket(validatorAddress, $bucketNumber);
    manifest.update((m) => m + command);
    bucketNumber.increment();
    worktop.removeFungible(lsuAddress, q);

    for (let nft of Object.keys(claim_nft)) {
      if (claim_nft[nft] == validatorAddress) {
        // TODO: this probably will not be unique if the user unstakes 2 times
        // from the same validator per transaction
        worktop.addNonFungible(nft + " " + UNKNOWN_NFT_ID);
      }
    }
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <label class="label">
      <span class="label-text">LSU</span>
      <select
        class="select select-secondary select-sm w-3/5 text-end"
        bind:value={lsuAddress}
      >
        {#each Array.from($worktopLSU.values()) as lsuFungible}
          <option value={lsuFungible.address}>
            {lsuFungible.symbol}
          </option>
        {/each}
      </select>
    </label>
    <div class="label space-x-2">
      <span class="label-text my-auto">XRD</span>
      <label class="label cursor-pointer space-x-4 px-0">
        <span class="label-text">all</span>
        <input class="checkbox" type="checkbox" bind:checked={allLSU} />
      </label>
      <label class={`label p-0 ${allLSU ? "hidden" : ""}`}>
        <span class="label-text">quantity</span>
        <input
          class="input input-secondary bg-secondary input-sm w-3/5 text-end"
          bind:value={quantity}
          type="text"
        />
      </label>
    </div>
  </div>
  <div>
    <AddActionButton {handleAddAction} />
  </div>
</div>
