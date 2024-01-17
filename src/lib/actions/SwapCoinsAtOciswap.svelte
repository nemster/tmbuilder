<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { XRD, find_fungible_symbol } from "../../content";
  import { ociswap_listed_coins } from "../../ociswap";
  import commands from "../commands";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import QuantityInput from "../shared/QuantityInput.svelte";
  import { UNKNOWN_QUANTITY } from "../stores/accounts";
  import type { WalletFungible } from "../stores/accounts";
  import {
    NO_COINS_TO_SEND,
    DONE,
    actionError,
    validateOciswapCoinOnWorktop,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { bucketNumber, manifest } from "../stores/transaction";
  import { worktop } from "../stores/worktop";
  import PrecisionNumber from "../PrecisionNumber";

  interface ociswap_swap {
    input_address: string;
    output_address: string;
    output_amount: { token: string };
    pool_address: string;
  }

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
    if ($worktop) {
      availableFungibles = worktop.filterFungibles(
        Object.keys(ociswap_listed_coins)
      );
    }
    if (!availableFungibles.has(sendFungibleAddress)) {
      sendFungibleAddress = "";
    }
    if (sendFungibleAddress === "" && availableFungibles.size > 0) {
      sendFungibleAddress = availableFungibles.keys().next().value;
    }

    receiveFungibles.clear();
    for (let resourceAddress of Object.keys(ociswap_listed_coins)) {
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
    validateOciswapCoinOnWorktop(availableFungibles);
  });

  onDestroy(() => {
    validationErrors.clear();
  });

  function build_ociswap_swaps(swaps: ociswap_swap[], quantity: string) {
    let command = "";
    for (var swap of swaps) {
      if (quantity == "*") {
        command = commands.putAllResourceToBucket(
          swap.input_address,
          $bucketNumber
        );
        sendFungibleAddress = "";
        worktop.removeAllFungible(swap.input_address);
      } else {
        const worktopQuantity =
          availableFungibles.get(sendFungibleAddress)?.amount;

        if (worktopQuantity === undefined) {
          throw new Error("did not find fungible on worktop");
        }
        const q = new PrecisionNumber(quantity);
        command = commands.putResourceToBucket(
          swap.input_address,
          q,
          $bucketNumber
        );
        worktop.removeFungible(swap.input_address, q);
      }
      command += commands.swap(swap.pool_address, $bucketNumber);
      worktop.addFungible(
        swap.output_address,
        new PrecisionNumber(swap.output_amount.token)
      );
      manifest.update((m) => m + command);
      bucketNumber.increment();
      updateSelectors();
    }
  }

  async function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }

    if (quantity === "" || sendFungibleAddress === "") {
      actionError.set(NO_COINS_TO_SEND);
      return;
    }

    let q = new PrecisionNumber(quantity);

    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };

    // TODO: throw errors if fetch fails
    fetch(
      "https://api.ociswap.com/preview/swap?input_address=" +
        sendFungibleAddress +
        "&input_amount=" +
        q +
        "&output_address=" +
        receiveFungibleAddress,
      options
    ).then((r1) => {
      if (r1.ok) {
        r1.json().then((j1) => {
          build_ociswap_swaps(j1.swaps, quantity);
        });
      } else {
        fetch(
          "https://api.ociswap.com/preview/swap?input_address=" +
            sendFungibleAddress +
            "&input_amount=" +
            q +
            "&output_address=" +
            XRD,
          options
        ).then((r2) => {
          if (r2.ok) {
            r2.json().then(async (j2) => {
              for (var i of j2.swaps) {
                if (i.output_address == XRD) {
                  fetch(
                    "https://api.ociswap.com/preview/swap?input_address=" +
                      XRD +
                      "&input_amount=" +
                      i.output_amount.token +
                      "&output_address=" +
                      receiveFungibleAddress,
                    options
                  ).then((r3) => {
                    if (r3.ok) {
                      build_ociswap_swaps(j2.swaps, quantity);
                      r3.json().then(async (j3) => {
                        build_ociswap_swaps(j3.swaps, "*");
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
    actionError.set(DONE);
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
  <AddActionButton {handleAddAction} />
</div>
