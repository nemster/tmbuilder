<script lang="ts">
  import { find_fungible_symbol, gatewayApi } from "../../content";
  import { radixplanet_pools } from "../../radixplanet";
  import PrecisionNumber from "../PrecisionNumber";
  import commands from "../commands";
  import SwapFungibles from "../shared/SwapFungibles.svelte";
  import type { WalletFungible } from "../stores/accounts";
  import { UNKNOWN_QUANTITY } from "../stores/accounts";
  import {
    CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY,
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

  let listedFungibleAddresses: string[] = [];
  for (const pool of Object.keys(radixplanet_pools)) {
    for (const resource of radixplanet_pools[pool].resources) {
      listedFungibleAddresses.push(resource);
    }
  }

  $: if ($worktop) {
    sendFungibles = worktop.filterFungibles(listedFungibleAddresses);
  }

  let customReceiveFungibles: Map<string, string> = new Map();

  $: {
    customReceiveFungibles.clear();
    for (const pool of Object.keys(radixplanet_pools)) {
      let found = false;
      for (const resource of radixplanet_pools[pool].resources) {
        if (resource == sendFungibleAddress) {
          found = true;
          break;
        }
      }
      if (found) {
        for (const resource of radixplanet_pools[pool].resources) {
          if (resource !== sendFungibleAddress) {
            customReceiveFungibles.set(
              resource + " " + pool,
              find_fungible_symbol(resource) +
                " - " +
                radixplanet_pools[pool].name +
                " pool"
            );
          }
        }
      }
    }
    customReceiveFungibles = customReceiveFungibles;
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

    try {
      let command = "";
      const [resourceAddress, componentAddress] =
        receiveFungibleAddress.split(" ");
      let send_liquidity = new PrecisionNumber(0);
      let receive_liquidity = new PrecisionNumber(0);
      const fees = new PrecisionNumber(
        radixplanet_pools[componentAddress].fees
      );

      const response = await gatewayApi.state.getEntityDetailsVaultAggregated([
        componentAddress,
      ]);

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

      for (const item of response[0].fungible_resources.items) {
        if (item.resource_address == resourceAddress) {
          for (const item2 of item.vaults.items) {
            receive_liquidity = receive_liquidity.plus(
              new PrecisionNumber(item2.amount)
            );
          }
        } else if (item.resource_address == sendFungibleAddress) {
          for (const item2 of item.vaults.items) {
            send_liquidity = send_liquidity.plus(
              new PrecisionNumber(item2.amount)
            );
          }
        }
      }

      // original code:
      // const received_quantity =
      //   receive_liquidity *
      //   (1 - send_liquidity / (send_liquidity + quantity19 * (1 - fees)));
      const received_quantity = receive_liquidity.multipliedBy(
        new PrecisionNumber(1).minus(
          send_liquidity.dividedBy(
            send_liquidity.plus(
              quantityToSend.multipliedBy(new PrecisionNumber(1).minus(fees))
            )
          )
        )
      );
      worktop.addFungible(resourceAddress, received_quantity);
      worktop.addFungible(
        radixplanet_pools[componentAddress].lp,
        UNKNOWN_QUANTITY
      );
      command += `CALL_METHOD
    Address("${componentAddress}")
    "swap"
    Tuple(
        Array<Tuple>(
            Tuple(
                Enum<0u8>(),
                Bucket("bucket${$bucketNumber}")
            )
        ),
        Tuple(
            Address("${resourceAddress}"),
            Enum<0u8>()
        )
    )
;
`;
      bucketNumber.increment();
      manifest.update((m) => m + command);
    } catch (e) {
      console.error(e);
      throw new Error(`Something went wrong when fetching RadixPlanet data`);
    }
    actionError.set(DONE);
  }
</script>

<SwapFungibles
  noFungiblesOnWorktopError="put some coin listed on RadixPlanet in the worktop first"
  {sendFungibles}
  bind:sendFungibleAddress
  bind:quantity
  bind:allQuantity
  bind:receiveFungibleAddress
  {customReceiveFungibles}
  {handleAddAction}
/>
