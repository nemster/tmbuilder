<script lang="ts">
  export let fail: "refund" | "abort";
</script>

<label class="label">
  <span class="label-text">If deposit fails</span>
  <select
    class="select select-secondary select-sm w-3/5 text-end"
    bind:value={fail}
  >
    <option value="refund">continue</option>
    <option value="abort">abort transaction</option>
  </select>
</label>
