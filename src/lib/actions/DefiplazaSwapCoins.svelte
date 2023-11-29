<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { defiplaza_component, find_fungible_symbol } from "../../content";
  import { defiplaza_listed_coins } from "../../defiplaza";
  import PrecisionNumber from "../PrecisionNumber";
  import commands from "../commands";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import QuantityInput from "../shared/QuantityInput.svelte";
  import type { WalletFungible } from "../stores/accounts";
  import { UNKNOWN_QUANTITY } from "../stores/accounts";
  import {
    CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY,
    NO_COINS_TO_SEND,
    NO_DEFIPLAZA_COINS_ON_WORTOP,
    actionError,
    validateAvailableFungibles,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { bucketNumber, manifest } from "../stores/transaction";
  import { worktop } from "../stores/worktop";

  let availableFungibles = new Map<string, WalletFungible>();

  let sendFungibleAddress = "";
  let quantity = "";
  let allQuantity = true;
  let maxQuantity: PrecisionNumber | undefined = undefined;
  // fungible address -> fungible symbol
  let receiveFungibles: Map<string, string> = new Map();
  let receiveFungibleAddress = "";

  onMount(() => {
    actionError.set("");
  });

  function updateSelectors() {
    availableFungibles = worktop.filterFungibles(
      Object.keys(defiplaza_listed_coins)
    );
    if (!availableFungibles.has(sendFungibleAddress)) {
      sendFungibleAddress = "";
    }
    if (sendFungibleAddress === "" && availableFungibles.size > 0) {
      sendFungibleAddress = availableFungibles.keys().next().value;
    }

    receiveFungibles.clear();
    for (let resourceAddress of Object.keys(defiplaza_listed_coins)) {
      if (resourceAddress !== sendFungibleAddress) {
        receiveFungibles.set(
          resourceAddress,
          find_fungible_symbol(resourceAddress)
        );
      }
    }

    // update svelte state
    receiveFungibles = receiveFungibles;
    if (
      receiveFungibleAddress === "" ||
      !receiveFungibles.has(receiveFungibleAddress)
    ) {
      receiveFungibleAddress = receiveFungibles.keys().next().value;
    }
    const prevMaxQuantity = maxQuantity;
    const amount = availableFungibles.get(sendFungibleAddress)?.amount;
    if (amount !== UNKNOWN_QUANTITY) {
      maxQuantity = amount;
    }
    if (
      maxQuantity !== undefined &&
      (quantity === "" || prevMaxQuantity !== maxQuantity)
    ) {
      quantity = maxQuantity.toString();
    }
  }

  afterUpdate(() => {
    updateSelectors();
    validateQuantity(quantity, maxQuantity);
    validateAvailableFungibles(
      availableFungibles,
      NO_DEFIPLAZA_COINS_ON_WORTOP
    );
  });

  onDestroy(() => {
    validationErrors.clear();
  });

  async function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }

    if (quantity === "" || sendFungibleAddress === "") {
      throw new Error(NO_COINS_TO_SEND);
    }
    const sendFungible = availableFungibles.get(sendFungibleAddress);
    if (sendFungible === undefined) {
      throw new Error(NO_COINS_TO_SEND);
    }

    if (sendFungible.amount === UNKNOWN_QUANTITY) {
      throw new Error(CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY);
    }

    let quantityToSend: PrecisionNumber = sendFungible.amount;
    if (!allQuantity) {
      quantityToSend = new PrecisionNumber(quantity);
    }

    const url =
      "https://tmbuilder.stakingcoins.eu/defiplaza.php?inputToken=" +
      sendFungibleAddress +
      "&outputToken=" +
      receiveFungibleAddress +
      "&inputAmount=" +
      quantityToSend;

    try {
      const response = await (await fetch(url)).json();
      // removing from worktop and manifest here to avoid
      // future operations bucket number collision if the request fails
      let command = "";
      if (allQuantity) {
        worktop.removeAllFungible(sendFungibleAddress);
        command += commands.putAllResourceToBucket(
          sendFungibleAddress,
          $bucketNumber
        );
      } else {
        worktop.removeFungible(sendFungibleAddress, quantityToSend);
        command += commands.putResourceToBucket(
          sendFungibleAddress,
          quantityToSend,
          $bucketNumber
        );
      }

      worktop.addFungible(receiveFungibleAddress, response.quoteToken.amount);

      command += commands.swapToAddress(
        defiplaza_component,
        $bucketNumber,
        receiveFungibleAddress
      );
      bucketNumber.increment();
      manifest.update((m) => m + command);
    } catch (e) {
      console.error(e);
      throw new Error(`Something went wrong when fetching defiplaza data`);
    }
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <label class="label">
      <span class="label-text">Coin to send</span>
      <select
        class="select select-secondary select-sm w-3/5 text-end"
        bind:value={sendFungibleAddress}
      >
        {#each Array.from(availableFungibles.values()) as sendFungible}
          <option value={sendFungible.address}>
            {sendFungible.symbol}
          </option>
        {/each}
      </select>
    </label>
    <div class="label space-x-2 !mt-0 pt-0">
      <label class="label cursor-pointer space-x-4 px-0">
        <span class="label-text">all</span>
        <input class="checkbox" type="checkbox" bind:checked={allQuantity} />
      </label>
      <QuantityInput bind:value={quantity} hidden={allQuantity} />
    </div>

    <label class="label">
      <span class="label-text">Coin to receive</span>
      <select
        class="select select-secondary select-sm w-3/5 text-end"
        bind:value={receiveFungibleAddress}
      >
        {#each Array.from(receiveFungibles) as [address, symbol]}
          <option value={address}>
            {symbol}
          </option>
        {/each}
      </select>
    </label>
  </div>
  <div>
    <AddActionButton {handleAddAction} />
  </div>
</div>
