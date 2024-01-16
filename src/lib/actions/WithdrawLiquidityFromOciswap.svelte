<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { ociswap_lp_names, ociswap_lp_pools } from "../../ociswap";
  import PrecisionNumber from "../PrecisionNumber";
  import commands from "../commands";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import QuantityInput from "../shared/QuantityInput.svelte";
  import type { WalletFungible } from "../stores/accounts";
  import { UNKNOWN_QUANTITY } from "../stores/accounts";
  import {
    NO_COINS_TO_SEND,
    NO_QUANTITY,
    NO_OCISWAP_LP_ON_WORKTOP,
    DONE,
    actionError,
    validateAvailableFungibles,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { bucketNumber, manifest } from "../stores/transaction";
  import { worktop } from "../stores/worktop";

  let fungibleAddress = "";
  let quantity = "";
  let allQuantity = true;
  let allQuantityDisabled = false;
  let maxQuantity: PrecisionNumber | undefined = undefined;

  let availableFungibles: Map<string, WalletFungible> = new Map();

  function updateSelectors() {
    if ($worktop) {
      availableFungibles = worktop.filterFungibles(
        Object.keys(ociswap_lp_names)
      );
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

    if (amount === UNKNOWN_QUANTITY) {
      allQuantityDisabled = true;
    } else {
      allQuantityDisabled = false;
    }
  }

  onMount(() => {
    actionError.set("");
  });

  afterUpdate(() => {
    updateSelectors();
    validateQuantity(quantity, maxQuantity);
    validateAvailableFungibles(availableFungibles, NO_OCISWAP_LP_ON_WORKTOP);
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
      throw new Error(NO_COINS_TO_SEND);
    }

    if (!allQuantity && maxQuantity === undefined) {
      throw new Error(NO_QUANTITY);
    }

    let fungible = availableFungibles.get(fungibleAddress);
    if (fungible === undefined) {
      throw new Error(NO_COINS_TO_SEND);
    }

    let quantityToSend = PrecisionNumber.ZERO();
    if (!allQuantity) {
      quantityToSend = new PrecisionNumber(quantity);
    }

    const component = ociswap_lp_pools[fungibleAddress];
    let receive1 = "";
    let receive2 = "";
    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };
    const getPoolURL = "https://api.ociswap.com/pools/" + component;
    fetch(getPoolURL, options).then((getPoolResponse) => {
      if (!getPoolResponse.ok) {
        throw new Error(
          `something went wrong when fetching ${getPoolURL} with ${options}`
        );
      }
      getPoolResponse.json().then((getPoolResponseData) => {
        receive1 = getPoolResponseData.x.token.address;
        receive2 = getPoolResponseData.y.token.address;

        const removeLiquidityURL =
          "https://api.ociswap.com/preview/remove-liquidity?pool_address=" +
          component +
          "&liquidity_amount=" +
          quantityToSend;
        fetch(removeLiquidityURL, options).then((r2) => {
          if (!r2.ok) {
            throw new Error(
              `something went wrong when fetching ${removeLiquidityURL} with ${options}`
            );
          }
          r2.json().then((j2) => {
            const receive1amount = new PrecisionNumber(j2.x_amount.token);
            if (fungible?.amount === UNKNOWN_QUANTITY) {
              worktop.addFungible(receive1, UNKNOWN_QUANTITY);
            } else if (receive1amount.isGreaterThan(PrecisionNumber.ZERO())) {
              worktop.addFungible(receive1, receive1amount);
            }

            const receive2amount = new PrecisionNumber(j2.y_amount.token);
            if (fungible?.amount === UNKNOWN_QUANTITY) {
              worktop.addFungible(receive2, UNKNOWN_QUANTITY);
            } else if (receive2amount.isGreaterThan(PrecisionNumber.ZERO())) {
              worktop.addFungible(receive2, receive2amount);
            }
          });

          updateSelectors();
        });
      });

      let command = "";
      if (allQuantity) {
        command += commands.putAllResourceToBucket(
          fungibleAddress,
          $bucketNumber
        );
        worktop.removeAllFungible(fungibleAddress);
      } else {
        command += commands.putResourceToBucket(
          fungibleAddress,
          quantityToSend,
          $bucketNumber
        );
        worktop.removeFungible(fungibleAddress, quantityToSend);
      }
      command += commands.removeLiquidity(component, $bucketNumber);
      manifest.update((m) => m + command);
      bucketNumber.increment();
      updateSelectors();
    });
    actionError.set(DONE);
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <label class="label">
      <span class="label-text">LP</span>
      <select
        class="select select-secondary select-sm w-3/5 text-end"
        bind:value={fungibleAddress}
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
        <input
          class="checkbox"
          type="checkbox"
          bind:checked={allQuantity}
          disabled={allQuantityDisabled}
        />
      </label>
      <QuantityInput bind:value={quantity} hidden={allQuantity} />
    </div>
  </div>
  <AddActionButton {handleAddAction} />
</div>
