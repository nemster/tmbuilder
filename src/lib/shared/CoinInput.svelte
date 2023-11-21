<script lang="ts">
  import { number_to_string } from "../../content";
  import { NO_COINS_SELECTED, addActionError } from "../stores/errors";
  import type { WalletFungible, WalletNonFungible } from "../stores/accounts";

  export let fungibleAddress: string;
  export let fungibles: Map<string, WalletFungible>;
  export let fungibleQuantity: string;
  export let allFungible: boolean = false;
  export let nonFungibles: Map<string, WalletNonFungible>;
  export let nonFungibleKey: string;

  let fungibleSelect: HTMLSelectElement | null = null;
  let nonFungibleSelect: HTMLSelectElement | null = null;

  function clearNonFungibles() {
    if (fungibleSelect && nonFungibleSelect) {
      if (fungibleSelect.value !== "") {
        nonFungibleSelect.value = "";
        nonFungibleSelect.dispatchEvent(new Event("change"));
      }
    }
  }
  function clearFungibles() {
    if (fungibleSelect && nonFungibleSelect) {
      if (nonFungibleSelect.value !== "") {
        fungibleSelect.value = "";
        fungibleSelect.dispatchEvent(new Event("change"));
      }
    }
  }

  $: if (fungibleAddress === "") {
    fungibleQuantity = "";
  }

  function handleFungibleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    fungibleAddress = target?.value;
    if (fungibleAddress !== "") {
      fungibleQuantity = number_to_string(
        fungibles.get(fungibleAddress)?.amount || 0
      );
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
      if ($addActionError === NO_COINS_SELECTED) {
        addActionError.set("");
      }
    }
  }
</script>

<div class="form-control">
  <label class="label">
    <span class="label-text">Fungibles</span>
    <select
      bind:this={fungibleSelect}
      bind:value={fungibleAddress}
      class="select select-secondary select-sm w-3/5 text-end"
      on:change={handleFungibleChange}
      on:change|self={clearNonFungibles}
    >
      <option value={""} />
      {#each Array.from(fungibles.values()) as fungible}
        <option value={fungible.address}>{fungible.symbol}</option>
      {/each}
    </select>
  </label>
  <label class={`label pt-0 ${allFungible ? "hidden" : ""}`}>
    <span class="label-text">Quantity</span>
    <input
      class="input bg-secondary input-sm w-3/5 text-end"
      type="text"
      disabled={allFungible}
      bind:value={fungibleQuantity}
    /></label
  >
</div>

<label class="label">
  <span class="label-text">Non fungibles</span>
  <select
    bind:this={nonFungibleSelect}
    bind:value={nonFungibleKey}
    class="select select-secondary select-sm w-3/5 text-end"
    on:change={handleNonFungibleChange}
    on:change|self={clearFungibles}
  >
    <option value={""} />
    {#each Array.from(nonFungibles.values()) as nonFungible}
      <option value={nonFungible.key}
        >{`${nonFungible.symbol} ${nonFungible.id}`}</option
      >
    {/each}
  </select>
</label>
