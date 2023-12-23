<script lang="ts">
  import { nanoid } from "nanoid";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import {
    caviarnine_enabled_validators,
    lsu_pool,
    lsu_pool_receipt,
    lsulp,
  } from "../../content";
  import { pool_units } from "../../validators";
  import PrecisionNumber from "../PrecisionNumber";
  import commands from "../commands";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import QuantityInputWithAll from "../shared/QuantityInputWithAll.svelte";
  import type { WalletFungible, WalletNonFungible } from "../stores/accounts";
  import { UNKNOWN_ID, UNKNOWN_QUANTITY, accounts } from "../stores/accounts";
  import {
    CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY,
    NO_COINS_ON_WORKTOP,
    NO_COINS_SELECTED,
    NO_LSU_ON_WORKTOP,
    NO_QUANTITY,
    DONE,
    actionError,
    validateAvailableFungibles,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { bucketNumber, manifest, proofNumber } from "../stores/transaction";
  import { worktop } from "../stores/worktop";

  let availableFungibles: Map<string, WalletFungible> = new Map();
  let allFungible = true;
  let fungibleAddress = "";
  let quantity = "";
  let maxQuantity: PrecisionNumber | undefined = undefined;

  let avalableNonFungibles: Map<string, NonFungibleFound> = new Map();

  let nonFungibleKey = "";

  function updateSelectors() {
    if ($worktop) {
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

      availableFungibles = worktop.filterFungibles(poolUnitsCaviarnine);
    }

    if (fungibleAddress === "" && availableFungibles.size > 0) {
      fungibleAddress = availableFungibles.keys().next().value;
    } else if (availableFungibles.size === 0) {
      fungibleAddress = "";
    }
    const prevMaxQuantity = maxQuantity;
    const amount = availableFungibles.get(fungibleAddress)?.amount;
    if (amount !== UNKNOWN_QUANTITY) {
      maxQuantity = amount;
    }
    if (
      maxQuantity !== undefined &&
      (quantity === "" || prevMaxQuantity !== maxQuantity)
    ) {
      quantity = maxQuantity.toString();
    }

    avalableNonFungibles = accounts.filterAllNonFungibles(lsu_pool_receipt);
    for (const [key, nft] of avalableNonFungibles) {
      nonFungibleKey = nft.account + ' ' + key;
      break;
    }
  }

  onMount(() => {
    actionError.set("");
  });

  afterUpdate(() => {
    updateSelectors();
    validateAvailableFungibles(availableFungibles, NO_LSU_ON_WORKTOP);
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

    if (fungibleAddress === "") {
      throw new Error(NO_COINS_SELECTED);
    }

    if (!allFungible && fungibleAddress && quantity === "") {
      throw new Error(NO_QUANTITY);
    }

    const lsu = fungibleAddress;
    const fungible = availableFungibles.get(lsu);

    if (!fungible) {
      throw new Error(NO_COINS_ON_WORKTOP);
    }

    if (quantity === UNKNOWN_QUANTITY) {
      throw new Error(CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY);
    }

    const nft = nonFungibleKey;
    let command = "";
    let q = fungible.amount;
    if (nft.length > 0) {
      const [account, nftAddress, nftId] = nft.split(" ");
      command += commands.createProofOfNonFungibles(
        account,
        lsu_pool_receipt,
        nftId
      );
      command += commands.createProofFromAuthZoneOfNonFungibles(
        lsu_pool_receipt,
        nftId,
        $proofNumber
      );
    }
    if (allFungible) {
      command += commands.putAllResourceToBucket(lsu, $bucketNumber);
      worktop.removeAllFungible(lsu);
    } else {
      q = new PrecisionNumber(quantity);
      command += commands.putResourceToBucket(lsu, q, $bucketNumber);
      worktop.removeFungible(lsu, q);
    }
    command += `CALL_METHOD
    Address("${lsu_pool}")
    "add_liquidity"
    Bucket("bucket${$bucketNumber}")
`;
    bucketNumber.increment();
    if (nft.length > 0) {
      command += `    Enum<1u8>(
        Proof("proof${$proofNumber}")
    );
`;
      proofNumber.increment();
    } else {
      command += "    Enum<0u8>()\n;\n";
      worktop.addNonFungible(`${lsu_pool_receipt} ${UNKNOWN_ID}${nanoid()}`);
    }
    worktop.addFungible(lsulp, q);
    manifest.update((m) => m + command);
    actionError.set(DONE);
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <div class="form-control">
      <label class="label">
        <span class="label-text">LSU</span>
        <select
          bind:value={fungibleAddress}
          class="select select-secondary select-sm w-3/5 text-end"
        >
          {#each Array.from(availableFungibles.values()) as fungible}
            <option value={fungible.address}>{fungible.symbol}</option>
          {/each}
        </select>
      </label>

      <QuantityInputWithAll bind:value={quantity} bind:all={allFungible} />
    </div>

    <label class="label">
      <span class="label-text">LSU pool receipt</span>
      <select
        bind:value={nonFungibleKey}
        class="select select-secondary select-sm w-3/5 text-end"
      >
        {#each Array.from(avalableNonFungibles.values()) as nonFungible}
          <option value={`${nonFungible.account} ${nonFungible.key}`}
            >{`${nonFungible.symbol} ${nonFungible.id}`}</option
          >
        {/each}
      </select>
    </label>
  </div>
  <AddActionButton {handleAddAction} />
</div>
