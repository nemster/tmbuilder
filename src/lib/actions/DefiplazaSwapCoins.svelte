<script lang="ts">
  import { defiplaza_component } from "../../content";
  import { defiplaza_listed_coins } from "../../defiplaza";
  import PrecisionNumber from "../PrecisionNumber";
  import commands from "../commands";
  import SwapFungibles from "../shared/SwapFungibles.svelte";
  import type { WalletFungible } from "../stores/accounts";
  import { UNKNOWN_QUANTITY } from "../stores/accounts";
  import {
    CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY,
    NO_COINS_TO_SEND,
    NO_DEFIPLAZA_COINS_ON_WORTOP,
    NO_QUANTITY,
    DONE,
    actionError,
    validationErrors,
  } from "../stores/errors";
  import { bucketNumber, manifest } from "../stores/transaction";
  import { worktop } from "../stores/worktop";

  let sendFungibles = new Map<string, WalletFungible>();

  let sendFungibleAddress = "";
  let quantity = "";
  let allQuantity = true;
  let receiveFungibleAddress = "";

  let listedFungibleAddresses = Object.keys(defiplaza_listed_coins);

  $: if ($worktop) {
    sendFungibles = worktop.filterFungibles(listedFungibleAddresses);
  }

  async function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }

    if (sendFungibleAddress === "") {
      throw new Error(NO_COINS_TO_SEND);
    }
    if (!allQuantity && quantity === "") {
      throw new Error(NO_QUANTITY);
    }
    const sendFungible = sendFungibles.get(sendFungibleAddress);
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
    actionError.set(DONE);
  }
</script>

<SwapFungibles
  noFungiblesOnWorktopError={NO_DEFIPLAZA_COINS_ON_WORTOP}
  {sendFungibles}
  bind:sendFungibleAddress
  bind:quantity
  bind:allQuantity
  bind:receiveFungibleAddress
  {listedFungibleAddresses}
  {handleAddAction}
/>
