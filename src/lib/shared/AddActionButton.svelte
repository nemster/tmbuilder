<script lang="ts">
  import { actionError } from "../stores/errors";

  export let handleAddAction: () => Promise<void>;
  async function tryHandleAddAction() {
    try {
      await handleAddAction();
    } catch (e: unknown) {
      if (e instanceof Error) {
        actionError.set(e.message);
      }
      throw e;
    }
  }
</script>

<button
  type="button"
  class="btn whitespace-nowrap uppercase"
  on:click={tryHandleAddAction}
  >add instruction
</button>
