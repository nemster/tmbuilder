<script lang="ts">
  import TakeCoinsFromSelf from "./actions/TakeCoinsFromSelf.svelte";
  import SendCoinsToSelf from "./actions/SendCoinsToSelf.svelte";
  import SendCoinsToAccount from "./actions/SendCoinsToAccount.svelte";
  import AirdropFungibleCoins from "./actions/AirdropFungibleCoins.svelte";
  import Error from "./Error.svelte";
  import StakeYourXRDs from "./actions/StakeYourXRDs.svelte";
  import UnstakeYourLSUs from "./actions/UnstakeYourLSUs.svelte";
  import ClaimYourUnstakedXRDs from "./actions/ClaimYourUnstakedXRDs.svelte";
  import SwapCoinsAtOciswap from "./actions/SwapCoinsAtOciswap.svelte";
  import AddLiquidityToOciswap from "./actions/AddLiquidityToOciswap.svelte";
  import WithdrawLiquidityFromOciswap from "./actions/WithdrawLiquidityFromOciswap.svelte";
  import AddYourLSUsToCaviarnine from "./actions/AddYourLSUsToCaviarnine.svelte";
  import RetrieveLSUsFromCaviarnine from "./actions/RetrieveLSUsFromCaviarnine.svelte";
  import SwapLSUsOnCaviarnine from "./actions/SwapLSUsOnCaviarnine.svelte";
  import GableGetFlashloan from "./actions/GableGetFlashloan.svelte";
  import GableRepayFlashloan from "./actions/GableRepayFlashloan.svelte";
  import GableProvideLiquidity from "./actions/GableProvideLiquidity.svelte";
  import DefiplazaSwapCoins from "./actions/DefiplazaSwapCoins.svelte";
  import AlfadexSwapCoins from "./actions/AlfadexSwapCoins.svelte";
  import RadixplanetSwapCoins from "./actions/RadixplanetSwapCoins.svelte";
  import RedeemYourWeft from "./actions/RedeemYourWeft.svelte";

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
      component: StakeYourXRDs,
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
    withdrawLiquidityFromOciswap: {
      component: WithdrawLiquidityFromOciswap,
      description: "withdraw liquidity from Ociswap",
      disabled: false,
    },
    caviarNineLabel: {
      component: null,
      description: "--- CAVIARNINE ---",
      disabled: true,
    },
    addYourLSUsToCaviarnine: {
      component: AddYourLSUsToCaviarnine,
      description: "add your LSUs in Caviarnine LSU pool",
      disabled: false,
    },
    retrieveLSUsFromCaviarnine: {
      component: RetrieveLSUsFromCaviarnine,
      description: "retrieve LSUs from Caviarnine LSU pool",
      disabled: false,
    },
    swapLSUsOnCaviarnine: {
      component: SwapLSUsOnCaviarnine,
      description: "swap LSUs on Caviarnine",
      disabled: false,
    },
    gableLabel: {
      component: null,
      description: "--- GABLE ---",
      disabled: true,
    },
    gableGetFlashloan: {
      component: GableGetFlashloan,
      description: "get flashloan",
      disabled: false,
    },
    gableRepayFlashloan: {
      component: GableRepayFlashloan,
      description: "repay flashloan",
      disabled: false,
    },
    gableProvideLiquidity: {
      component: GableProvideLiquidity,
      description: "provide liquidity to Gable",
      disabled: false,
    },
    defiplazaLabel: {
      component: null,
      description: "--- DEFIPLAZA ---",
      disabled: true,
    },
    defiplazaSwapCoins: {
      component: DefiplazaSwapCoins,
      description: "swap coins at DefiPlaza",
      disabled: false,
    },
    alfadexLabel: {
      component: null,
      description: "--- ALPHADEX ---",
      disabled: true,
    },
    alfadexSwapCoins: {
      component: AlfadexSwapCoins,
      description: "swap coins at AlphaDEX",
      disabled: false,
    },
    radixplanetLabel: {
      component: null,
      description: "--- RADIXPLANET ---",
      disabled: true,
    },
    radixplanetSwapCoins: {
      component: RadixplanetSwapCoins,
      description: "swap coins at RadixPlanet",
      disabled: false,
    },
    weftLabel: {
      component: null,
      description: "--- WEFT ---",
      disabled: true,
    },
    redeemYourWeft: {
      component: RedeemYourWeft,
      description: "redeem your WEFT",
      disabled: false,
    },
  };

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
