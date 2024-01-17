<script lang="ts">
  import { initContent } from "./content";
  import { onMount } from "svelte";

  import Actions from "./lib/Actions.svelte";
  import Navbar from "./lib/Navbar.svelte";
  import Footer from "./lib/Footer.svelte";
  import Worktop from "./lib/Worktop.svelte";
  import TransactionManifest from "./lib/TransactionManifest.svelte";

  onMount(() => {
    initContent();
  });
</script>

<main class="prose max-w-none">
  <div class="flex flex-col h-screen">
    <div class="flex-grow p-4 flex flex-col">
      <Navbar />
      <div class="flex space-x-2 flex-grow">
        <div class="basis-5/12">
          <Actions />
        </div>
        <div class="basis-7/12 flex flex-col space-y-2">
          <Worktop />
          <TransactionManifest />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</main>
