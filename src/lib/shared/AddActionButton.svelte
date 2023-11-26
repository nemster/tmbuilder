<script lang="ts">
  import { actionError } from "../stores/errors";

  export let handleAddAction: () => void;
  function tryHandleAddAction() {
    try {
      handleAddAction();
    } catch (e: any) {
      actionError.set(e.message);
    }
  }
</script>

<button
  type="button"
  class="btn whitespace-nowrap uppercase"
  on:click={tryHandleAddAction}
  >add instruction
</button>
