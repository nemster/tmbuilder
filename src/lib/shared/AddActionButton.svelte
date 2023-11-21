<script lang="ts">
  export let handleAddAction: () => void;
</script>

<button
  type="button"
  class="btn whitespace-nowrap uppercase"
  on:click={handleAddAction}
  >add instruction
</button>
