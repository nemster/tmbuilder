<script lang="ts">
  import { initContent } from "./content";
  import { onMount } from "svelte";

  import Action from "./lib/Action.svelte";
  import Navbar from "./lib/Navbar.svelte";
  import Footer from "./lib/Footer.svelte";

  onMount(() => {
    initContent();
  });
</script>

<main class="prose max-w-none">
  <div class="flex flex-col h-screen">
    <div class="max-w-screen-lg mx-auto flex-grow">
      <Navbar />

      <div class="flex flex-col items-center">
        <Action />

        <div id="div1" class="flex space-x-24">
          <div class="flex flex-col">
            <div>
              account:
              <select id="account1" class="select select-secondary select-xs" />
            </div>
            <div>
              fungibles:
              <select id="fungible1" class="select select-secondary select-xs">
                <option />
              </select>
              quantity:
              <input
                class="input bg-secondary input-xs"
                type="text"
                id="quantity1"
              />
            </div>
            <div>
              non fungibles:
              <select
                id="non_fungible1"
                class="select select-secondary select-xs"
              >
                <option />
              </select>
            </div>
          </div>
          <div>
            <input
              type="button"
              class="btn"
              value="add instruction"
              id="add_instruction1"
            />
          </div>
        </div>

        <div id="div2" hidden={true}>
          <div>
            account:
            <select id="account2" />
          </div>
          <div>
            entire worktop
            <input type="checkbox" id="worktop2" checked={true} />
          </div>
          <div>
            fungibles:
            <select id="fungible2" disabled={true}>
              <option />
            </select>
            quantity: <input type="text" id="quantity2" disabled={true} /> all
            <input type="checkbox" id="all2" checked={true} disabled={true} />
          </div>
          <div>
            non fungibles:
            <select id="non_fungible2" disabled={true}>
              <option />
            </select>
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction2"
            />
          </div>
        </div>

        <div id="div3" hidden={true}>
          <div>
            account:
            <input type="text" id="account3" value="account_rdx1..." />
          </div>
          <div>
            entire worktop
            <input type="checkbox" id="worktop3" checked={true} />
          </div>
          <div>
            fungible:
            <select id="fungible3" disabled={true}>
              <option />
            </select>
            quantity: <input type="text" id="quantity3" disabled={true} /> all
            <input type="checkbox" id="all3" checked={true} disabled={true} />
          </div>
          <div>
            non fungibles:
            <select id="non_fungible3" disabled={true}>
              <option />
            </select>
          </div>
          <div>
            <select id="fail3">
              <option value="refund">continue if deposit fails</option>
              <option value="abort">
                abort transaction if deposit fails
              </option>
            </select>
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction3"
            />
          </div>
        </div>

        <div id="div4" hidden={true}>
          <div>
            validator:
            <select id="validator4">
              <option
                value="validator_rdx1sva6pmkgm5yacumw4p6k0xsfnqg598xkj9p4e2a58dl6gcrqpx7z86"
              >
                StakingCoins
              </option>
            </select>
          </div>
          <div>
            XRD quantity:
            <input type="text" id="quantity4" disabled={true} /> all
            <input type="checkbox" id="all4" checked={true} />
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction4"
            />
          </div>
        </div>

        <div id="div5" hidden={true}>
          <div>
            LSU:
            <select id="lsu5" />
            quantity: <input type="text" id="quantity5" disabled={true} /> all
            <input type="checkbox" id="all5" checked={true} />
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction5"
            />
          </div>
        </div>

        <div id="div6" hidden={true}>
          <div>
            claim NFT:
            <select id="nft6" />
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction6"
            />
          </div>
        </div>

        <div id="div7" hidden={true}>
          <div>
            LSU:
            <select id="lsu7" />
            quantity: <input type="text" id="quantity7" disabled={true} /> all
            <input type="checkbox" id="all7" checked={true} />
          </div>
          <div>
            LSU pool receipt:
            <select id="nft7"> (optional) </select>
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction7"
            />
          </div>
        </div>

        <div id="div8" hidden={true}>
          <div>
            LSULP quantity to send:
            <input type="text" id="quantity8" disabled={true} /> all
            <input type="checkbox" id="all8" checked={true} />
          </div>
          <div>
            LSU to receive:
            <select id="lsu8" />
          </div>
          <div>
            LSU pool receipt:
            <select id="nft8"> (optional) </select>
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction8"
            />
          </div>
        </div>

        <div id="div9" hidden={true}>
          <div>
            LSU to send:
            <select id="send9" />
            quantity: <input type="text" id="quantity9" disabled={true} /> all
            <input type="checkbox" id="all9" checked={true} />
          </div>
          <div>
            LSU to receive:
            <select id="receive9" />
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction9"
            />
          </div>
        </div>

        <div id="div10" hidden={true}>
          <div>
            coin:
            <select id="fungible10" />
            quantity per recipient: <input type="text" id="quantity10" />
          </div>
          <div>recipients (one per line):</div>
          <div>
            <textarea id="recipients10" rows="10" cols="85" />
          </div>
          <div>
            send remainings to:
            <select id="account10" />
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction10"
            />
          </div>
        </div>

        <div id="div11" hidden={true}>
          <div>
            coin to send:
            <select id="send11" />
            quantity:
            <input type="text" id="quantity11" disabled={true} /> all
            <input type="checkbox" id="all11" checked={true} />
          </div>
          <div>
            coin to receive:
            <select id="receive11" />
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction11"
            />
          </div>
        </div>

        <div id="div12" hidden={true}>
          <div>
            coin 1 to send:
            <select id="send_1_12" />
            quantity:
            <input type="text" id="quantity_1_12" disabled={true} /> all
            <input type="checkbox" id="all12" checked={true} />
          </div>
          <div>
            coin 2 to send:
            <select id="send_2_12" />
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction12"
            />
          </div>
        </div>

        <div id="div13" hidden={true}>
          <div>
            LP:
            <select id="send13" />
            quantity:
            <input type="text" id="quantity13" disabled={true} /> all
            <input type="checkbox" id="all13" checked={true} />
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction13"
            />
          </div>
        </div>

        <div id="div14" hidden={true}>
          <div>quantity: <input type="text" id="quantity14" /> XRD</div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction14"
            />
          </div>
        </div>

        <div id="div15" hidden={true}>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction15"
            />
          </div>
        </div>

        <div id="div16" hidden={true}>
          <div>
            coin to send:
            <select id="send16" />
            quantity:
            <input type="text" id="quantity16" disabled={true} /> all
            <input type="checkbox" id="all16" checked={true} />
          </div>
          <div>
            coin to receive:
            <select id="receive16" />
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction16"
            />
          </div>
        </div>

        <div id="div17" hidden={true}>
          <div>
            coin to send:
            <select id="send17" />
            quantity:
            <input type="text" id="quantity17" disabled={true} /> all
            <input type="checkbox" id="all17" checked={true} />
          </div>
          <div>
            coin to receive:
            <select id="receive17" />
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction17"
            />
          </div>
        </div>

        <div id="div18" hidden={true}>
          <div>
            quantity of LSU to send:
            <input type="text" id="quantity18" disabled={true} /> all
            <input type="checkbox" id="all18" checked={true} />
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction18"
            />
          </div>
        </div>

        <div id="div19" hidden={true}>
          <div>
            coin to send:
            <select id="send19" />
            quantity:
            <input type="text" id="quantity19" disabled={true} /> all
            <input type="checkbox" id="all19" checked={true} />
          </div>
          <div>
            coin to receive:
            <select id="receive19" />
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction19"
            />
          </div>
        </div>

        <div id="div20" hidden={true}>
          <div>
            NFT to show:
            <select id="nft20" />
          </div>
          <div>
            <input
              type="button"
              value="add instructions"
              id="add_instruction20"
            />
          </div>
        </div>

        <div class="relative my-6">
          <div class="absolute right-1 -top-6 text flex font-thin">
            <div>&nbsp;</div>
            <div>resources in worktop</div>
          </div>
          <textarea
            id="worktop"
            class="textarea bg-base-300"
            readonly
            rows="5"
            cols="85"
          />
        </div>

        <div class="relative my-6">
          <div class="absolute right-1 -top-6 text flex font-thin">
            <div>&nbsp;</div>
            <div>transaction manifest</div>
          </div>
          <textarea
            class="textarea bg-neutral not-prose"
            id="transaction_manifest"
            rows="20"
            cols="85"
          />
          <div class="btn absolute btn-accent my-4 z-10 right-4 bottom-1">
            <input type="button" value="send to wallet" id="send_to_wallet" />
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</main>
