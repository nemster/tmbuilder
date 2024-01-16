<script lang="ts">
  import TakeCoinsFromSelf from "./actions/TakeCoinsFromSelf.svelte";
  import SendCoinsToSelf from "./actions/SendCoinsToSelf.svelte";
  import SendCoinsToAccount from "./actions/SendCoinsToAccount.svelte";
  import AirdropFungibleCoins from "./actions/AirdropFungibleCoins.svelte";
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
  import ActionError from "./ActionError.svelte";
  import { onMount } from "svelte";

  interface Action {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: any;
    title: string;
    disabled: boolean;
    selected: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function createAction(component: any, title: string): Action {
    return {
      component,
      title,
      disabled: false,
      selected: false,
    };
  }

  let actions: Action[] = [
    createAction(TakeCoinsFromSelf, "Take coins from your account"),
    createAction(SendCoinsToSelf, "Send coins to your account"),
    createAction(SendCoinsToAccount, "Send coins to someone else's account"),
    createAction(AirdropFungibleCoins, "Airdrop fungible coins"),
    createAction(StakeYourXRDs, "Stake your XRDs"),
    createAction(UnstakeYourLSUs, "Unstake your LSUs"),
    createAction(ClaimYourUnstakedXRDs, "Claim your unstaked XRDs"),
    createAction(SwapCoinsAtOciswap, "Swap coins at Ociswap"),
    createAction(AddLiquidityToOciswap, "Add liquidity to Ociswap"),
    createAction(
      WithdrawLiquidityFromOciswap,
      "Withdraw liquidity from Ociswap"
    ),
    createAction(
      AddYourLSUsToCaviarnine,
      "Add your LSUs in Caviarnine LSU pool"
    ),
    createAction(
      RetrieveLSUsFromCaviarnine,
      "Retrieve LSUs from Caviarnine LSU pool"
    ),
    createAction(SwapLSUsOnCaviarnine, "Swap LSUs on Caviarnine"),
    createAction(GableGetFlashloan, "Get Gable flashloan"),
    createAction(GableRepayFlashloan, "Repay Gable flashloan"),
    createAction(GableProvideLiquidity, "Provide liquidity to Gable"),
    createAction(DefiplazaSwapCoins, "Swap coins at DefiPlaza"),
    createAction(AlfadexSwapCoins, "Swap coins at AlphaDEX"),
    createAction(RadixplanetSwapCoins, "Swap coins at RadixPlanet"),
    createAction(RedeemYourWeft, "Redeem your WEFT"),
  ];

  function resetSelection() {
    actions = actions.map((a) => ({ ...a, selected: false }));
    // Remove focus from all elements
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  onMount(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        resetSelection();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });
</script>

<div class="join join-vertical w-full">
  {#each actions as action}
    <div
      class={`collapse bg-base-200 join-item border border-base-300 ${
        action.disabled ? " text-base-300" : ""
      }${action.selected ? " bg-base-300" : ""}`}
    >
      <input
        type="radio"
        name="my-accordion-1"
        checked={action.selected}
        disabled={action.disabled}
        on:change={() => {
          actions.forEach((a) => {
            a.selected = false;
          });
          action.selected = true;
        }}
      />
      <div class="collapse-title text-xl font-medium flex justify-between pr-4">
        <span class="my-auto">
          {action.title}
        </span>
        {#if action.selected}
          <button
            class="btn btn-link !no-underline text-secondary z-10 my-auto"
            on:click={resetSelection}
          >
            (esc)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-auto"
              viewBox="0 0 512 512"
              ><path
                fill="currentColor"
                d="M256 48a208 208 0 1 1 0 416a208 208 0 1 1 0-416m0 464a256 256 0 1 0 0-512a256 256 0 1 0 0 512m-81-337c-9.4 9.4-9.4 24.6 0 33.9l47 47l-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47l47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47l47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47l-47-47c-9.4-9.4-24.6-9.4-33.9 0"
              /></svg
            >
          </button>
        {/if}
      </div>
      {#if action.selected}
        <div
          class="collapse-content flex flex-col space-y-4 justify-between w-full"
        >
          <ActionError />
          <div class="flex flex-1 justify-end">
            <svelte:component this={action.component} />
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>
