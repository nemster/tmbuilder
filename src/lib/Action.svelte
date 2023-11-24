<script lang="ts">
  import TakeCoinsFromSelf from "./actions/TakeCoinsFromSelf.svelte";
  import SendCoinsToSelf from "./actions/SendCoinsToSelf.svelte";
  import SendCoinsToAccount from "./actions/SendCoinsToAccount.svelte";
  import AirdropFungibleCoins from "./actions/AirdropFungibleCoins.svelte";
  import Error from "./Error.svelte";
  import StakeYourXrDs from "./actions/StakeYourXRDs.svelte";
  import UnstakeYourLSUs from "./actions/UnstakeYourLSUs.svelte";
  import ClaimYourUnstakedXRDs from "./actions/ClaimYourUnstakedXRDs.svelte";
  import SwapCoinsAtOciswap from "./actions/SwapCoinsAtOciswap.svelte";
  import AddLiquidityToOciswap from "./actions/AddLiquidityToOciswap.svelte";

  let actions = {
    takeCoinsFromSelf: {
      component: TakeCoinsFromSelf,
      description: "take coins from your account",
      disabled: false,
    },
    sendCoinsLabel: {
      component: null,
      description: "--- SEND COINS ---",
      disabled: true,
    },
    sendCoinsToSelf: {
      component: SendCoinsToSelf,
      description: "send coins to your account",
      disabled: false,
    },
    sendCoinsToAccount: {
      component: SendCoinsToAccount,
      description: "send coins to someone else's account",
      disabled: false,
    },
    airdropFungibleCoins: {
      component: AirdropFungibleCoins,
      description: "airdrop fungible coins",
      disabled: false,
    },
    stakeUnstakeLabel: {
      component: null,
      description: "--- STAKE/UNSTAKE ---",
      disabled: true,
    },
    stakeYourXRDs: {
      component: StakeYourXrDs,
      description: "stake your XRDs",
      disabled: false,
    },
    unstakeYourLSUs: {
      component: UnstakeYourLSUs,
      description: "unstake your LSUs",
      disabled: false,
    },
    claimYourUnstakedXRDs: {
      component: ClaimYourUnstakedXRDs,
      description: "claim your unstaked XRDs",
      disabled: false,
    },
    ociswapLabel: {
      component: null,
      description: "--- OCISWAP ---",
      disabled: true,
    },
    ociswapSwapCoins: {
      component: SwapCoinsAtOciswap,
      description: "swap coins at Ociswap",
      disabled: false,
    },
    addLiquidityToOciswap: {
      component: AddLiquidityToOciswap,
      description: "add liquidity to Ociswap",
      disabled: false,
    },
  };

  /**
   *  
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

  let selectedAction = actions.takeCoinsFromSelf;
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
