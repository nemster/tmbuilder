<script lang="ts">
  import { manifest } from "./stores/transaction";

  let textToCopy = "";

  $: textToCopy = $manifest;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error("Failed to copy to clipboard: ", err);
    }
  }
</script>

<div
  class="flex-grow bg-neutral text-base-content rounded-lg flex flex-col border border-accent"
>
  <div class="flex space-x-2 border-b border-accent border-dashed">
    <button
      class="btn btn-ghost my-auto rounded-none rounded-tl-lg"
      on:click={copyToClipboard}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-auto"
        viewBox="0 0 448 512"
        ><path
          fill="currentColor"
          d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h140.1l67.9 67.9V320c0 8.8-7.2 16-16 16m-192 48h192c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9l-67.8-67.9c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64v256c0 35.3 28.7 64 64 64M64 128c-35.3 0-64 28.7-64 64v256c0 35.3 28.7 64 64 64h192c35.3 0 64-28.7 64-64v-32h-48v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16h32v-48z"
        /></svg
      >
    </button>
    <div class="font-bold text-xl my-auto flex-grow">
      <div>Transaction Manifest</div>
    </div>

    <button
      id="send_to_wallet"
      class="btn btn-accent right-4 bottom-1 whitespace-nowrap uppercase rounded-none rounded-tr-lg"
    >
      send to wallet
    </button>
  </div>
  <textarea
    id="transaction_manifest"
    class="textarea not-prose bg-neutral rounded-none flex-grow rounded-b-lg"
    bind:value={textToCopy}
    readonly
  />
</div>
