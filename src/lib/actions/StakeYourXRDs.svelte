<script lang="ts">
  import { onMount, afterUpdate, onDestroy } from "svelte";
  import {
    NO_QUANTITY,
    DONE,
    actionError,
    validateAvailableXRD,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { worktop } from "../stores/worktop";
  import { XRD } from "../../content";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import {
    validators_you_can_stake_to,
    validators_names,
    pool_units,
  } from "../../validators";
  import { my_validator_address } from "../../content";
  import commands from "../commands";
  import { bucketNumber, manifest } from "../stores/transaction";
  import QuantityInput from "../shared/QuantityInput.svelte";
  import { UNKNOWN_QUANTITY } from "../stores/accounts";
  import PrecisionNumber from "../PrecisionNumber";

  let allXRDs = true;
  let quantityXRD = "";
  let validatorAddress = my_validator_address;
  let availabeValidatorAddresses = Object.keys(validators_you_can_stake_to);

  let avaiableXRDs = $worktop.fungibles.get(XRD);

  onMount(() => {
    actionError.set("");
  });

  afterUpdate(() => {
    validateAvailableXRD();
    validateQuantity(quantityXRD);
  });

  onDestroy(() => {
    validationErrors.clear();
  });

  $: if (allXRDs && avaiableXRDs && avaiableXRDs.amount !== UNKNOWN_QUANTITY) {
    quantityXRD = avaiableXRDs.amount.toString();
  }

  async function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }
    if (!allXRDs && quantityXRD === "") {
      actionError.set(NO_QUANTITY);
      return;
    }

    let command = "";
    let q = new PrecisionNumber(quantityXRD);
    if (allXRDs) {
      command = commands.putAllResourceToBucket(XRD, $bucketNumber);
    } else {
      command = commands.putResourceToBucket(XRD, q, $bucketNumber);
    }
    command += commands.stakeBucket(validatorAddress, $bucketNumber);
    manifest.update((m) => m + command);
    bucketNumber.increment();
    worktop.removeFungible(XRD, q);

    for (var lsu of Object.keys(pool_units)) {
      if (pool_units[lsu] == validatorAddress) {
        worktop.addFungible(lsu, q);
        break;
      }
    }
    actionError.set(DONE);
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <label class="label">
      <span class="label-text">Validator</span>
      <select
        class="select select-secondary select-sm w-3/5 text-end"
        bind:value={validatorAddress}
      >
        <option value={my_validator_address}> StakingCoins </option>
        {#each availabeValidatorAddresses as validatorAddress}
          {#if validatorAddress != my_validator_address}
            <option value={validatorAddress}>
              {validators_names[validatorAddress].trim()}
            </option>
          {/if}
        {/each}
      </select>
    </label>
    <div class="label space-x-2">
      <span class="label-text my-auto">XRD</span>
      <label class="label cursor-pointer space-x-4 px-0">
        <span class="label-text">all</span>
        <input class="checkbox" type="checkbox" bind:checked={allXRDs} />
      </label>
      <QuantityInput
        label="quantity"
        bind:value={quantityXRD}
        hidden={allXRDs}
        classes="p-0"
      />
    </div>
  </div>

  <AddActionButton {handleAddAction} />
</div>
