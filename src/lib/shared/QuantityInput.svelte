<script lang="ts">
  export let hidden = false;
  export let value = "";
  export let label = "Quantity";
  export let classes = "";
  export let disabled = false;
</script>

<label class={`label pt-0 ${hidden ? "hidden" : ""} ${classes}`}>
  <span class="label-text">{label}</span>
  <input
    class="input input-secondary bg-secondary input-sm w-3/5 text-end"
    type="text"
    {disabled}
    bind:value
  /></label
>
