<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { XRD, claim_amount } from "../../content";
  import { claim_nft } from "../../validators";
  import commands from "../commands";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import { UNKNOWN_ID, UNKNOWN_QUANTITY } from "../stores/accounts";
  import {
    DONE,
    NO_STAKE_CLAIM_NFT_ON_WORKTOP,
    actionError,
    validateAvailableStakeClaimNFT,
    validationErrors,
  } from "../stores/errors";
  import { bucketNumber, manifest } from "../stores/transaction";
  import { worktop, worktopUnstakedXrdNft } from "../stores/worktop";
  import PrecisionNumber from "../PrecisionNumber";

  let claimNftKey = "";

  onMount(() => {
    actionError.set("");
  });

  afterUpdate(() => {
    validateAvailableStakeClaimNFT();
  });

  onDestroy(() => {
    validationErrors.clear();
  });

  $: if ($worktopUnstakedXrdNft.size > 0 && claimNftKey === "") {
    claimNftKey = $worktopUnstakedXrdNft.values().next().value.key;
  }

  async function handleAddAction() {
    // TODO: check claim_epoch
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }

    let command = "";
    let nft = $worktopUnstakedXrdNft.get(claimNftKey);
    if (nft === undefined) {
      actionError.set(NO_STAKE_CLAIM_NFT_ON_WORKTOP);
      return;
    }
    let validatorAddress = claim_nft[nft?.address];
    if (nft.id.startsWith(UNKNOWN_ID)) {
      command = commands.putAllResourceToBucket(nft.address, $bucketNumber);
    } else {
      command = commands.putNonFungibleToBucket(
        nft.address,
        nft.id,
        $bucketNumber
      );
    }
    command += commands.claimXrd(validatorAddress, $bucketNumber);
    manifest.update((m) => m + command);
    bucketNumber.increment();
    worktop.removeNonFungible(claimNftKey);

    let amount: PrecisionNumber | typeof UNKNOWN_QUANTITY =
      PrecisionNumber.ZERO();

    // claim_amount gets updated only in the wallet subscription
    if (claim_amount[nft.id] !== undefined) {
      amount = claim_amount[nft.id];
    } else {
      amount = UNKNOWN_QUANTITY;
    }
    worktop.addFungible(XRD, amount);
    actionError.set(DONE);
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <label class="label">
      <span class="label-text">Claim NFT</span>
      <select
        class="select select-secondary select-sm w-3/5 text-end"
        bind:value={claimNftKey}
      >
        {#each Array.from($worktopUnstakedXrdNft.values()) as claimNft}
          <option value={claimNft.key}>
            {`${claimNft.symbol} ${claimNft.id}`}
          </option>
        {/each}
      </select>
    </label>
  </div>

  <AddActionButton {handleAddAction} />
</div>
