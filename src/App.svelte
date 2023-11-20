<script lang="ts">
  import { initContent } from "./content";
  import { onMount } from "svelte";

  import Action from "./lib/Action.svelte";
  import Navbar from "./lib/Navbar.svelte";
  import Footer from "./lib/Footer.svelte";
  import Worktop from "./lib/Worktop.svelte";

  onMount(() => {
    initContent();
  });
</script>

<main class="prose max-w-none">
  <div class="flex flex-col h-screen">
    <div class="max-w-screen-lg mx-auto flex-grow">
      <Navbar />

      <div class="flex flex-col space-y-12">
        <Action />

        <Worktop />

        <div class="relative my-6">
          <div class="absolute right-1 -top-6 text flex font-thin">
            <div>transaction manifest</div>
          </div>
          <textarea
            class="textarea bg-neutral not-prose"
            id="transaction_manifest"
            rows="20"
            cols="85"
          />
          <div class="btn absolute btn-accent my-4 z-10 right-4 bottom-1">
            <input type="button" value="send to wallet" id="send_to_wallet" />
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</main>
