<script lang="ts">
  import { number_to_string } from "../../content";
  import { accounts } from "../stores/accounts";
  import { worktop } from "../stores/worktop";
  import type { WalletFungible, WalletNonFungible } from "../stores/accounts";
  import AddActionButton from "../AddActionButton.svelte";

  function withdrawString(account: string, resource: string, q: number) {
    return `CALL_METHOD
    Address("${account}")
    "withdraw"
    Address("${resource}")
    Decimal("${q}")
;
`;
  }
  let fungibleSelect: HTMLSelectElement | null = null;
  let nonFungibleSelect: HTMLSelectElement | null = null;

  let accountAddress: string | null = null;
  let fungibles: Map<string, WalletFungible> = new Map();
  let fungibleAddress: string;
  let fungibleQuantity = "";

  let nonFungibles: Map<string, WalletNonFungible> = new Map();
  let nonFungibleKey: string;

  $: if ($accounts.size > 0 && !accountAddress) {
    const [firstKey] = $accounts.keys();
    accountAddress = firstKey;
  }

  $: if (accountAddress) {
    fungibles = $accounts.get(accountAddress)!.fungibles;
    nonFungibles = $accounts.get(accountAddress)!.nonFungibles;
  }

  function handleFungibleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    fungibleAddress = target?.value;
    if (fungibleAddress !== "") {
      fungibleQuantity = number_to_string(
        fungibles.get(fungibleAddress)?.amount || 0
      );
      nonFungibleSelect!.value = "";
      nonFungibleSelect!.dispatchEvent(new Event("change"));
    } else {
      fungibleQuantity = "";
    }
  }

  function handleNonFungibleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    nonFungibleKey = target?.value;
    if (nonFungibleKey) {
      fungibleSelect!.value = "";
      fungibleSelect!.dispatchEvent(new Event("change"));
    }
  }

  function resetSelectors() {
    fungibleSelect!.value = "";
    fungibleSelect!.dispatchEvent(new Event("change"));
    nonFungibleSelect!.value = "";
    nonFungibleSelect!.dispatchEvent(new Event("change"));
  }

  function handleAddAction() {
    // TODO: refactor validation
    console.log(fungibleAddress, fungibleQuantity, nonFungibleKey);
    if (!fungibleAddress && !nonFungibleKey) {
      document.querySelector<HTMLParagraphElement>("#warn")!.innerText =
        "no coins selected";
      return false;
    } else {
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";
    }

    if (fungibleAddress !== "") {
      if (!fungibleQuantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerText =
          "invalid quantity!";
      } else {
        var q = parseFloat(fungibleQuantity);
        if (q > 0) {
          if (q > fungibles.get(fungibleAddress)!.amount) {
            q = fungibles.get(fungibleAddress)!.amount;
          }
          document.querySelector<HTMLTextAreaElement>(
            "#transaction_manifest"
          )!.value += withdrawString(accountAddress!, fungibleAddress, q);
          worktop.addFungible(fungibles.get(fungibleAddress)!);
          accounts.removeFungible(accountAddress!, fungibleAddress, q);
          resetSelectors();
        }
      }
    } else if (nonFungibleKey !== "") {
      const nonFungible = nonFungibles.get(nonFungibleKey)!;
      document.querySelector<HTMLTextAreaElement>(
        "#transaction_manifest"
      )!.value +=
        "CALL_METHOD\n" +
        '    Address("' +
        accountAddress +
        '")\n' +
        '    "withdraw_non_fungibles"\n' +
        '    Address("' +
        nonFungible.address +
        '")\n' +
        '    Array<NonFungibleLocalId>(\n        NonFungibleLocalId("' +
        nonFungible.id +
        '")\n    )\n;\n';
      worktop.addNonFungible(nonFungibles.get(nonFungibleKey)!);
      accounts.removeNonFungible(accountAddress!, nonFungibleKey);
      resetSelectors();
    }
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="flex flex-col flex-grow space-y-4">
    <label class="flex justify-between">
      Account
      <select
        class="select select-secondary select-xs w-3/5 text-end"
        bind:value={accountAddress}
      >
        {#each Array.from($accounts) as [_addr, account]}
          <option value={account.address}>{account.label}</option>
        {/each}
      </select>
    </label>

    <div class="flex flex-col">
      <label class="flex justify-between"
        >Fungibles
        <select
          bind:this={fungibleSelect}
          class="select select-secondary select-xs w-3/5 text-end"
          on:change={handleFungibleChange}
        >
          <option value={""} />
          {#each Array.from(fungibles.values()) as fungible}
            <option value={fungible.address}>{fungible.symbol}</option>
          {/each}
        </select>
      </label>
      <label class="flex justify-between">
        Quantity
        <input
          class="input bg-secondary input-xs w-3/5 text-end"
          type="text"
          bind:value={fungibleQuantity}
        /></label
      >
    </div>

    <label class="flex justify-between">
      Non fungibles
      <select
        bind:this={nonFungibleSelect}
        class="select select-secondary select-xs w-3/5 text-end"
        on:change={handleNonFungibleChange}
      >
        <option value={""} />
        {#each Array.from(nonFungibles.values()) as nonFungible}
          <option value={nonFungible.key}>{nonFungible.symbol}</option>
        {/each}
      </select>
    </label>
  </div>

  <div>
    <AddActionButton {handleAddAction} />
  </div>
</div>
