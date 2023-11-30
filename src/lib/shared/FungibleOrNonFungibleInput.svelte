<script lang="ts">
  import {
    UNKNOWN_QUANTITY,
    type WalletFungible,
    type WalletNonFungible,
  } from "../stores/accounts";
  import {
    INVALID_QUANTITY,
    NO_COINS_SELECTED,
    actionError,
    isValidQuantity,
  } from "../stores/errors";
  import QuantityInput from "./QuantityInput.svelte";

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

  $: if (fungibleQuantity !== "" && isValidQuantity(fungibleQuantity)) {
    actionError.set(INVALID_QUANTITY);
  }
  $: if (
    $actionError === INVALID_QUANTITY &&
    (fungibleQuantity === "" || isValidQuantity(fungibleQuantity))
  ) {
    actionError.set("");
  }

  function handleFungibleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    fungibleAddress = target?.value;
    if (fungibleAddress !== "") {
      const fungibleAmount = fungibles.get(fungibleAddress)?.amount;
      if (fungibleAmount === UNKNOWN_QUANTITY) {
        fungibleQuantity = UNKNOWN_QUANTITY;
      } else if (fungibleAmount !== undefined) {
        fungibleQuantity = fungibleAmount.toString();
      }
      if ($actionError === NO_COINS_SELECTED) {
        actionError.set("");
      }
    } else {
      fungibleQuantity = "";
    }
  }

  function handleNonFungibleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    nonFungibleKey = target?.value;
    if (nonFungibleKey) {
      if ($actionError === NO_COINS_SELECTED) {
        actionError.set("");
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
  <QuantityInput bind:value={fungibleQuantity} hidden={allFungible} />
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
