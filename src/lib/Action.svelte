<script lang="ts">
  import TakeCoins from "./actions/TakeCoins.svelte";
  import SendCoinsToSelf from "./actions/SendCoinsToSelf.svelte";

  let actions = {
    TakeCoins,
    SendCoinsToSelf,
  };

  let SelectedAction = actions.TakeCoins;

  function handleActionChange(event: any) {
    SelectedAction = event.target.value;
  }
</script>

<div class="w-full rounded-box border-dashed border-4 border-accent p-4">
  <div class="flex space-x-4 justify-between w-full">
    <p id="warn" class="warn">&nbsp;</p>
    <div>
      <select
        on:change={handleActionChange}
        id="action"
        class="select select-gohst text-accent text-end text-lg"
      >
        <option value={actions.TakeCoins}>take coins from your account</option>
        <!-- TODO: other actions -->
        <option disabled>--- SEND COINS ---</option>
        <option value={actions.SendCoinsToSelf}
          >send coins to your account</option
        >
        <option>send coins to someone else's account</option>
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
      </select>
    </div>
  </div>

  <div class="w-full ml-2">
    <SelectedAction />
  </div>
</div>
