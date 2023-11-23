<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { UNKNOWN_NFT_ID } from "../../content";
  import commands from "../commands";
  import AccountSelect from "../shared/AccountSelect.svelte";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import CoinInput from "../shared/CoinInput.svelte";
  import { accounts } from "../stores/accounts";
  import {
    NO_ACCOUNT,
    NO_COINS_SELECTED,
    NO_QUANTITY,
    actionError,
    validateAvailableCoins,
    validateQuantity,
    validationErrors,
  } from "../stores/errors";
  import { bucketNumber, manifest } from "../stores/transaction";
  import { worktop } from "../stores/worktop";

  let entireWorktop = true;
  let allFungible = true;
  let accountAddress = "";
  let fungibleAddress = "";
  let fungibleQuantity = "";
  let maxFungibleQuantity: number | undefined = undefined;

  let nonFungibleKey = "";

  onMount(() => {
    actionError.set("");
  });

  afterUpdate(() => {
    validateAvailableCoins();
    validateQuantity(fungibleQuantity, maxFungibleQuantity);
  });

  onDestroy(() => {
    validationErrors.clear();
  });

  $: if (fungibleAddress !== "") {
    maxFungibleQuantity = $worktop.fungibles.get(fungibleAddress)?.amount;
  }

  function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }
    if (!accountAddress) {
      actionError.set(NO_ACCOUNT);
      return;
    }

    if (!entireWorktop && fungibleAddress === "" && nonFungibleKey === "") {
      actionError.set(NO_COINS_SELECTED);
      return;
    }

    if (
      !entireWorktop &&
      !allFungible &&
      fungibleAddress &&
      fungibleQuantity === ""
    ) {
      actionError.set(NO_QUANTITY);
      return;
    }

    if (entireWorktop && accountAddress) {
      manifest.update((m) => m + commands.depositEntireWortop(accountAddress!));
      for (const [address, fungible] of $worktop.fungibles) {
        accounts.addFungible(accountAddress, address, fungible.amount);
      }
      for (const [address, nonFungible] of $worktop.nonFungibles) {
        accounts.addNonFungible(accountAddress, address, nonFungible.id);
      }
      worktop.clearWorktop();
    } else {
      if (fungibleAddress) {
        const selectedFungible = $worktop.fungibles.get(fungibleAddress);
        if (!selectedFungible) {
          actionError.set("could not find fungible");
          return;
        }
        let command = "";
        let q = selectedFungible.amount;
        if (allFungible) {
          command = commands.sendAllResourceToAccount(
            accountAddress!,
            fungibleAddress,
            $bucketNumber
          );
        } else {
          q = parseFloat(fungibleQuantity);
          command = commands.sendQuantityToAccount(
            accountAddress!,
            fungibleAddress,
            fungibleQuantity,
            $bucketNumber
          );
        }
        manifest.update((m) => m + command);
        bucketNumber.increment();
        accounts.addFungible(accountAddress, fungibleAddress, q);
        worktop.removeFungible(fungibleAddress, q);
        fungibleQuantity = "";
      }

      if (nonFungibleKey) {
        const nonFungible = $worktop.nonFungibles.get(nonFungibleKey);
        if (!nonFungible) {
          actionError.set("could not find non-fungible");
          return;
        }

        let command = "";
        if (nonFungible.id === UNKNOWN_NFT_ID) {
          command = commands.putAllResourceToBucket(
            nonFungible.address,
            $bucketNumber
          );
        } else {
          command = commands.putNonFungibleToBucket(
            nonFungible.address,
            nonFungible.id,
            $bucketNumber
          );
        }
        command += commands.sendBucketToAccount(accountAddress, $bucketNumber);
        bucketNumber.increment();
        worktop.removeNonFungible(nonFungibleKey);
        accounts.addNonFungible(
          accountAddress,
          nonFungible.address,
          nonFungible.id
        );
        manifest.update((m) => m + command);
        nonFungibleKey = "";
      }
    }
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <AccountSelect bind:accountAddress />
    <div class="flex w-full justify-between space-x-1">
      <label class="label cursor-pointer space-x-4">
        <span class="label-text">Entire worktop</span>
        <input bind:checked={entireWorktop} type="checkbox" class="checkbox" />
      </label>
      <label
        class={`label cursor-pointer space-x-4 ${
          entireWorktop ? "hidden" : ""
        }`}
      >
        <span class="label-text">All fungible</span>
        <input bind:checked={allFungible} type="checkbox" class="checkbox" />
      </label>
    </div>

    {#if !entireWorktop}
      <CoinInput
        fungibles={$worktop.fungibles}
        bind:fungibleAddress
        bind:fungibleQuantity
        bind:allFungible
        nonFungibles={$worktop.nonFungibles}
        bind:nonFungibleKey
      />
    {/if}
  </div>
  <AddActionButton {handleAddAction} />
</div>
