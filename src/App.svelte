<script lang="ts">
  import { initContent } from "./content";
  import { onMount } from "svelte";

  import Action from "./lib/Action.svelte";
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
    <div class="max-w-screen-md mx-auto flex-grow">
      <Navbar />
      <div class="flex flex-col space-y-12 px-4 w-full">
        <Action />
        <Worktop />
        <TransactionManifest />
      </div>
    </div>
    <Footer />
  </div>
</main>
