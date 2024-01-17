<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import commands from "../commands";
  import AccountInput from "../shared/AccountInput.svelte";
  import AccountSelect from "../shared/AccountSelect.svelte";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import { UNKNOWN_QUANTITY, accounts } from "../stores/accounts";
  import {
    NO_ACCOUNT,
    NO_COINS_SELECTED,
    NO_QUANTITY,
    actionError,
    validationErrors,
    validateAvailableFungibles,
    validateMultipleAccounts,
    validateQuantity,
  } from "../stores/errors";
  import { bucketNumber, manifest } from "../stores/transaction";
  import { worktop } from "../stores/worktop";
  import QuantityInput from "../shared/QuantityInput.svelte";
  import PrecisionNumber from "../PrecisionNumber";

  let fungibleAddress: string;
  let quantity = "";
  let maxQuantity: PrecisionNumber | undefined = undefined;

  let accountAddresses = [""];
  let remainingsAccountAddress = "";

  function addAccountInput() {
    accountAddresses = [...accountAddresses, ""];
  }

  function removeAccountInput(index: number) {
    accountAddresses = accountAddresses.filter((_, i) => i !== index);
  }

  onMount(() => {
    actionError.set("");
  });

  afterUpdate(() => {
    validateQuantity(quantity, maxQuantity);
    validateAvailableFungibles();
    validateMultipleAccounts(accountAddresses);
  });

  onDestroy(() => {
    validationErrors.clear();
  });

  $: if (fungibleAddress !== "") {
    const nAddresses = new PrecisionNumber(
      accountAddresses.filter((a) => a !== "").length
    );

    const amount = $worktop.fungibles.get(fungibleAddress)?.amount;
    if (amount !== undefined && amount !== UNKNOWN_QUANTITY) {
      maxQuantity = amount.dividedBy(nAddresses);
    }
  }

  async function handleAddAction() {
    actionError.set("");
    if ($validationErrors.size > 0) {
      return;
    }

    // filter out empty addresses
    let recipients = accountAddresses.filter((a) => a !== "");

    if (recipients.length === 0) {
      actionError.set(NO_ACCOUNT);
      return;
    }

    if (fungibleAddress === "") {
      actionError.set(NO_COINS_SELECTED);
      return;
    }

    if (quantity === "") {
      actionError.set(NO_QUANTITY);
      return;
    }

    let q = new PrecisionNumber(quantity);
    for (let recipient of recipients) {
      const command = commands.trySendAmountFungibleToAccount(
        recipient,
        fungibleAddress,
        q,
        $bucketNumber,
        "refund"
      );
      manifest.update((m) => m + command);
      bucketNumber.increment();
      worktop.removeFungible(fungibleAddress, q);
    }

    // put remainings in remainingsAccountAddress
    const remainingFungible = $worktop.fungibles.get(fungibleAddress);
    if (remainingFungible && remainingsAccountAddress !== "") {
      const putToBucket = commands.putAllResourceToBucket(
        fungibleAddress,
        $bucketNumber
      );
      const sendToAccount = commands.sendBucketToAccount(
        remainingsAccountAddress,
        $bucketNumber
      );
      manifest.update((m) => m + putToBucket + sendToAccount);
      bucketNumber.increment();
      accounts.addFungible(
        remainingsAccountAddress,
        fungibleAddress,
        remainingFungible.amount
      );
      worktop.removeAllFungible(fungibleAddress);
    }

    accountAddresses = [""];
    quantity = "";

    return;
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <label class="label">
      <span class="label-text">Coin</span>
      <select
        bind:value={fungibleAddress}
        class="select select-secondary select-sm w-3/5 text-end"
      >
        <option value={""} />
        {#each Array.from($worktop.fungibles.values()) as fungible}
          <option value={fungible.address}>{fungible.symbol}</option>
        {/each}
      </select>
    </label>
    <QuantityInput bind:value={quantity} label="Quantity per recipient" />

    <div class="p-2 rounded-box border-2 border-secondary border-dotted">
      <label class="label cursor-pointer pr-0">
        <span class="label-text text-sm">Recipients</span>
        <button on:click={addAccountInput} class="btn btn-ghost btn-sm my-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-auto"
            viewBox="0 0 448 512"
            {...$$props}
            ><path
              fill="currentColor"
              d="M64 80c-8.8 0-16 7.2-16 16v320c0 8.8 7.2 16 16 16h320c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96c0-35.3 28.7-64 64-64h320c35.3 0 64 28.7 64 64v320c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm200 248v-64h-64c-13.3 0-24-10.7-24-24s10.7-24 24-24h64v-64c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24h-64v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
            /></svg
          >
        </button>
      </label>

      {#each accountAddresses as accountAddress, index (index)}
        <div class="flex">
          <span class="flex-grow"
            ><AccountInput bind:accountAddress showLabel={false} /></span
          >
          <button
            class="btn btn-ghost btn-sm my-auto"
            on:click={() => removeAccountInput(index)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-auto"
              viewBox="0 0 448 512"
              ><path
                fill="currentColor"
                d="m170.5 51.6l-19 28.4h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6h-93.7c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6l36.7 55H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128H80zm80 64v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0v208c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"
              /></svg
            >
          </button>
        </div>
      {/each}
    </div>

    <AccountSelect
      label="Send remainings to"
      bind:accountAddress={remainingsAccountAddress}
    />
  </div>

  <AddActionButton {handleAddAction} />
</div>
