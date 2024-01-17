<script lang="ts">
  import { actionError, validationErrors, DONE } from "./stores/errors";
  let hidden = "";

  let errorToShow = "";

  $: if ($actionError !== "") {
    if ($actionError !== DONE) {
      errorToShow = $actionError;
    }
  } else if ($validationErrors.size > 0) {
    errorToShow = $validationErrors.values().next().value;
  } else {
    errorToShow = "";
  }

  $: if (errorToShow === "") {
    hidden = "hidden";
  } else {
    hidden = "";
  }
</script>

<div
  role="alert"
  class={`m-1 flex items-center p-2 space-x-2 bg-error text-error-content rounded-box ${hidden}`}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="stroke-current shrink-0 h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    ><path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    /></svg
  >

  <span class="text-center">{errorToShow}</span>
</div>
