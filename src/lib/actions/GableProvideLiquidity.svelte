<script lang="ts">
  import { nanoid } from "nanoid";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import {
    gable_component,
    gable_liquidity_nft,
    gable_lsu,
  } from "../../content";
  import PrecisionNumber from "../PrecisionNumber";
  import commands from "../commands";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import QuantityInputWithAll from "../shared/QuantityInputWithAll.svelte";
  import { UNKNOWN_ID, UNKNOWN_QUANTITY } from "../stores/accounts";
  import {
    CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY,
    NO_GABLE_LSU,
    actionError,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { bucketNumber, manifest } from "../stores/transaction";
  import { worktop } from "../stores/worktop";

  let quantity = "";
  let all = true;
  let availableGableLSU = $worktop.fungibles.get(gable_lsu);

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

    if (!availableGableLSU) {
      throw new Error(NO_GABLE_LSU);
    }

    if (availableGableLSU.amount === UNKNOWN_QUANTITY) {
      throw new Error(CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY);
    }

    let quantityToSend: PrecisionNumber;
    if (all) {
      quantityToSend = availableGableLSU.amount;
    } else {
      const q = new PrecisionNumber(quantity);
      if (q.isGreaterThan(availableGableLSU.amount)) {
        quantityToSend = availableGableLSU.amount;
      } else {
        quantityToSend = q;
      }
    }

    let command = "";
    if (quantityToSend === availableGableLSU.amount) {
      worktop.removeAllFungible(gable_lsu);
      command += commands.putAllResourceToBucket(gable_lsu, $bucketNumber);
    } else {
      worktop.removeFungible(gable_lsu, quantityToSend);
      command += commands.putResourceToBucket(
        gable_lsu,
        quantityToSend,
        $bucketNumber
      );
    }

    command += commands.depositLSU(gable_component, $bucketNumber);
    bucketNumber.increment();
    worktop.addNonFungible(`${gable_liquidity_nft} ${UNKNOWN_ID}${nanoid()}`);
    manifest.update((m) => m + command);
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <div class="label space-x-2 place-items-center">
      <QuantityInputWithAll
        label="Quantity of LSU to send"
        bind:value={quantity}
        classes="w-full"
        bind:all
      />
    </div>
  </div>
  <div>
    <AddActionButton {handleAddAction} />
  </div>
</div>
