<script lang="ts">
  import { onMount } from "svelte";
  import { accounts } from "../stores/accounts";
  import { worktop } from "../stores/worktop";
  import { manifest } from "../stores/transaction";
  import type { WalletFungible, WalletNonFungible } from "../stores/accounts";
  import AddActionButton from "../shared/AddActionButton.svelte";
  import { NO_COINS_SELECTED, addActionError } from "../stores/errors";
  import commands from "../commands";
  import CoinInput from "../shared/CoinInput.svelte";
  import AccountSelect from "../shared/AccountSelect.svelte";

  onMount(() => {
    addActionError.set("");
  });

  let accountAddress: string | null = null;
  let fungibles: Map<string, WalletFungible> = new Map();
  let fungibleAddress: string;
  let fungibleQuantity = "";

  let nonFungibles: Map<string, WalletNonFungible> = new Map();
  let nonFungibleKey: string;

  $: if (accountAddress) {
    fungibles = $accounts.get(accountAddress)!.fungibles;
    nonFungibles = $accounts.get(accountAddress)!.nonFungibles;
  }

  function handleAddAction() {
    if ($addActionError !== "") {
      return;
    }
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
        return;
      } else {
        var q = parseFloat(fungibleQuantity);
        if (q > 0) {
          if (q > fungibles.get(fungibleAddress)!.amount) {
            q = fungibles.get(fungibleAddress)!.amount;
          }
          command = commands.withdraw(accountAddress, fungibleAddress, q);
          const f = fungibles.get(fungibleAddress);
          if (!f) {
            console.error(
              `Could not find fungible resource ${fungibleAddress}`
            );
            return;
          }
          const fungibleForWorktop: WalletFungible = {
            ...f,
            amount: parseFloat(fungibleQuantity),
          };
          worktop.addFungible(fungibleForWorktop);
          accounts.removeFungible(accountAddress, fungibleAddress, q);
          fungibleAddress = "";
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
    } else {
      addActionError.set(NO_COINS_SELECTED);
      return;
    }

    manifest.update((m) => m + command);
  }
</script>

<div class="flex space-x-12 w-full place-items-end">
  <div class="form-control flex-grow space-y-2">
    <AccountSelect bind:accountAddress />
    <CoinInput
      {fungibles}
      bind:fungibleAddress
      bind:fungibleQuantity
      {nonFungibles}
      bind:nonFungibleKey
    />
  </div>

  <div>
    <AddActionButton {handleAddAction} />
  </div>
</div>
