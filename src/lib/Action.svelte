<script lang="ts">
  import TakeCoinsFromSelf from "./actions/TakeCoinsFromSelf.svelte";
  import SendCoinsToSelf from "./actions/SendCoinsToSelf.svelte";
  import SendCoinsToAccount from "./actions/SendCoinsToAccount.svelte";
  import Error from "./Error.svelte";

  let actions = {
    TakeCoinsFromSelf: {
      component: TakeCoinsFromSelf,
      description: "take coins from your account",
      disabled: false,
    },
    sendCoinsLabel: {
      component: null,
      description: "--- SEND COINS ---",
      disabled: true,
    },
    SendCoinsToSelf: {
      component: SendCoinsToSelf,
      description: "send coins to your account",
      disabled: false,
    },
    SendCoinsToAccount: {
      component: SendCoinsToAccount,
      description: "send coins to someone else's account",
      disabled: false,
    },
  };

  /**
   *  
        <option>airdrop fungible coins</option>
        <option disabled>--- STAKE/UNSTAKE ---</option>
        <option>stake your XRDs</option>
        <option>unstake your LSUs</option>
        <option>claim your unstaked XRDs</option>
        <option disabled>--- OCISWAP ---</option>
        <option>swap coins at Ociswap</option>
        <option>add liquidity to Ociswap</option>
        <option>withdraw liquidity from Ociswap</option>
        <option disabled>--- CAVIARNINE ---</option>
        <option>add your LSUs in Caviarnine LSU pool</option>
        <option>retrieve LSUs from Caviarnine LSU pool</option>
        <option>swap LSUs on Caviarnine</option>
        <option disabled>--- GABLE ---</option>
        <option>get flashloan</option>
        <option>repay flashloan</option>
        <option>provide liquidity to Gable</option>
        <option disabled>--- DEFIPLAZA ---</option>
        <option>swap coins at DefiPlaza</option>
        <option disabled>--- ALPHADEX ---</option>
        <option>swap coins at AlphaDEX</option>
        <option disabled>--- RADIXPLANET ---</option>
        <option>swap coins at RadixPlanet</option>
        <option disabled>--- WEFT ---</option>
        <option>redeem your WEFT</option>
   */

  let selectedAction = actions.TakeCoinsFromSelf;
</script>

<div
  class="flex flex-col rounded-box border-dashed border-4 border-accent p-4 space-y-2"
>
  <div class="flex space-x-4 justify-between w-full">
    <div class="flex flex-1 justify-start min-w-0">
      <Error />
    </div>

    <div class="flex flex-1 justify-end">
      <select
        bind:value={selectedAction}
        id="action"
        class="select select-gohst text-accent text-end text-lg"
      >
        {#each Object.values(actions) as action}
          <option value={action} disabled={action.disabled}>
            {action.description}
          </option>
        {/each}
      </select>
    </div>
  </div>

  <div class="w-full ml-2">
    <svelte:component this={selectedAction.component} />
  </div>
</div>
