<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import {
    caviarnine_enabled_validators,
    find_fungible_symbol,
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
    NO_COINS_SELECTED,
    NO_LSULP_ON_WORTOP,
    NO_QUANTITY,
    DONE,
    actionError,
    validateAvailableFungibles,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { bucketNumber, manifest, proofNumber } from "../stores/transaction";
  import { worktop } from "../stores/worktop";
  import { nanoid } from "nanoid";

  // address -> symbol
  let lsuFungiblesToReceive: Map<string, string> = new Map();
  for (const lsu of Object.keys(pool_units)) {
    if (caviarnine_enabled_validators[pool_units[lsu]] !== undefined) {
      const symbol = find_fungible_symbol(lsu);
      lsuFungiblesToReceive.set(lsu, symbol);
    }
  }

  let lsulpFungible: WalletFungible | undefined = undefined;
  let allFungible = true;
  let fungibleAddress = "";
  let quantity = "";
  let maxQuantity: PrecisionNumber | undefined = undefined;

  let avalableNonFungibles: Map<string, NonFungibleFound> = new Map();

  let nonFungibleKey = "";

  function updateSelectors() {
    if ($worktop) {
      lsulpFungible = $worktop.fungibles.get(lsulp);
    }

    if (fungibleAddress === "" && lsuFungiblesToReceive.size > 0) {
      fungibleAddress = lsuFungiblesToReceive.keys().next().value;
    } else if (lsuFungiblesToReceive.size === 0) {
      fungibleAddress = "";
    }
    const prevMaxQuantity = maxQuantity;
    const amount = lsulpFungible?.amount;
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
    const mapToCheck = new Map<string, WalletFungible>();
    if (lsulpFungible !== undefined) {
      mapToCheck.set(lsulp, lsulpFungible);
    }
    validateAvailableFungibles(mapToCheck, NO_LSULP_ON_WORTOP);
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

    if (!lsulpFungible) {
      throw new Error(NO_LSULP_ON_WORTOP);
    }

    if (quantity === UNKNOWN_QUANTITY) {
      throw new Error(CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY);
    }
    const lsu = fungibleAddress;
    const nft = nonFungibleKey;
    let q = lsulpFungible.amount;
    let command = "";
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
      command += commands.putAllResourceToBucket(lsulp, $bucketNumber);
      worktop.removeAllFungible(lsulp);
    } else {
      q = new PrecisionNumber(quantity);
      command += commands.putResourceToBucket(lsulp, q, $bucketNumber);
      worktop.removeFungible(lsulp, q);
    }
    command += `
    CALL_METHOD
    Address("${lsu_pool}")
    "remove_liquidity"
    Bucket("bucket${$bucketNumber}")
    Address("${lsu}")
`;
    bucketNumber.increment();

    if (nft.length > 0) {
      command += `
    Enum<1u8>(
        Proof("proof${$proofNumber}")
    );
`;
      proofNumber.increment();
    } else {
      command += "    Enum<0u8>()\n;\n";
      worktop.addNonFungible(`${lsu_pool_receipt} ${UNKNOWN_ID}${nanoid()}`);
    }
    worktop.addFungible(lsu, q);
    manifest.update((m) => m + command);
    actionError.set(DONE);
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <QuantityInputWithAll
      bind:value={quantity}
      bind:all={allFungible}
      label="LSULP quantity to send"
    />

    <label class="label">
      <span class="label-text">LSU to receive</span>
      <select
        bind:value={fungibleAddress}
        class="select select-secondary select-sm w-3/5 text-end"
      >
        {#each Array.from(lsuFungiblesToReceive.entries()) as [address, symbol]}
          <option value={address}>{symbol}</option>
        {/each}
      </select>
    </label>

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
