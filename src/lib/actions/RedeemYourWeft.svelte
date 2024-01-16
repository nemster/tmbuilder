<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { weft, weft_claimer_nft } from "../../content";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import { accounts } from "../stores/accounts";
  import {
    NO_WEFT_CLAIMER_NFT,
    DONE,
    actionError,
    validationErrors,
  } from "../stores/errors";
  import { manifest, proofNumber } from "../stores/transaction";
  import { amountToCollect } from "../stores/weft";
  import { worktop } from "../stores/worktop";
  let nftKey = "";
  let availableNFTs = accounts.filterAllNonFungibles(weft_claimer_nft);

  $: if ($accounts) {
    availableNFTs = accounts.filterAllNonFungibles(weft_claimer_nft);
  }

  $: if (
    availableNFTs.size > 0 &&
    (nftKey === "" || !availableNFTs.has(nftKey))
  ) {
    nftKey = availableNFTs.values().next().value.key;
  }

  $: if (availableNFTs.size === 0) {
    validationErrors.add(NO_WEFT_CLAIMER_NFT);
  } else {
    validationErrors.del(NO_WEFT_CLAIMER_NFT);
  }

  onMount(() => {
    actionError.set("");
  });

  afterUpdate(() => {});

  onDestroy(() => {
    validationErrors.clear();
  });

  async function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }

    let command = "";
    let nft = availableNFTs.get(nftKey);
    if (nft === undefined) {
      actionError.set(NO_WEFT_CLAIMER_NFT);
      return;
    }

    let nftId = nftKey.split(" ")[1];
    let amount1 = $amountToCollect.get(nftId + 1);
    let amount2 = $amountToCollect.get(nftId + 2);
    let amount3 = $amountToCollect.get(nftId + 3);
    let amount4 = $amountToCollect.get(nftId + 4);
    if (
      amount1 === undefined &&
      amount2 === undefined &&
      amount3 === undefined &&
      amount4 === undefined
    ) {
      throw new Error("Nothing to collect");
    }

    if (amount1 != undefined) {
      command += `CALL_METHOD
    Address("${nft.account}")
    "create_proof_of_non_fungibles"
    Address("${weft_claimer_nft}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("${nft.id}")
    )
;
POP_FROM_AUTH_ZONE
    Proof("proof${$proofNumber}")
;
CALL_METHOD
    Address("component_rdx1crys4t0nvfjzwvsa2pt3zgsmaaaqql8squkannhzcfh36j6u993dnz")
    "claim"
    1u8
    Decimal("${amount1}")
    Proof("proof${$proofNumber}")
;
`;
      proofNumber.increment();
      worktop.addFungible(weft, amount1);
      amountToCollect.remove(nftId + 1, amount1);
    }

    if (amount2 != undefined) {
      command += `CALL_METHOD
    Address("${nft.account}")
    "create_proof_of_non_fungibles"
    Address("${weft_claimer_nft}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("${nft.id}")
    )
;
POP_FROM_AUTH_ZONE
    Proof("proof${$proofNumber}")
;
CALL_METHOD
    Address("component_rdx1crys4t0nvfjzwvsa2pt3zgsmaaaqql8squkannhzcfh36j6u993dnz")
    "claim"
    2u8
    Decimal("${amount2}")
    Proof("proof${$proofNumber}")
;
`;
      proofNumber.increment();
      worktop.addFungible(weft, amount2);
      amountToCollect.remove(nftId + 2, amount2);
    }

    if (amount3 != undefined) {
      command += `CALL_METHOD
    Address("${nft.account}")
    "create_proof_of_non_fungibles"
    Address("${weft_claimer_nft}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("${nft.id}")
    )
;
POP_FROM_AUTH_ZONE
    Proof("proof${$proofNumber}")
;
CALL_METHOD
    Address("component_rdx1crys4t0nvfjzwvsa2pt3zgsmaaaqql8squkannhzcfh36j6u993dnz")
    "claim"
    3u8
    Decimal("${amount3}")
    Proof("proof${$proofNumber}")
;
`;
      proofNumber.increment();
      worktop.addFungible(weft, amount3);
      amountToCollect.remove(nftId + 3, amount3);
    }

    if (amount4 != undefined) {
      command += `CALL_METHOD
    Address("${nft.account}")
    "create_proof_of_non_fungibles"
    Address("${weft_claimer_nft}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("${nft.id}")
    )
;
POP_FROM_AUTH_ZONE
    Proof("proof${$proofNumber}")
;
CALL_METHOD
    Address("component_rdx1crys4t0nvfjzwvsa2pt3zgsmaaaqql8squkannhzcfh36j6u993dnz")
    "claim"
    4u8
    Decimal("${amount4}")
    Proof("proof${$proofNumber}")
;
`;
      proofNumber.increment();
      worktop.addFungible(weft, amount4);
      amountToCollect.remove(nftId + 4, amount4);
    }

    manifest.update((m) => m + command);
    actionError.set(DONE);
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <label class="label">
      <span class="label-text">NFT to show</span>
      <select
        class="select select-secondary select-sm w-3/5 text-end"
        bind:value={nftKey}
      >
        {#each Array.from(availableNFTs.values()) as nft}
          <option value={nft.key}>
            {`${nft.symbol} ${nft.id}`}
          </option>
        {/each}
      </select>
    </label>
  </div>
  <AddActionButton {handleAddAction} />
</div>
