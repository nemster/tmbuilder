<script lang="ts">
  import { nanoid } from "nanoid";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { claim_nft, pool_units } from "../../validators";
  import commands from "../commands";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import QuantityInput from "../shared/QuantityInput.svelte";
  import { UNKNOWN_ID, UNKNOWN_QUANTITY } from "../stores/accounts";
  import {
    NO_QUANTITY,
    DONE,
    actionError,
    validateAvailableLSUs,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { bucketNumber, manifest } from "../stores/transaction";
  import { worktop, worktopLSU } from "../stores/worktop";
  import PrecisionNumber from "../PrecisionNumber";

  let allLSU = true;
  let quantity = "";
  let lsuAddress = "";
  let maxQuantity: PrecisionNumber | undefined = undefined;

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

  $: if ($worktopLSU.size > 0 && lsuAddress === "") {
    lsuAddress = $worktopLSU.values().next().value.address;
  }

  $: if (lsuAddress !== "") {
    const worktopLSUquantity = $worktopLSU.get(lsuAddress)?.amount;
    if (worktopLSUquantity !== UNKNOWN_QUANTITY) {
      maxQuantity = worktopLSUquantity;
    }
  }

  $: if (allLSU && lsuAddress !== "" && maxQuantity !== undefined) {
    quantity = maxQuantity.toString();
  }

  async function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }
    if (!allLSU && quantity === "") {
      throw new Error(NO_QUANTITY);
    }

    let command = "";
    let q = new PrecisionNumber(quantity);
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
      if (claim_nft[nft] === validatorAddress) {
        worktop.addNonFungible(`${nft} ${UNKNOWN_ID}${nanoid()}`);
      }
    }
    actionError.set(DONE);
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
      <label class="label cursor-pointer space-x-4 px-0">
        <span class="label-text">all</span>
        <input class="checkbox" type="checkbox" bind:checked={allLSU} />
      </label>
      <QuantityInput
        label="quantity"
        bind:value={quantity}
        hidden={allLSU}
        classes="p-0"
      />
    </div>
  </div>
  <AddActionButton {handleAddAction} />
</div>
