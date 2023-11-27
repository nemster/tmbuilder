<script lang="ts">
  export let accountAddress: string | null;
  import { accounts } from "../stores/accounts";
  export let label = "Account";

  $: if ($accounts.size > 0 && !accountAddress) {
    const [firstKey] = $accounts.keys();
    accountAddress = firstKey;
  }
</script>

<label class="label">
  <span class="label-text">{label}</span>
  <select
    class="select select-secondary select-sm w-3/5 text-end"
    bind:value={accountAddress}
  >
    {#each Array.from($accounts.values()) as account}
      <option value={account.address}>{account.label}</option>
    {/each}
  </select>
</label>
