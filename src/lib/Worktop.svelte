<script lang="ts">
  import { worktop } from "./stores/worktop";
  let text = "";

  // $: console.log($worktop);
  let fungiblesText = "";
  let nonFungiblesText = "";

  $: fungiblesText = [...$worktop.fungibles.values()]
    .map((f) => `${f.symbol} ${f.amount}`)
    .join("\n");

  $: nonFungiblesText = [...$worktop.nonFungibles.values()]
    .map((n) => `${n.symbol} ${n.id}`)
    .join("\n");

  $: text = fungiblesText + "\n" + nonFungiblesText;
</script>

<div class="relative">
  <div class="absolute right-2 top-2 text flex text-secondary italic">
    <div>worktop</div>
  </div>
  <textarea
    id="worktop"
    value={text}
    class="textarea bg-base-300 border border-secondary"
    readonly
  />
</div>

<style>
  #worktop {
    width: 100%;
    min-height: 16em;
  }
</style>
