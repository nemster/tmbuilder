<script lang="ts">
  import { onMount } from "svelte";
  import { NO_ACCOUNT, NO_COINS_INPUT, actionError } from "../stores/errors";
  import { worktop } from "../stores/worktop";
  import { accounts } from "../stores/accounts";
  import { manifest, bucketNumber } from "../stores/transaction";
  import type { WalletFungible, WalletNonFungible } from "../stores/accounts";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import CoinInput from "../shared/CoinInput.svelte";
  import commands from "../commands";
  import { UNKNOWN_NFT_ID } from "../../content";
  import AccountInput from "../shared/AccountInput.svelte";
  import FailToggle from "../shared/FailToggle.svelte";

  let entireWorktop = true;
  let allFungible = true;
  let accountAddress: string | null = null;
  let fungibles: Map<string, WalletFungible> = new Map();
  let fungibleAddress: string;
  let fungibleQuantity = "";

  let nonFungibles: Map<string, WalletNonFungible> = new Map();
  let nonFungibleKey: string;

  let fail: "refund" | "abort" = "refund";

  $: {
    fungibles = $worktop.fungibles;
    nonFungibles = $worktop.nonFungibles;
  }

  onMount(() => {
    actionError.set("");
    if ($worktop.fungibles.size === 0 && $worktop.nonFungibles.size === 0) {
      actionError.set(NO_COINS_INPUT);
    }
  });

  function handleAddAction() {
    actionError.set("");
    if (!accountAddress) {
      actionError.set(NO_ACCOUNT);
      return;
    }

    if (fungibles.size === 0 && nonFungibles.size === 0) {
      actionError.set(NO_COINS_INPUT);
      return;
    }

    if (entireWorktop && accountAddress) {
      manifest.update(
        (m) => m + commands.tryDepositEntireWortop(accountAddress!, fail)
      );
      if ($accounts.has(accountAddress)) {
        // if the user specified their own account
        for (const [address, fungible] of fungibles) {
          accounts.updateFungible(
            accountAddress,
            address,
            fungible.amount,
            fungible.symbol
          );
        }
        for (const [address, nonFungible] of nonFungibles) {
          accounts.updateNonFungible(
            accountAddress,
            address,
            nonFungible.symbol,
            nonFungible.id
          );
        }
      }
      worktop.clearWorktop();
    } else {
      if (fungibleAddress) {
        const selectedFungible = fungibles.get(fungibleAddress);
        if (!selectedFungible) {
          actionError.set("could not find fungible");
          return;
        }

        let q = selectedFungible.amount;
        let command = "";
        if (allFungible) {
          command = commands.trySendAllFungibleToAccount(
            accountAddress!,
            fungibleAddress,
            $bucketNumber,
            fail
          );
        } else {
          if (!fungibleQuantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
            actionError.set("invalid quantity!");
            return;
          }
          q = parseFloat(fungibleQuantity);
          command = commands.trySendAmountFungibleToAccount(
            accountAddress,
            fungibleAddress,
            q.toString(),
            $bucketNumber,
            fail
          );
        }
        manifest.update((m) => m + command);
        bucketNumber.increment();

        if ($accounts.has(accountAddress)) {
          // if the user specified their own account
          accounts.updateFungible(
            accountAddress,
            fungibleAddress,
            q,
            selectedFungible.symbol
          );
        }

        worktop.removeFungible(fungibleAddress, q);
        fungibleQuantity = "";
      }

      if (nonFungibleKey) {
        const nonFungible = nonFungibles.get(nonFungibleKey);
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
        command += commands.tryDepositBucketToAccount(
          accountAddress,
          fail,
          $bucketNumber
        );
        bucketNumber.increment();
        worktop.removeNonFungible(nonFungibleKey);
        if ($accounts.has(accountAddress)) {
          // if the user specified their own account
          accounts.updateNonFungible(
            accountAddress,
            nonFungible.address,
            nonFungible.symbol,
            nonFungible.id
          );
        }
        manifest.update((m) => m + command);
        nonFungibleKey = "";
      }
    }
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <AccountInput bind:accountAddress />
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
        {fungibles}
        bind:fungibleAddress
        bind:fungibleQuantity
        bind:allFungible
        {nonFungibles}
        bind:nonFungibleKey
      />
    {/if}

    <FailToggle bind:fail />
  </div>
  <AddActionButton {handleAddAction} />
</div>
