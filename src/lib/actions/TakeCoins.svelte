<script lang="ts">
  import { onMount } from "svelte";
  import { number_to_string } from "../../content";
  import { accounts } from "../stores/accounts";
  import { worktop } from "../stores/worktop";
  import { manifest } from "../stores/transaction";
  import type { WalletFungible, WalletNonFungible } from "../stores/accounts";
  import AddActionButton from "../AddActionButton.svelte";
  import { addActionError } from "../stores/errors";
  import commands from "../commands";

  const NO_COINS_SELECTED = "no coins selected!";

  onMount(() => {
    addActionError.set("");
  });

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
      if ($addActionError === NO_COINS_SELECTED) {
        addActionError.set("");
      }
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
      if ($addActionError === NO_COINS_SELECTED) {
        addActionError.set("");
      }
    }
  }

  function resetSelectors() {
    fungibleSelect!.value = "";
    fungibleSelect!.dispatchEvent(new Event("change"));
    nonFungibleSelect!.value = "";
    nonFungibleSelect!.dispatchEvent(new Event("change"));
  }

  function handleAddAction() {
    if (!accountAddress) {
      addActionError.set("no account selected!");
      return;
    }
    if (!fungibleAddress && !nonFungibleKey) {
      addActionError.set(NO_COINS_SELECTED);
      return;
    } else {
      addActionError.set("");
    }

    let command = "";

    if (fungibleAddress !== "") {
      if (!fungibleQuantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
        addActionError.set("invalid quantity!");
      } else {
        var q = parseFloat(fungibleQuantity);
        if (q > 0) {
          if (q > fungibles.get(fungibleAddress)!.amount) {
            q = fungibles.get(fungibleAddress)!.amount;
          }
          command = commands.withdraw(accountAddress, fungibleAddress, q);

          worktop.addFungible(fungibles.get(fungibleAddress)!);
          accounts.removeFungible(accountAddress, fungibleAddress, q);
          resetSelectors();
        }
      }
    } else if (nonFungibleKey !== "") {
      const nonFungible = nonFungibles.get(nonFungibleKey)!;
      command = commands.withdrawNonFungibles(
        accountAddress,
        nonFungible.address,
        nonFungible.id
      );
      worktop.addNonFungible(nonFungibles.get(nonFungibleKey)!);
      accounts.removeNonFungible(accountAddress, nonFungibleKey);
      resetSelectors();
    } else {
      addActionError.set(NO_COINS_SELECTED);
      return;
    }

    manifest.update((m) => m + command);
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
          <option value={nonFungible.key}
            >{`${nonFungible.symbol} ${nonFungible.id}`}</option
          >
        {/each}
      </select>
    </label>
  </div>

  <div>
    <AddActionButton {handleAddAction} />
  </div>
</div>
