<script lang="ts">
  import { onMount } from "svelte";
  import { addActionError } from "../stores/errors";
  import { worktop } from "../stores/worktop";
  import { accounts } from "../stores/accounts";
  import { manifest, bucketNumber } from "../stores/transaction";
  import type { WalletFungible, WalletNonFungible } from "../stores/accounts";
  import AccountSelect from "../shared/AccountSelect.svelte";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import CoinInput from "../shared/CoinInput.svelte";
  import commands from "../commands";
  import { UNKNOWN_NFT_ID } from "../../content";

  let entireWorktop = true;
  let allFungible = true;
  let accountAddress: string | null = null;
  let fungibles: Map<string, WalletFungible> = new Map();
  let fungibleAddress: string;
  let fungibleQuantity = "";

  let nonFungibles: Map<string, WalletNonFungible> = new Map();
  let nonFungibleKey: string;

  $: if (accountAddress) {
    fungibles = $worktop.fungibles;
    nonFungibles = $worktop.nonFungibles;
  }

  onMount(() => {
    addActionError.set("");
  });

  function handleAddAction() {
    if (fungibles.size === 0 && nonFungibles.size === 0) {
      addActionError.set("put some coins in the worktop first");
      return;
    }

    if (!accountAddress) {
      addActionError.set("select an account first");
      return;
    }

    if (entireWorktop && accountAddress) {
      manifest.update((m) => m + commands.depositEntireWortop(accountAddress!));
      worktop.clearWorktop();
    } else {
      if (fungibleAddress) {
        const selectedFungible = fungibles.get(fungibleAddress);
        if (!selectedFungible) {
          addActionError.set("could not find fungible");
          return;
        }
        if (allFungible) {
          manifest.update(
            (m) =>
              m +
              commands.sendAllResourceToAccount(
                accountAddress!,
                fungibleAddress,
                $bucketNumber
              )
          );
          bucketNumber.increment();

          accounts.updateFungible(
            accountAddress,
            fungibleAddress,
            selectedFungible.amount,
            selectedFungible.symbol
          );
          worktop.removeFungible(fungibleAddress, selectedFungible.amount);
        } else {
          if (!fungibleQuantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
            addActionError.set("invalid quantity!");
            return;
          }
          const q = parseFloat(fungibleQuantity);
          manifest.update(
            (m) =>
              m +
              commands.sendQuantityToAccount(
                accountAddress!,
                fungibleAddress,
                fungibleQuantity,
                $bucketNumber
              )
          );
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
      }

      if (nonFungibleKey) {
        const nonFungible = nonFungibles.get(nonFungibleKey);
        if (!nonFungible) {
          addActionError.set("could not find non-fungible");
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
        {fungibles}
        bind:fungibleAddress
        bind:fungibleQuantity
        bind:allFungible
        {nonFungibles}
        bind:nonFungibleKey
      />
    {/if}
  </div>
  <AddActionButton {handleAddAction} />
</div>
