<script lang="ts">
  export let handleAddAction: () => void;
</script>

<button type="button" class="btn" on:click={handleAddAction}
  >add instruction
</button>
