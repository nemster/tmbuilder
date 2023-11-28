<script lang="ts">
  import { nanoid } from "nanoid";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { XRD, gable_component, gable_transient_nft } from "../../content";
  import PrecisionNumber from "../PrecisionNumber";
  import commands from "../commands";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import QuantityInput from "../shared/QuantityInput.svelte";
  import { UNKNOWN_ID } from "../stores/accounts";
  import {
    CANNOT_HANDLE_MULTIPLE_LOANS,
    actionError,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { loanQuantity } from "../stores/gable";
  import { manifest } from "../stores/transaction";
  import { worktop } from "../stores/worktop";

  let quantity = "";

  onMount(() => {
    actionError.set("");
  });

  afterUpdate(() => {
    validateQuantity(quantity);
  });

  onDestroy(() => {
    validationErrors.clear();
  });

  function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }

    if ($loanQuantity.isGreaterThanZero()) {
      throw new Error(CANNOT_HANDLE_MULTIPLE_LOANS);
    }
    const q = new PrecisionNumber(quantity);

    const command = commands.getFlashLoan(gable_component, q);
    manifest.update((m) => m + command);
    loanQuantity.set(q);
    worktop.addFungible(XRD, q);
    worktop.addNonFungible(`${gable_transient_nft} ${UNKNOWN_ID}${nanoid()}`);
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <div class="label space-x-2 place-items-center">
      <QuantityInput
        label="Quantity (XRD)"
        bind:value={quantity}
        classes="w-full"
      />
    </div>
  </div>
  <div>
    <AddActionButton {handleAddAction} />
  </div>
</div>
