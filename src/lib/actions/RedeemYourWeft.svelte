<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { weft, weft_claimer_nft } from "../../content";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import { accounts } from "../stores/accounts";
  import {
    NO_WEFT_CLAIMER_NFT,
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

    let amount = $amountToCollect.get(nftKey);
    if (amount === undefined) {
      throw new Error("Nothing to collect");
    }

    command += `CALL_METHOD
    Address("${nft.address}")
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
    Decimal("${amount}")
    Proof("proof${$proofNumber}")
;
`;
    proofNumber.increment();

    worktop.addFungible(weft, amount);
    manifest.update((m) => m + command);
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
  <div>
    <AddActionButton {handleAddAction} />
  </div>
</div>
