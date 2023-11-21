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

    return;

    document
      .querySelector<HTMLButtonElement>("#add_instruction2")!
      .addEventListener("click", function () {
        const account =
          document.querySelector<HTMLSelectElement>("#account2")!.value;

        if (document.querySelector<HTMLInputElement>("#worktop2")!.checked) {
        } else {
          const non_fungible =
            document.querySelector<HTMLSelectElement>("#non_fungible2")!.value;
          if (non_fungible.length > 0) {
            const res = non_fungible.split(" ");
            if (res[1] == unknown_nft_id) {
              document.querySelector<HTMLTextAreaElement>(
                "#transaction_manifest"
              )!.value +=
                "TAKE_ALL_FROM_WORKTOP\n" +
                '    Address("' +
                res[0] +
                '")\n' +
                '    Bucket("bucket' +
                bucket_number +
                '")\n;\n';
            } else {
              document.querySelector<HTMLTextAreaElement>(
                "#transaction_manifest"
              )!.value +=
                "TAKE_NON_FUNGIBLES_FROM_WORKTOP\n" +
                '    Address("' +
                res[0] +
                '")\n' +
                "    Array<NonFungibleLocalId>(\n" +
                '        NonFungibleLocalId("' +
                res[1] +
                '")\n    )\n' +
                '    Bucket("bucket' +
                bucket_number +
                '")\n;\n';
            }
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "CALL_METHOD\n" +
              '    Address("' +
              account +
              '")\n' +
              '    "deposit"\n' +
              '    Bucket("bucket' +
              bucket_number++ +
              '")\n;\n';
            remove_non_fungible_from_worktop(non_fungible);
          }
        }
        document.querySelector<HTMLSelectElement>(
          "#fungible2"
        )!.selectedIndex = 0;
        document.querySelector<HTMLSelectElement>(
          "#non_fungible2"
        )!.selectedIndex = 0;
      });
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
              commands.sendEntireResourceToAccount(
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
        // TODO:
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
