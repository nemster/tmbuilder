<script lang="ts">
  import { onMount } from "svelte";
  import {
    NO_ACCOUNT,
    NO_COINS_INPUT,
    NO_COINS_SELECTED,
    NO_QUANTITY,
    actionError,
  } from "../stores/errors";
  import { worktop } from "../stores/worktop";
  import { accounts } from "../stores/accounts";
  import { manifest, bucketNumber } from "../stores/transaction";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import CoinInput from "../shared/CoinInput.svelte";
  import commands from "../commands";
  import { UNKNOWN_NFT_ID } from "../../content";
  import AccountSelect from "../shared/AccountSelect.svelte";

  let entireWorktop = true;
  let allFungible = true;
  let accountAddress = "";
  let fungibleAddress = "";
  let fungibleQuantity = "";

  let nonFungibleKey = "";

  onMount(() => {
    actionError.set("");
    if ($worktop.fungibles.size === 0 && $worktop.nonFungibles.size === 0) {
      actionError.set(NO_COINS_INPUT);
    }
  });

  function handleAddAction() {
    const onActionErrors = [NO_ACCOUNT, NO_COINS_SELECTED, NO_QUANTITY];
    if (onActionErrors.includes($actionError)) {
      actionError.set("");
    }
    if ($actionError !== "") {
      return;
    }
    if (!accountAddress) {
      actionError.set(NO_ACCOUNT);
      return;
    }

    if ($worktop.fungibles.size === 0 && $worktop.nonFungibles.size === 0) {
      actionError.set(NO_COINS_INPUT);
      return;
    }

    if (fungibleAddress === "" && nonFungibleKey === "") {
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
        accounts.updateFungible(
          accountAddress,
          address,
          fungible.amount,
          fungible.symbol
        );
      }
      for (const [address, nonFungible] of $worktop.nonFungibles) {
        accounts.updateNonFungible(
          accountAddress,
          address,
          nonFungible.symbol,
          nonFungible.id
        );
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
        accounts.updateFungible(
          accountAddress,
          fungibleAddress,
          q,
          selectedFungible.symbol
        );
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
        accounts.updateNonFungible(
          accountAddress,
          nonFungible.address,
          nonFungible.symbol,
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
