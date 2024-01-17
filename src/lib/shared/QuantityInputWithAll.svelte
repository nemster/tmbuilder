<script lang="ts">
  export let hidden = false;
  export let value = "";
  export let label = "Quantity";
  export let classes = "";
  export let all: boolean;

  let inputDisabled = true;
  $: inputDisabled = all;
</script>

<label class={`label pt-0 ${hidden ? "hidden" : ""} ${classes}`}>
  <span class="label-text">{label}</span>
  <div class="flex flex-row justify-between w-3/5 space-x-2 place-items-center">
    <input
      class="input input-secondary bg-secondary input-sm min-w-0 w-full text-end"
      type="text"
      disabled={inputDisabled}
      bind:value
    />
    <label class={`label cursor-pointer space-x-4`}>
      <span class="label-text">all</span>
      <input bind:checked={all} type="checkbox" class="checkbox" />
    </label>
  </div>
</label>
