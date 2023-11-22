<script lang="ts">
  import { INVALID_ACCOUNT, actionError } from "../stores/errors";

  export let accountAddress: string | null;

  $: if (accountAddress && accountAddress.length > 0) {
    accountAddress = accountAddress.toLowerCase();

    if (!accountAddress.match(/^account_rdx1[0-9a-z]{54}$/)) {
      actionError.set(INVALID_ACCOUNT);
    }
  }

  $: if (accountAddress === "" && $actionError === INVALID_ACCOUNT) {
    actionError.set("");
  }
</script>

<label class="label">
  <span class="label-text">Account</span>
  <input
    class="input input-secondary input-sm w-3/5 text-end"
    type="text"
    placeholder="account_rdx1..."
    bind:value={accountAddress}
  />
</label>
