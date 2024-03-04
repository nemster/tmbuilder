<script lang="ts">
  import Fuse from "fuse.js";
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
  import DefiplazaSwapCoins from "./actions/DefiplazaSwapCoins.svelte";
  import AlfadexSwapCoins from "./actions/AlfadexSwapCoins.svelte";
  import RadixplanetSwapCoins from "./actions/RadixplanetSwapCoins.svelte";
  import RedeemYourWeft from "./actions/RedeemYourWeft.svelte";
  import ActionError from "./ActionError.svelte";

  interface Action {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: any;
    title: string;
    disabled: boolean;
  }

  let filteredActions: Action[] = [];
  let searchInput: HTMLInputElement;
  let selectedAction: Action;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function createAction(component: any, title: string): Action {
    return {
      component,
      title,
      disabled: false,
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
    createAction(DefiplazaSwapCoins, "Swap coins at DefiPlaza"),
    createAction(AlfadexSwapCoins, "Swap coins at AlphaDEX"),
    createAction(RadixplanetSwapCoins, "Swap coins at RadixPlanet"),
    createAction(RedeemYourWeft, "Redeem your WEFT"),
  ];

  function resetSelection() {
    actions = actions.map((a) => ({ ...a, selected: false }));
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    searchInput.focus();
  }

  function selectAction(i: number) {
    selectedAction = filteredActions[i];
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      if (search) {
        search = "";
      }
      resetSelection();
    } else if (event.key === "/") {
      event.preventDefault();
      searchInput.focus();
    }
  }

  let search = "";

  let fuse = new Fuse(actions, {
    keys: ["title"],
    includeScore: true,
  });

  $: filteredActions = search
    ? fuse.search(search).map(({ item }) => item)
    : actions;

  $: if (search && filteredActions.length > 0) {
    selectedAction = filteredActions[0];
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="join join-vertical w-full">
  <div class="join-item bg-secondary flex px-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-4 h-auto"
      viewBox="0 0 512 512"
      ><path
        fill="currentColor"
        d="M416 208c0 45.9-14.9 88.3-40 122.7l126.6 126.7c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208M208 352a144 144 0 1 0 0-288a144 144 0 1 0 0 288"
      /></svg
    >
    <input
      id="searchInput"
      bind:this={searchInput}
      bind:value={search}
      class="input input-ghost focus:bg-transparent focus:border-none w-full"
      placeholder="Search..."
    />
    <kbd class="kbd h-1 my-auto shadow-none text-secondary">/</kbd>
  </div>

  {#each filteredActions as action, index}
    {#if selectedAction === action}
      <div
        class={`bg-base-300 join-item border border-secondary p-2 z-10 ${
          action.disabled ? " text-base-300" : ""
        }`}
      >
        <div class="font-bold flex justify-between py-1">
          <span class="my-auto leading-none">
            {action.title}
          </span>
          <button
            class="btn btn-sm btn-link !no-underline text-secondary my-auto"
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
        </div>
        <div class="flex flex-col space-y-4 justify-between w-full">
          <ActionError />
          <div class="flex flex-1 justify-end">
            <svelte:component this={action.component} />
          </div>
        </div>
      </div>
    {:else}
      <button
        class={`bg-base-200 join-item border border-base-300 text-left p-2 focus:border-secondary focus:border-2 focus:outline-none ${
          action.disabled ? " text-base-300" : ""
        }`}
        on:click={() => {
          selectAction(index);
        }}
      >
        {action.title}
      </button>
    {/if}
  {/each}
</div>

<style>
  #searchInput {
    outline: none;
  }
</style>
