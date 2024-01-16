<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { find_fungible_symbol } from "../../content";
  import { ociswap_listed_coins, ociswap_lp_pools } from "../../ociswap";
  import commands from "../commands";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import QuantityInput from "../shared/QuantityInput.svelte";
  import {
    CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY,
    NO_COINS_TO_SEND,
    SOMETHING_WENT_WRONG,
    DONE,
    actionError,
    validateOciswapPairOnWorktop,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { bucketNumber, manifest } from "../stores/transaction";
  import { worktop } from "../stores/worktop";
  import { UNKNOWN_QUANTITY } from "../stores/accounts";
  import type { WalletFungible } from "../stores/accounts";
  import PrecisionNumber from "../PrecisionNumber";

  let addressCoin1 = "";
  let quantity = "";
  let allQuantity = true;
  let maxQuantity: PrecisionNumber | undefined = undefined;
  let possibleCoin2: Map<string, string> = new Map();
  let addressCoin2 = "";
  let availableFungibles = new Map<string, WalletFungible>();

  onMount(() => {
    actionError.set("");
  });

  function updateSelectors() {
    if ($worktop) {
      availableFungibles = worktop.filterFungibles(
        Object.keys(ociswap_listed_coins)
      );
    }
    if (!availableFungibles.has(addressCoin1)) {
      addressCoin1 = "";
    }
    if (addressCoin1 === "" && availableFungibles.size > 0) {
      addressCoin1 = availableFungibles.keys().next().value;
    }

    possibleCoin2.clear();
    for (let resourceAddress of availableFungibles.keys()) {
      if (resourceAddress !== addressCoin1) {
        possibleCoin2.set(
          resourceAddress,
          find_fungible_symbol(resourceAddress)
        );
      }
    }

    // update svelte state
    possibleCoin2 = possibleCoin2;
    if (addressCoin2 === "" || !possibleCoin2.has(addressCoin2)) {
      addressCoin2 = possibleCoin2.keys().next().value;
    }
    const prevMaxQuantity = maxQuantity;
    const amount = availableFungibles.get(addressCoin1)?.amount;
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
    validateOciswapPairOnWorktop(availableFungibles);
  });

  onDestroy(() => {
    validationErrors.clear();
  });

  async function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }

    if (quantity === "" || addressCoin1 === "") {
      actionError.set(NO_COINS_TO_SEND);
      return;
    }

    const send_1_12 = availableFungibles.get(addressCoin1);
    const send_2_12 = availableFungibles.get(addressCoin2);

    if (send_1_12 === undefined || send_2_12 === undefined) {
      actionError.set(NO_COINS_TO_SEND);
      return;
    }

    let send1 = send_1_12.address;
    let quantity1 = PrecisionNumber.ZERO();
    let send2 = send_2_12.address;
    let quantity2 = send_2_12.amount;
    let component = "";
    let lp_token = "";
    let lp_quantity = PrecisionNumber.ZERO();

    if (
      send_1_12.amount === UNKNOWN_QUANTITY ||
      quantity2 === UNKNOWN_QUANTITY
    ) {
      actionError.set(CANNOT_PROCEED_WITH_UNKNOWN_QUANTITY);
      return;
    }

    let all = "";
    if (allQuantity) {
      quantity1 = send_1_12.amount;
      all = send_1_12.address;
    } else {
      quantity1 = new PrecisionNumber(quantity);
    }
    let limit_condition = "x_amount=" + quantity1;

    const options = {
      method: "GET",
      headers: { accept: "application/json" },
    };

    // TODO: throw errors if fetch fails (handled in AddActionButton.svelte)
    fetch(
      "https://api.ociswap.com/pools?cursor=0&limit=1&token_address=" +
        send1 +
        "," +
        send2 +
        "&order=rank&direction=asc",
      options
    ).then((r1) => {
      if (!r1.ok) {
        actionError.set(SOMETHING_WENT_WRONG);
        return;
      }
      r1.json().then((j1) => {
        quantity2 = quantity2 as PrecisionNumber;
        if (j1.data[0] == undefined) {
          actionError.set("no such pool");
          return;
        }
        component = j1.data[0].address;
        if (j1.data[0].x.token.address == send2) {
          const tmp_string = send1;
          const tmp_number = quantity1;
          send1 = send2;
          quantity1 = quantity2;
          send2 = tmp_string;
          quantity2 = tmp_number;
          limit_condition = "y_amount=" + quantity2;
        }

        fetch(
          "https://api.ociswap.com/preview/add-liquidity?pool_address=" +
            component +
            "&" +
            limit_condition,
          options
        ).then((r2) => {
          if (!r2.ok) {
            actionError.set(SOMETHING_WENT_WRONG);
            return;
          }
          r2.json().then(async (j2) => {
            quantity2 = quantity2 as PrecisionNumber;
            const amount_x = new PrecisionNumber(j2.x_amount.token);
            const amount_y = new PrecisionNumber(j2.y_amount.token);
            if (
              amount_y.isGreaterThan(quantity2) ||
              amount_x.isGreaterThan(quantity1)
            ) {
              if (amount_y > quantity2) {
                limit_condition = "y_amount=" + quantity2;
                all = send2;
              } else {
                limit_condition = "x_amount=" + quantity1;
                all = send1;
              }
              fetch(
                "https://api.ociswap.com/preview/add-liquidity?pool_address=" +
                  component +
                  "&" +
                  limit_condition,
                options
              ).then((r3) => {
                if (!r3.ok) {
                  actionError.set(SOMETHING_WENT_WRONG);
                  return;
                }
                r3.json().then((j3) => {
                  lp_quantity = new PrecisionNumber(j3.liquidity_amount);
                  quantity1 = new PrecisionNumber(j3.x_amount.token);
                  quantity2 = new PrecisionNumber(j3.y_amount.token);
                });
              });
            } else {
              lp_quantity = new PrecisionNumber(j2.liquidity_amount);
              quantity1 = new PrecisionNumber(j2.x_amount.token);
              quantity2 = new PrecisionNumber(j2.y_amount.token);
            }

            for (let lp of Object.keys(ociswap_lp_pools)) {
              if (component == ociswap_lp_pools[lp]) {
                lp_token = lp;
                break;
              }
            }

            let command = "";
            if (send1 == all) {
              worktop.removeAllFungible(send1);
              command += commands.putAllResourceToBucket(send1, $bucketNumber);
            } else {
              worktop.removeFungible(send1, quantity1);
              command += commands.putResourceToBucket(
                send1,
                quantity1,
                $bucketNumber
              );
            }
            const bucketA = $bucketNumber;
            bucketNumber.increment();
            if (send2 == all) {
              worktop.removeAllFungible(send2);
              command += commands.putAllResourceToBucket(send2, $bucketNumber);
            } else {
              worktop.removeFungible(send2, quantity2);
              command += commands.putResourceToBucket(
                send2,
                quantity2,
                $bucketNumber
              );
            }
            const bucketB = $bucketNumber;
            command += commands.addLiquidity(component, bucketA, bucketB);
            manifest.update((m) => m + command);
            bucketNumber.increment();

            let wortopQuantity: PrecisionNumber | typeof UNKNOWN_QUANTITY =
              lp_quantity.isZero() ? UNKNOWN_QUANTITY : lp_quantity;
            worktop.addFungible(lp_token, wortopQuantity);
          });
        });
      });
    });
    actionError.set(DONE);
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <label class="label">
      <span class="label-text">Coin 1 to send</span>
      <select
        class="select select-secondary select-sm w-3/5 text-end"
        bind:value={addressCoin1}
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
      <span class="label-text">Coin 2 to send</span>
      <select
        class="select select-secondary select-sm w-3/5 text-end"
        bind:value={addressCoin2}
      >
        {#each Array.from(possibleCoin2) as [address, symbol]}
          <option value={address}>
            {symbol}
          </option>
        {/each}
      </select>
    </label>
  </div>

  <AddActionButton {handleAddAction} />
</div>
