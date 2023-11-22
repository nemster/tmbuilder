<script lang="ts">
  export let accountAddress: string | null;
  export let showLabel: boolean = true;
</script>

<label class="label">
  {#if showLabel}
    <span class="label-text">Account</span>
  {/if}
  <input
    class={`input input-secondary bg-secondary input-sm ${
      showLabel ? "w-3/5" : "w-full"
    } text-end`}
    type="text"
    placeholder="account_rdx1..."
    bind:value={accountAddress}
  />
</label>
