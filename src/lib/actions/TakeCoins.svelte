<script lang="ts">
  import { onMount } from "svelte";
  import {
    add_fungible_to_worktop,
    add_non_fungible_to_worktop,
    find_fungible_symbol,
    find_non_fungible_symbol,
    fungibles_in_accounts,
    non_fungibles_in_accounts,
    number_to_string,
    remove_fungible_from_account,
  } from "../../content";
  import { accounts } from "../stores/accounts";

  function withdrawString(account: string, resource: string, q: number) {
    return `CALL_METHOD
    Address("${account}")
    "withdraw"
    Address("${resource}")
    Decimal("${q}")
;
`;
  }

  let selectedAccount: { address: string; label: string };

  let fungibles: Map<string, number> = new Map();
  let selectedFungible: string | null = null;
  let fungibleQuantity = "";

  let nonFungibles: string[] = [];
  let selectedNonFungible: string | null = null;

  // $: means react on changes to variables in scope
  $: {
    if (selectedAccount) {
      // TODO: move to store, the updates are not currently working
      if (fungibles_in_accounts) {
        for (const [key, value] of Object.entries(
          fungibles_in_accounts[selectedAccount.address]
        )) {
          fungibles.set(key, value);
        }
      }

      if (non_fungibles_in_accounts) {
        nonFungibles = non_fungibles_in_accounts[selectedAccount.address];
      }
    }
  }

  $: {
    // only one or the other at a time, TODO: show visually
    if (selectedFungible) {
      selectedNonFungible = null;
      fungibleQuantity = number_to_string(fungibles.get(selectedFungible) || 0);
    } else if (selectedNonFungible) {
      selectedFungible = null;
    }
    if ($accounts.length > 0) {
      selectedAccount = $accounts[0];
    }
  }

  onMount(() => {
    document
      .querySelector<HTMLButtonElement>("#add_instruction1")!
      .addEventListener("click", function () {
        // TODO: refactor validation
        if (!selectedFungible && !selectedNonFungible) {
          document.querySelector<HTMLParagraphElement>("#warn")!.innerText =
            "no coins selected";
          return false;
        } else {
          document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
            "&nbsp;";
        }

        if (selectedFungible !== null) {
          if (!fungibleQuantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
            document.querySelector<HTMLParagraphElement>("#warn")!.innerText =
              "invalid quantity!";
          } else {
            var q = parseFloat(fungibleQuantity);
            if (q > 0) {
              const resource = selectedFungible;
              const account = selectedAccount.address;
              if (q > fungibles_in_accounts[account][resource]) {
                q = fungibles_in_accounts[account][resource];
              }
              document.querySelector<HTMLTextAreaElement>(
                "#transaction_manifest"
              )!.value += withdrawString(account, resource, q);
              add_fungible_to_worktop(resource, q);
              remove_fungible_from_account(account, resource, q);
            }
          }
        }

        if (selectedNonFungible !== null) {
          const non_fungible = selectedNonFungible.split(" ");
          const account = selectedAccount.address;
          document.querySelector<HTMLTextAreaElement>(
            "#transaction_manifest"
          )!.value +=
            "CALL_METHOD\n" +
            '    Address("' +
            account +
            '")\n' +
            '    "withdraw_non_fungibles"\n' +
            '    Address("' +
            non_fungible[0] +
            '")\n' +
            '    Array<NonFungibleLocalId>(\n        NonFungibleLocalId("' +
            non_fungible[1] +
            '")\n    )\n;\n';
          add_non_fungible_to_worktop(selectedNonFungible);
          const i =
            non_fungibles_in_accounts[account].indexOf(selectedNonFungible);
          if (i != -1) {
            non_fungibles_in_accounts[account].splice(i, 1);
          }
        }

        document
          .querySelector<HTMLSelectElement>("#account1")!
          .dispatchEvent(new Event("change"));
      });
  });
</script>

<div id="div1" class="flex space-x-24">
  <div class="flex flex-col">
    <label>
      Account
      <select
        id="account1"
        class="select select-secondary select-xs"
        bind:value={selectedAccount}
      >
        {#each $accounts as account}
          <option value={account}>{account.label}</option>
        {/each}
      </select>
    </label>

    <label class="flex space-x-2"
      >Fungibles
      <select
        id="fungible1"
        class="select select-secondary select-xs"
        bind:value={selectedFungible}
      >
        <option value={null} />
        {#each Array.from(fungibles) as [symbol, _]}
          <option value={symbol}>{find_fungible_symbol(symbol)}</option>
        {/each}
      </select>

      <label>
        Quantity
        <input
          class="input bg-secondary input-xs"
          type="text"
          id="quantity1"
          bind:value={fungibleQuantity}
        /></label
      >
    </label>

    <label>
      Non fungibles:
      <select
        id="non_fungible1"
        class="select select-secondary select-xs"
        bind:value={selectedNonFungible}
      >
        <option value={null} />
        {#each nonFungibles as nonFungible}
          <option value={nonFungible}
            >{find_non_fungible_symbol(nonFungible)}</option
          >
        {/each}
      </select>
    </label>
  </div>
  <div>
    <input
      type="button"
      class="btn"
      value="add instruction"
      id="add_instruction1"
    />
  </div>
</div>
