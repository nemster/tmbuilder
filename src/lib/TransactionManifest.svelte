<script lang="ts">
  import { manifest } from "./stores/transaction";
</script>

<div class="relative my-6">
  <div class="absolute right-1 -top-6 text flex font-thin">
    <div>transaction manifest</div>
  </div>
  <textarea
    id="transaction_manifest"
    class="textarea bg-neutral not-prose"
    value={$manifest}
    readonly
  />
  <button
    id="send_to_wallet"
    class="absolute btn-accent my-4 z-10 right-4 bottom-1 btn whitespace-nowrap uppercase"
  >
    send to wallet
  </button>
</div>

<style>
  #transaction_manifest {
    width: 100%;
    min-height: 32em;
    height: fit-content;
  }
</style>
