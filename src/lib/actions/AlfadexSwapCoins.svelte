<script lang="ts">
  import { alphadex_listed_coins } from "../../alphadex";
  import { XRD, donor, staked_amount } from "../../content";
  import PrecisionNumber from "../PrecisionNumber";
  import commands from "../commands";
  import SwapFungibles from "../shared/SwapFungibles.svelte";
  import type { WalletFungible } from "../stores/accounts";
  import { UNKNOWN_QUANTITY } from "../stores/accounts";
  import {
    CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY,
    NO_ALPHADEX_COINS_ON_WORKTOP,
    NO_COINS_TO_SEND,
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

  let listedFungibleAddresses = Object.keys(alphadex_listed_coins);

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

    let fee_badge = "5";
    if (
      donor ||
      staked_amount.isGreaterThanOrEqualTo(new PrecisionNumber("5000"))
    ) {
      fee_badge = "6";
    }

    const url = "https://api.alphadex.net/v0/quote/swap";
    const body = JSON.stringify({
      fromTokenAddress: sendFungibleAddress,
      fromTokenAmount: quantityToSend.toString(),
      toTokenAddress: receiveFungibleAddress,
      maxSlippage: "1",
      platformId: fee_badge,
    });

    try {
      interface AlphaDexResponse extends Response {
        status: number;
        quotes: {
          pairAddress: string;
          fromAmount: number;
          toAmount: number;
        }[];
      }
      let response: Response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: body,
      });

      if (response.status !== 200 && response.status !== 406) {
        console.error(response);
        throw new Error(response.statusText);
      }

      const responseData: AlphaDexResponse = await response.json();

      let command = "";
      if (response.status == 200) {
        if (quantityToSend.isEqualTo(sendFungible.amount)) {
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
      } else {
        quantityToSend = new PrecisionNumber(responseData.quotes[0].fromAmount);
        worktop.removeFungible(sendFungibleAddress, quantityToSend);
        command += commands.putResourceToBucket(
          sendFungibleAddress,
          quantityToSend,
          $bucketNumber
        );
      }

      let next = "";
      for (const swaps of responseData.quotes) {
        let to_coin: string;
        if (sendFungibleAddress === XRD || next !== "") {
          to_coin = receiveFungibleAddress;
        } else {
          to_coin = XRD;
        }
        command +=
          next +
          `CALL_METHOD
    Address("${swaps.pairAddress}")
    "swap"
    Bucket("bucket${$bucketNumber}")
    Decimal("100")
    ${fee_badge}u32
;
`;
        bucketNumber.increment();
        if (to_coin === receiveFungibleAddress) {
          const q = new PrecisionNumber(swaps.toAmount);
          worktop.addFungible(receiveFungibleAddress, q);
        } else {
          next = `TAKE_ALL_FROM_WORKTOP
    Address("${to_coin}")
    Bucket("bucket${$bucketNumber}")
;
`;
        }
      }
      manifest.update((m) => m + command);
    } catch (e) {
      console.error(e);
      throw new Error(`Something went wrong when fetching AlphaDEX data`);
    }
    actionError.set(DONE);
  }
</script>

<SwapFungibles
  noFungiblesOnWorktopError={NO_ALPHADEX_COINS_ON_WORKTOP}
  {sendFungibles}
  bind:sendFungibleAddress
  bind:quantity
  bind:allQuantity
  bind:receiveFungibleAddress
  {listedFungibleAddresses}
  {handleAddAction}
/>
