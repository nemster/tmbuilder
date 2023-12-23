<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import {
    XRD,
    gable_component,
    gable_loan_fees,
    gable_transient_nft,
  } from "../../content";
  import PrecisionNumber from "../PrecisionNumber";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import { UNKNOWN_QUANTITY } from "../stores/accounts";
  import {
    CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY,
    NO_LOAN,
    DONE,
    actionError,
    validateAvailableXRD,
    validationErrors,
  } from "../stores/errors";
  import { loanQuantity } from "../stores/gable";
  import { worktop } from "../stores/worktop";
  import commands from "../commands";
  import { bucketNumber, manifest } from "../stores/transaction";

  let xrdToRefund: PrecisionNumber = PrecisionNumber.ZERO();

  onMount(() => {
    actionError.set("");
  });

  afterUpdate(() => {
    xrdToRefund = $loanQuantity.multipliedBy(
      gable_loan_fees.plus(new PrecisionNumber("1"))
    );
    validateAvailableXRD(xrdToRefund);
  });

  onDestroy(() => {
    validationErrors.clear();
  });

  async function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }

    if ($loanQuantity.isZero()) {
      throw new Error(NO_LOAN);
    }

    const xrdOnWorktop = $worktop.fungibles.get(XRD)?.amount;
    if (xrdOnWorktop === UNKNOWN_QUANTITY) {
      throw new Error(CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY);
    }

    const gableLoanNft = Array.from($worktop.nonFungibles.values()).find(
      (nft) => nft.address === gable_transient_nft
    );

    if (!gableLoanNft) {
      throw new Error(NO_LOAN);
    }

    let command = "";
    command += commands.putResourceToBucket(XRD, xrdToRefund, $bucketNumber);
    command += commands.putAllResourceToBucket(
      gable_transient_nft,
      $bucketNumber + 1
    );
    command += commands.repayFlashLoan(
      gable_component,
      $bucketNumber,
      $bucketNumber + 1
    );
    bucketNumber.increment();
    bucketNumber.increment();
    manifest.update((m) => m + command);
    loanQuantity.set(PrecisionNumber.ZERO());
    worktop.removeFungible(XRD, xrdToRefund);
    worktop.removeNonFungible(gableLoanNft.key);
    actionError.set(DONE);
  }
</script>

<div class="flex w-full justify-end">
  <div>
    <AddActionButton {handleAddAction} />
  </div>
</div>
