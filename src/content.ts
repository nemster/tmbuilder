/*
 * This is the content script that previously was in main.ts
 * and running on page load,
 * will be refactored into smaller pieces in svelte components
 */

import {
  RadixDappToolkit,
  DataRequestBuilder,
} from "@radixdlt/radix-dapp-toolkit";
import {
  GatewayApiClient,
  FungibleResourcesCollectionItemGloballyAggregated,
  NonFungibleResourcesCollectionItemVaultAggregated,
  MetadataStringValue,
  ProgrammaticScryptoSborValueTuple,
  ProgrammaticScryptoSborValueDecimal,
  ProgrammaticScryptoSborValueU64,
  ProgrammaticScryptoSborValueString,
  ProgrammaticScryptoSborValueMap,
} from "@radixdlt/babylon-gateway-api-sdk";
import {
  validators_names,
  pool_units,
  claim_nft,
  validators_you_can_stake_to,
} from "./validators.ts";
import {
  ociswap_listed_coins,
  ociswap_lp_pools,
  ociswap_lp_names,
} from "./ociswap.ts";
import { defiplaza_listed_coins } from "./defiplaza.ts";
import { alphadex_listed_coins } from "./alphadex.ts";
import {
  radixplanet_pools,
  radixplanet_listed_coins,
  radixplanet_lp,
} from "./radixplanet.ts";

interface fungibles_array {
  [index: string]: number;
}
interface fungibles_array_array {
  [index: string]: fungibles_array;
}
interface non_fungibles_array_array {
  [index: string]: string[];
}
interface ociswap_swap {
  input_address: string;
  output_address: string;
  output_amount: { token: string };
  pool_address: string;
}

export function initContent() {
  var fungibles_in_worktop: { [key: string]: number } = {};
  var non_fungibles_in_worktop = [] as string[];
  var fungibles_in_accounts: fungibles_array_array = {};
  var non_fungibles_in_accounts: non_fungibles_array_array = {};
  const xrd =
    "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd";
  const weft =
    "resource_rdx1tk3fxrz75ghllrqhyq8e574rkf4lsq2x5a0vegxwlh3defv225cth3";
  var fungibles_symbols: { [key: string]: string } = {
    resource_rdx1tk3fxrz75ghllrqhyq8e574rkf4lsq2x5a0vegxwlh3defv225cth3:
      "WEFT Weft Finance",
  };
  var gable_loan_quantity = 0;
  var gable_loan_fees = 0.001;
  const gable_component =
    "component_rdx1cpmh7lyg0hx6efv5q79lv6rqxdqpuh27y99nzm0jpwu2u44ne243ws";
  const gable_transient_nft =
    "resource_rdx1ngxzt7uq9l2wm5gd8vefcq5pkwcqwrn530a98p72mnkjzjev8hlxdn";
  const gable_lsu =
    "resource_rdx1thrz4g8g83802lumrtrdsrhjd6k5uxhxhgkrwjg0jn75cvxfc99nap";
  const gable_liquidity_nft =
    "resource_rdx1nfxg3t4eyls2qycqqrp6df8wkz3n2r04ex20443jtsgz5c23wsf74w";
  var non_fungibles_symbols: { [key: string]: string } = {
    resource_rdx1ngxzt7uq9l2wm5gd8vefcq5pkwcqwrn530a98p72mnkjzjev8hlxdn:
      "STT Gable Transient Token",
    resource_rdx1nt3vrt8xtdal6gn7ddv0zfzvxpqylxyfmr97setz8r3amhhk90yqmg:
      "Weft Claimer Nft",
  };
  const defiplaza_component =
    "component_rdx1cze7e7437y9pmntk94w72eyanngw522j8yf07aa27frn63m9ezkfeu";
  var bucket_number = 1;
  var proof_number = 1;
  const epsilon = 0.000001;
  const lsu_pool_receipt =
    "resource_rdx1nt3frmqu4v57dy55e90n0k3uy352zyy89vszzamvjld6vqvr98rls9";
  const lsu_pool =
    "component_rdx1cppy08xgra5tv5melsjtj79c0ngvrlmzl8hhs7vwtzknp9xxs63mfp";
  const lsulp =
    "resource_rdx1thksg5ng70g9mmy9ne7wz0sc7auzrrwy7fmgcxzel2gvp8pj0xxfmf";
  const unknown_nft_id = "???";
  var claim_amount: { [key: string]: number } = {};
  var claim_epoch: { [key: string]: number } = {};
  const backeum_trophies =
    "resource_rdx1ng8ugxt6tj0e22fvf6js4e3x5k8uwaqvz9tl8u924u54h7zxeh6jnp";
  const my_backeum_collection_id =
    "component_rdx1cqzr66e6vc5mp7hsqjjnyzmhdzmamafnn7dfyc2yn7mz7r3g7k3mwp";
  var donor = false;
  const my_validator_address =
    "validator_rdx1sva6pmkgm5yacumw4p6k0xsfnqg598xkj9p4e2a58dl6gcrqpx7z86";
  const my_lsu_address =
    "resource_rdx1t4pl597e7lp6flduhd3a6tp9jsqw2vzgyj9jxtk8y3dawum5aahap0";
  var staked_amount = 0;
  const weft_claimer_nft =
    "resource_rdx1nt3vrt8xtdal6gn7ddv0zfzvxpqylxyfmr97setz8r3amhhk90yqmg";
  var weft_amount_to_collect: { [key: string]: number } = {};
  const caviarnine_enabled_validators: { [key: string]: number } = {
    validator_rdx1s0g5uuw3a7ad7akueetzq5lpejzp9uw5glv2qnflvymgendvepgduj: 1,
    validator_rdx1s0lz5v68gtqwswu7lrx9yrjte4ts0l2saphmplsz68nsv2aux0xvfq: 1,
    validator_rdx1swkmn6yvrqjzpaytvug5fp0gzfy9zdzq7j7nlxe8wgjpg76vdcma8p: 1,
    validator_rdx1sw5zkx2h6hp6k0js6dqaaxpz4580awncmm0rlzv7ufcf97cukjegy8: 1,
    validator_rdx1svvnmmgdr6sl7llxc8sdu32ys7tn8v6k8quh7e6m6ec83fr3pf6d04: 1,
    validator_rdx1sdzyh7reza3k7y9cyu93ghnak2n89uhugwc072kxrl7unsxgsacx8j: 1,
    validator_rdx1s0quzpxcnvh2h7ua2rq6ds0nka3z05kfpz3eventwpamve22uxjdxj: 1,
    validator_rdx1sv2rav2zqvufxs9dk5yu92t00ncrcw3dfu64pxxz29vvq3tj4fem2p: 1,
    validator_rdx1svug50cdlalm6plazajrmntf209j5azf57xeukuhx2hw7e7ut5mmz8: 1,
    validator_rdx1sw5va0gazh39jypat3t55vjskc90v93c558ef9c6pjkrctx8quzh6d: 1,
    validator_rdx1swq3mn0u9qf68j6g3nugw3udakecggfgpu9e4yphe2rcqc32aavw9t: 1,
    validator_rdx1svlpfx0kxp5yk7h8dqrd8uzqtm7dkd0mlmerq6xsy3rng84d4wqnmv: 1,
    validator_rdx1s08twr4tpfkxy5sy5e4yaz38uhgdcu3gjyzuexaheqq6mqxsjx7440: 1,
    validator_rdx1sw54cuswwzlcgw2zh3ax93pddnsm78qwwhmtvz650q84yyckzkh7nk: 1,
    validator_rdx1svkch0tjam57zrs72hu7gc2z93vaq5raqsg0z3vwqz6v46mc7rxtuz: 1,
    validator_rdx1s066xuq885l0mttgmx4ptflte6fepkt0c06mqnqtdgajj4mcwh70q4: 1,
    validator_rdx1sv559zk2z927wmc9464kypyjltjrhelcmrx8486x37sv6xartj5x8h: 1,
    validator_rdx1svpqafv4te3qtfhux5yxv2vyv95mp866dp9xpe28v0pvvwzhrk4vyz: 1,
    validator_rdx1s0u9v6a4n2q7cvjkmgq0wnl8gml8c3purzdqg2cwdah2l4g086xzw4: 1,
    validator_rdx1s0fsq205yuxukmpdrcaxqueq3phzknpvwahkskjvz69atk2c08f07d: 1,
    validator_rdx1swffjvsu78ej866pnd89yhv5ragthk67whp68fyw9eudt4fsxjdua6: 1,
    validator_rdx1sdh43pkyltan8qucr0xh928mdkz3fgyeehajnqxxnhhz9ux8gp74k0: 1,
    validator_rdx1svm98ppmxzft82lykaeudwp3z562dlqk692ws5us5a8lr78ux3v8kr: 1,
    validator_rdx1sd8c8v9tffjtgqtuzygnctrmyfnhkd63avcgpzuknx3dlklds85rkv: 1,
    validator_rdx1s048k34ctk3m57gumema2e5jmhfxhdryyr5hq42xa9q59pvn8lezg8: 1,
    validator_rdx1s0kpu7dq8nugrcvc6u3vnl9rhntzxyck0k3r5ze67r5knk4auxaq69: 1,
    validator_rdx1s0qzv2vmxydpnglk36mczrdwczpsskuzek2cs5nnld6j533rzatmln: 1,
    validator_rdx1sdcheqrngr92u8mkd7pvu57grys54q3mkl4cvcc7nj92kk3n56up6s: 1,
    validator_rdx1s0kenl8rwh8e0qxpfrxhw7ry3uzl5x7gsu2ur7jfg6ec4sluk5gv05: 1,
    validator_rdx1swnhuz9mqm6s7kkdjzxcgnavknltczrw9lr2m9pkfddh0hzg3dwt2f: 1,
    validator_rdx1sweyknyzw9lzh6hdjeq2avh9gg5g6l7dd8he77khnv76ac8ut84hq4: 1,
    validator_rdx1swslug7tu9rgww8zdd0x8htptzgw92vx9606lx2ptdm9wsdam8uvxq: 1,
    validator_rdx1sv7zpyuj27ycmcsnw0de94j2rp93csq6gvcm4dl4yh4p4fxv9j5pqx: 1,
    validator_rdx1s002geu08u94z4unkjvhlvyhs0dzj0glq82t6mhhvmahh3w0gerqyh: 1,
    validator_rdx1sw3vpmmyykrc9vk8xp9hk4595d0qv9q8pmm2pkursum65r67gsrwwq: 1,
    validator_rdx1s0tkjt8mureaw3kkfl3900law5tnrlg3wte9f4vlaruxe4nfjzdam7: 1,
    validator_rdx1sd9uhhpml8vjz8uz0tut9jzv2mx326jdusfxjpccccj2904s8ndhqq: 1,
    validator_rdx1s0phwevr0tcenaaptx4ecmduw8zy8yv449vzmktw2wk2x8r47vfnf0: 1,
    validator_rdx1sd0s8g47y6w37dezandh2re9d4h7v252hq5a2kwj0swk0s7kkc2dkt: 1,
    validator_rdx1s0txh4cx4nd7eh5nsxyt7h7njja5galwj602x57e9r2dszv6h2aahj: 1,
    validator_rdx1sdauznj9luja8v7vd4jndmlp449tcr9qxkx6fkm87lxkn0lq6m9mn0: 1,
    validator_rdx1svfawmdwc77092hzhd6rzlay0tg4g8dw2sd37mu7skaqjlsq624rfa: 1,
    validator_rdx1sdk493n96m2v8t0st6hgrdmdua8y6kp84lcwv35qr7umvj7ar4x3e8: 1,
    validator_rdx1swqzqfll4r6h45e6rxx7p45vk9nn74mk0zlts4r3td2fj85kaekq0t: 1,
    validator_rdx1sv856az023f380u0gzezaf50djcvcmpzf4ntv5au9xzt68sqjra7n3: 1,
    validator_rdx1sd3m2lhf6ts8au09haxq69v7sg02fktpjn33w9krz0gvjadawp3y6x: 1,
    validator_rdx1s0v38ep79xx6y7cv86afuqw3z2sd074sldcvrld4lefw3fagvjdhnm: 1,
    validator_rdx1s0drhvkx30k62zu0usnzxzwuh0qcsqwlc2n2kfyexlyghqpctuy2fx: 1,
    validator_rdx1sds4prpgf0p25pu458fg468nw9rtwqdawwg9w45hgf0t95yd3ncs09: 1,
    validator_rdx1sdvntpsfvlyx2hapn5zfr6z7etfwgqljsqdqh23876r33fpd8cvu5j: 1,
    validator_rdx1swzn5hvtut6yq0zxqqsa0wk4rnkfd8wewvnphzrckau22pun2lv86t: 1,
    validator_rdx1svfvxj0glmg0ea2m0nqm47qlfypj2rcmp74t7p4wgjx2m0f2nju2zz: 1,
    validator_rdx1s007thnssqwg0pa332ynxmyvremuvv9uuggnmm6y6qgj0nez5fjnx9: 1,
    validator_rdx1sva6pmkgm5yacumw4p6k0xsfnqg598xkj9p4e2a58dl6gcrqpx7z86: 1,
    validator_rdx1sdy4cz4jp2jzrzu37rlmr8sdenevgtly7p0wx5erc5sfkh65c4j0c3: 1,
    validator_rdx1sw32mp374vrd0extsg4d6z3mwpgpalydnt5tp8a6fnsq0smax4tv35: 1,
    validator_rdx1swqnvclxd9j8z937zr9y4hvjecex7235dz00xezejtuc3wg7j2rxrh: 1,
    validator_rdx1sdvcfj2tcg8cjtqzymmqukdt2ue9qpqmfq8hl7zx00whdmspj0u55k: 1,
    validator_rdx1s08nr8ukas7yklpf7q0dg9s3resvmhjau9r5ye3vvkrhpycayjrfrw: 1,
    validator_rdx1svn77rj5gmhhhapafxhd3tv9yg9eq2a2gc578weeqx6huurlfu5aec: 1,
    validator_rdx1swud5a22cnwj9n3fgnkvmn9pvmk67qw6ukw23xkmau6dncm23jskup: 1,
    validator_rdx1s07zllgtzvy9xfyj34jfa9qpd004tcqg80c6vjezv5xmvk0d7jvcjm: 1,
    validator_rdx1sd2fdyrmnhrrr3gmrx47atpgh3nvhpax66aufcwj3ey9lyvyqgvndf: 1,
    validator_rdx1sv2lj628xcmsa20dy866w0vnpavduateww0h68avju67q2chkrmgps: 1,
    validator_rdx1sdzp792ktu30rd0kvj5stxu7mdpwylgkprdpnx5ysv2uj4km3ggrvf: 1,
    validator_rdx1s0y90ud7edmnaz7x52s7xsyhf8rgu2xr75u9526zqznhc5w3hkt34u: 1,
    validator_rdx1svjhajkrvar9lc4q045t5n02llhdm95wx2pampdm9tc3fglxdgjc8a: 1,
    validator_rdx1swkwafkwtq2dycr8av6zt5zlu3ls92r7vu66vu6lep6me8dphesxlj: 1,
    validator_rdx1svsvx7w30pq4d2t3587r5tqkv7gne7pgdrtgtl94uefax07qr50quu: 1,
    validator_rdx1s0k2g57gxld3nydl8535e2tkp6tduh6pmynd3mf2a3q428zh09n24s: 1,
    validator_rdx1svudtxxkegaeg6ks0qgjujfp8g80de2f63ygvfqug6zv987e99jk3q: 1,
    validator_rdx1svxx0jetjwnptndj60sm8h7ljs0v88fl6xhwcyp6ar397agwd0ezaz: 1,
    validator_rdx1sv07myvl9hs935aadunwwmp0fy0jh8p2h555j6836et5etswnjjwd6: 1,
    validator_rdx1sdt7m2m3umwyuk9evzzcg6q34s5elu64pjkxlhtqu2w4zh65c99sw0: 1,
    validator_rdx1s0yv2n460xdkefxlqrze4afgclfsq4akwz9em8nshjcga8ntemmkga: 1,
    validator_rdx1sdep83pjpyhsctth6qc57xyyhw637p09dy2mrstmp0d0j74yzq96gh: 1,
    validator_rdx1s0qtrarfm5eu9ewvtzud96q9mjm2u63qr99newtm6h28q9slmz9jdp: 1,
  };

  const rdt = RadixDappToolkit({
    dAppDefinitionAddress:
      "account_rdx128asp59jepvktdmpu43p3fkwcenpa996u4reqq6uh7qsdeeplvc0kj",
    networkId: 1,
    applicationName: "tmbuilder",
    applicationVersion: "0.5.0",
  });
  rdt.walletApi.setRequestData(
    DataRequestBuilder.persona(),
    DataRequestBuilder.accounts().atLeast(1)
  );

  const gatewayApi = GatewayApiClient.initialize({
    basePath: "https://mainnet.radixdlt.com",
    applicationName: "tmbuilder",
  });

  function number_to_string(num: number) {
    var str = String(num);
    if (str.includes(".") && str.length >= 17) {
      str = str.slice(0, -1) + (parseInt(str.slice(-1)) - 1);
    }
    return str;
  }

  async function get_fungibles(account: string) {
    let response = await gatewayApi.state.innerClient.entityFungiblesPageRaw({
      stateEntityFungiblesPageRequest: {
        address: account,
        opt_ins: {
          explicit_metadata: ["symbol", "name"],
        },
      },
    });
    return response.value();
  }

  async function get_non_fungibles(account: string) {
    let response = await gatewayApi.state.innerClient.entityNonFungiblesPageRaw(
      {
        stateEntityNonFungiblesPageRequest: {
          address: account,
          aggregation_level: "Vault",
          opt_ins: {
            non_fungible_include_nfids: true,
            explicit_metadata: ["name"],
          },
        },
      }
    );
    return response.value();
  }

  async function get_non_fungible_data(resource: string, id: string) {
    let response = await gatewayApi.state.innerClient.nonFungibleData({
      stateNonFungibleDataRequest: {
        resource_address: resource,
        non_fungible_ids: [id],
      },
    });
    return response;
  }

  rdt.walletApi.walletData$.subscribe((walletData) => {
    const selectAccount1 =
      document.querySelector<HTMLSelectElement>("#account1");
    const selectAccount2 =
      document.querySelector<HTMLSelectElement>("#account2");
    const selectAccount10 =
      document.querySelector<HTMLSelectElement>("#account10");
    var first_account = "";
    for (var account of walletData.accounts) {
      selectAccount1!.options[selectAccount1!.options.length] = new Option(
        account.label,
        account.address
      );
      selectAccount2!.options[selectAccount2!.options.length] = new Option(
        account.label,
        account.address
      );
      selectAccount10!.options[selectAccount10!.options.length] = new Option(
        account.label,
        account.address
      );
      fungibles_in_accounts[account.address] = {};
      non_fungibles_in_accounts[account.address] = [];
      if (first_account == "") {
        first_account = account.address;
      }
      get_fungibles(account.address).then((value) => {
        for (var fungible of value.items) {
          if (
            find_fungible_symbol(fungible.resource_address) ==
            fungible.resource_address
          ) {
            if (fungible.explicit_metadata!.total_count == 1) {
              fungibles_symbols[fungible.resource_address] = (<
                MetadataStringValue
              >fungible.explicit_metadata!.items[0].value.typed).value;
            } else if (fungible.explicit_metadata!.total_count == 2) {
              fungibles_symbols[fungible.resource_address] =
                (<MetadataStringValue>(
                  fungible.explicit_metadata!.items[0].value.typed
                )).value +
                " " +
                (<MetadataStringValue>(
                  fungible.explicit_metadata!.items[1].value.typed
                )).value;
            }
          }
          var amount = parseFloat(
            (<FungibleResourcesCollectionItemGloballyAggregated>fungible).amount
          );
          if (fungible.resource_address == xrd) {
            amount -= 10;
          }
          if (amount > epsilon) {
            fungibles_in_accounts[value.address][fungible.resource_address] =
              amount;
          }
          if (fungible.resource_address == my_lsu_address && amount > 50) {
            document.querySelector<HTMLParagraphElement>("#footer")!.innerText =
              "Thank you for staking with me!";
            staked_amount += amount;
          }
        }
        if (value.address == first_account) {
          selectAccount1!.dispatchEvent(new Event("change"));
        }
      });
      get_non_fungibles(account.address).then((value) => {
        for (var non_fungible of value.items) {
          if (
            non_fungibles_symbols[non_fungible.resource_address] == undefined
          ) {
            non_fungibles_symbols[non_fungible.resource_address] = (<
              MetadataStringValue
            >non_fungible.explicit_metadata!.items[0].value.typed).value;
          }
          for (var item of (<NonFungibleResourcesCollectionItemVaultAggregated>(
            non_fungible
          )).vaults.items) {
            for (var id of item!.items!) {
              var i = 0;
              while (non_fungibles_in_accounts[value.address][i] != undefined) {
                i++;
              }
              non_fungibles_in_accounts[value.address][i] =
                non_fungible.resource_address + " " + id;
              if (non_fungible.resource_address == weft_claimer_nft) {
                const nft20 =
                  document.querySelector<HTMLSelectElement>("#nft20");
                nft20!.options[nft20!.options.length] = new Option(
                  id,
                  value.address + " " + id
                );
                get_non_fungible_data(weft_claimer_nft, id).then((v) => {
                  for (var nf of v.non_fungible_ids) {
                    weft_amount_to_collect[nf.non_fungible_id] = 0;
                    for (var field of (<ProgrammaticScryptoSborValueTuple>(
                      nf.data!.programmatic_json
                    )).fields) {
                      for (var entry of (<ProgrammaticScryptoSborValueMap>field)
                        .entries) {
                        for (var field2 of (<ProgrammaticScryptoSborValueTuple>(
                          entry.value
                        )).fields) {
                          if (field2.field_name == "amount") {
                            weft_amount_to_collect[nf.non_fungible_id] +=
                              parseFloat(
                                (<ProgrammaticScryptoSborValueDecimal>field2)
                                  .value
                              );
                          } else if (field2.field_name == "collected_amount") {
                            weft_amount_to_collect[nf.non_fungible_id] -=
                              parseFloat(
                                (<ProgrammaticScryptoSborValueDecimal>field2)
                                  .value
                              );
                          }
                        }
                      }
                    }
                  }
                });
              } else if (non_fungible.resource_address == backeum_trophies) {
                get_non_fungible_data(backeum_trophies, id).then((v) => {
                  for (var nf of v.non_fungible_ids) {
                    for (var field of (<ProgrammaticScryptoSborValueTuple>(
                      nf.data!.programmatic_json
                    )).fields) {
                      if (
                        field.field_name == "collection_id" &&
                        (<ProgrammaticScryptoSborValueString>field).value ==
                          my_backeum_collection_id
                      ) {
                        donor = true;
                        document.querySelector<HTMLParagraphElement>(
                          "#footer"
                        )!.innerText =
                          "Thank you for supporting me on Backeum!";
                      }
                    }
                  }
                });
              } else if (non_fungible.resource_address == lsu_pool_receipt) {
                const nft7 = document.querySelector<HTMLSelectElement>("#nft7");
                nft7!.options[nft7!.options.length] = new Option(
                  id,
                  value.address + " " + id
                );
                const nft8 = document.querySelector<HTMLSelectElement>("#nft8");
                nft8!.options[nft8!.options.length] = new Option(
                  id,
                  value.address + " " + id
                );
              } else if (
                claim_nft[non_fungible.resource_address] != undefined
              ) {
                get_non_fungible_data(non_fungible.resource_address, id).then(
                  (v) => {
                    for (var nf of v.non_fungible_ids) {
                      for (var field of (<ProgrammaticScryptoSborValueTuple>(
                        nf.data!.programmatic_json
                      )).fields) {
                        if (field.field_name == "claim_amount") {
                          claim_amount[nf.non_fungible_id] = parseFloat(
                            (<ProgrammaticScryptoSborValueDecimal>field).value
                          );
                        }
                        if (field.field_name == "claim_epoch") {
                          claim_epoch[nf.non_fungible_id] = parseInt(
                            (<ProgrammaticScryptoSborValueU64>field).value
                          );
                        }
                      }
                    }
                  }
                );
              }
            }
          }
        }
        if (value.address == first_account) {
          selectAccount1!.dispatchEvent(new Event("change"));
        }
      });
    }
  });

  const validatorSelect4 =
    document.querySelector<HTMLSelectElement>("#validator4");
  for (var validator of Object.keys(validators_you_can_stake_to)) {
    if (validatorSelect4 && validator != my_validator_address) {
      validatorSelect4!.options[validatorSelect4!.options.length] = new Option(
        validators_names[validator].trim(),
        validator
      );
    }
  }

  const lsuSelect8 = document.querySelector<HTMLSelectElement>("#lsu8");
  const receiveSelect9 = document.querySelector<HTMLSelectElement>("#receive9");
  for (var lsu of Object.keys(pool_units)) {
    if (
      lsuSelect8 &&
      caviarnine_enabled_validators[pool_units[lsu]] != undefined
    ) {
      const symbol = find_fungible_symbol(lsu);
      lsuSelect8!.options[lsuSelect8!.options.length] = new Option(symbol, lsu);
      receiveSelect9!.options[receiveSelect9!.options.length] = new Option(
        symbol,
        lsu
      );
    }
  }

  function add_fungible_to_account(
    account: string,
    fungible: string,
    quantity: number
  ) {
    if (fungibles_in_accounts[account][fungible] == undefined) {
      fungibles_in_accounts[account][fungible] = quantity;
    } else {
      fungibles_in_accounts[account][fungible] += quantity;
    }
    document.querySelector<HTMLSelectElement>("#fungible1")!.selectedIndex = 0;
    document.querySelector<HTMLSelectElement>("#quantity1")!.value = "";
  }

  function add_non_fungible_to_account(account: string, non_fungible: string) {
    non_fungibles_in_accounts[account].push(non_fungible);
  }

  function add_fungible_to_worktop(resource: string, quantity: number) {
    if (fungibles_in_worktop[resource] == undefined) {
      fungibles_in_worktop[resource] = quantity;
      const symbol = find_fungible_symbol(resource);
      const resource2 = document.querySelector<HTMLSelectElement>("#fungible2");
      const resource3 = document.querySelector<HTMLSelectElement>("#fungible3");
      const resource10 =
        document.querySelector<HTMLSelectElement>("#fungible10");
      resource2!.options[resource2!.options.length] = new Option(
        symbol,
        resource
      );
      resource3!.options[resource3!.options.length] = new Option(
        symbol,
        resource
      );
      resource10!.options[resource10!.options.length] = new Option(
        symbol,
        resource
      );
      if (pool_units[resource] != undefined) {
        const lsu5 = document.querySelector<HTMLSelectElement>("#lsu5");
        lsu5!.options[lsu5!.options.length] = new Option(symbol, resource);
        if (caviarnine_enabled_validators[pool_units[resource]] != undefined) {
          const lsu7 = document.querySelector<HTMLSelectElement>("#lsu7");
          const send9 = document.querySelector<HTMLSelectElement>("#send9");
          lsu7!.options[lsu7!.options.length] = new Option(symbol, resource);
          send9!.options[send9!.options.length] = new Option(symbol, resource);
        }
      } else {
        if (ociswap_listed_coins[resource] != undefined) {
          const send11 = document.querySelector<HTMLSelectElement>("#send11");
          send11!.options[send11!.options.length] = new Option(
            symbol,
            resource
          );
          const send_1_12 =
            document.querySelector<HTMLSelectElement>("#send_1_12");
          send_1_12!.options[send_1_12!.options.length] = new Option(
            symbol,
            resource
          );
          send_1_12!.dispatchEvent(new Event("change"));
        } else if (ociswap_lp_names[resource] != undefined) {
          const send13 = document.querySelector<HTMLSelectElement>("#send13");
          send13!.options[send13!.options.length] = new Option(
            symbol,
            resource
          );
          send13!.dispatchEvent(new Event("change"));
        }
        if (defiplaza_listed_coins[resource] != undefined) {
          const send16 = document.querySelector<HTMLSelectElement>("#send16");
          send16!.options[send16!.options.length] = new Option(
            symbol,
            resource
          );
          send16!.dispatchEvent(new Event("change"));
        }
        if (alphadex_listed_coins[resource] != undefined) {
          const send17 = document.querySelector<HTMLSelectElement>("#send17");
          send17!.options[send17!.options.length] = new Option(
            symbol,
            resource
          );
          send17!.dispatchEvent(new Event("change"));
        }
        if (radixplanet_listed_coins[resource] != undefined) {
          const send19 = document.querySelector<HTMLSelectElement>("#send19");
          send19!.options[send19!.options.length] = new Option(
            symbol,
            resource
          );
          send19!.dispatchEvent(new Event("change"));
        }
      }
    } else {
      fungibles_in_worktop[resource] += quantity;
    }
    show_resources_in_worktop();
  }

  function add_non_fungible_to_worktop(resource: string) {
    if (non_fungibles_in_worktop.indexOf(resource) == -1) {
      non_fungibles_in_worktop.push(resource);
      const res = resource.split(" ");
      const symbol = find_non_fungible_symbol(res[0]);
      const resource2 =
        document.querySelector<HTMLSelectElement>("#non_fungible2");
      const resource3 =
        document.querySelector<HTMLSelectElement>("#non_fungible3");
      resource2!.options[resource2!.options.length] = new Option(
        symbol + " " + res[1],
        resource
      );
      resource3!.options[resource3!.options.length] = new Option(
        symbol + " " + res[1],
        resource
      );
      if (claim_nft[res[0]] != undefined) {
        const nft6 = document.querySelector<HTMLSelectElement>("#nft6");
        nft6!.options[nft6!.options.length] = new Option(
          symbol + " " + res[1],
          resource
        );
      }
      show_resources_in_worktop();
    }
  }

  function remove_fungible_from_account(
    account: string,
    resource: string,
    quantity: number
  ) {
    fungibles_in_accounts[account][resource] -= quantity;
    if (fungibles_in_accounts[account][resource] < epsilon) {
      fungibles_in_accounts[account][resource] = 0;
    }
  }

  function remove_fungible_from_worktop(resource: string, quantity: string) {
    const resource2 = document.querySelector<HTMLSelectElement>("#fungible2");
    const resource3 = document.querySelector<HTMLSelectElement>("#fungible3");
    const lsu5 = document.querySelector<HTMLSelectElement>("#lsu5");
    const lsu7 = document.querySelector<HTMLSelectElement>("#lsu7");
    const send9 = document.querySelector<HTMLSelectElement>("#send9");
    const fungible10 = document.querySelector<HTMLSelectElement>("#fungible10");
    const send11 = document.querySelector<HTMLSelectElement>("#send11");
    const send_1_12 = document.querySelector<HTMLSelectElement>("#send_1_12");
    const send13 = document.querySelector<HTMLSelectElement>("#send13");
    const send16 = document.querySelector<HTMLSelectElement>("#send16");
    const send19 = document.querySelector<HTMLSelectElement>("#send19");
    if (fungibles_in_worktop[resource] != undefined) {
      if (quantity == "*") {
        delete fungibles_in_worktop[resource];
        for (var i = resource2!.length - 1; i >= 0; --i) {
          if ((<HTMLOptionElement>resource2![i]).value == resource) {
            resource2!.remove(i);
            resource3!.remove(i);
            fungible10!.remove(i - 1);
            break;
          }
        }
        for (var i = lsu5!.length - 1; i >= 0; --i) {
          if ((<HTMLOptionElement>lsu5![i]).value == resource) {
            lsu5!.remove(i);
            lsu7!.remove(i);
            send9!.remove(i);
            break;
          }
        }
        if (ociswap_listed_coins[resource] != undefined) {
          for (var i = send11!.length - 1; i >= 0; --i) {
            if ((<HTMLOptionElement>send11![i]).value == resource) {
              send11!.remove(i);
              send_1_12!.remove(i);
              send_1_12!.dispatchEvent(new Event("change"));
              break;
            }
          }
        } else if (ociswap_lp_pools[resource] != undefined) {
          for (var i = send13!.length - 1; i >= 0; --i) {
            if ((<HTMLOptionElement>send13![i]).value == resource) {
              send13!.remove(i);
              break;
            }
          }
        }
        if (defiplaza_listed_coins[resource] != undefined) {
          for (var i = send16!.length - 1; i >= 0; --i) {
            if ((<HTMLOptionElement>send16![i]).value == resource) {
              send16!.remove(i);
              break;
            }
          }
        }
        if (radixplanet_listed_coins[resource] != undefined) {
          for (var i = send19!.length - 1; i >= 0; --i) {
            if ((<HTMLOptionElement>send19![i]).value == resource) {
              send19!.remove(i);
              break;
            }
          }
        }
      } else {
        fungibles_in_worktop[resource] -= parseFloat(quantity);
        if (fungibles_in_worktop[resource] < epsilon) {
          fungibles_in_worktop[resource] = 0;
        }
      }
    } else if (resource == "*") {
      fungibles_in_worktop = {};
      resource2!.innerHTML = "<option></option>";
      resource3!.innerHTML = "<option></option>";
      lsu5!.innerHTML = "";
      lsu7!.innerHTML = "";
      send9!.innerHTML = "";
      send13!.innerHTML = "";
      send16!.innerHTML = "";
      send19!.innerHTML = "";
    }
    show_resources_in_worktop();
  }

  function remove_non_fungible_from_worktop(non_fungible: string) {
    const resource2 =
      document.querySelector<HTMLSelectElement>("#non_fungible2");
    const resource3 =
      document.querySelector<HTMLSelectElement>("#non_fungible3");
    const resource6 = document.querySelector<HTMLSelectElement>("#nft6");
    if (non_fungible == "*") {
      non_fungibles_in_worktop = [];
      resource2!.innerHTML = "<option></option>";
      resource3!.innerHTML = "<option></option>";
      resource6!.innerHTML = "";
    } else {
      const parts = non_fungible.split(" ");
      if (parts[1] == unknown_nft_id) {
        for (var i = non_fungibles_in_worktop.length - 1; i >= 0; i--) {
          if (non_fungibles_in_worktop[i].includes(parts[0])) {
            non_fungibles_in_worktop.splice(i, 1);
            resource2!.remove(i + 1);
            resource3!.remove(i + 1);
          }
        }
        for (var i = resource6!.length - 1; i >= 0; i--) {
          if ((<HTMLOptionElement>resource6![i]).value.includes(parts[0])) {
            resource6!.remove(i);
            break;
          }
        }
      } else {
        const index = non_fungibles_in_worktop.indexOf(non_fungible);
        if (index > -1) {
          non_fungibles_in_worktop.splice(index, 1);
          resource2!.remove(index + 1);
          resource3!.remove(index + 1);
          for (var i = resource6!.length - 1; i >= 0; i--) {
            if ((<HTMLOptionElement>resource6![i]).value == non_fungible) {
              resource6!.remove(i);
              break;
            }
          }
        }
      }
    }
    show_resources_in_worktop();
  }

  function find_fungible_symbol(resource: string) {
    if (fungibles_symbols[resource] !== undefined) {
      return fungibles_symbols[resource];
    }
    if (ociswap_listed_coins[resource] !== undefined) {
      return ociswap_listed_coins[resource];
    }
    if (ociswap_lp_names[resource] !== undefined) {
      return ociswap_lp_names[resource];
    }
    if (pool_units[resource] !== undefined) {
      return "LSU " + validators_names[pool_units[resource]].trim();
    }
    if (defiplaza_listed_coins[resource] !== undefined) {
      return defiplaza_listed_coins[resource];
    }
    if (alphadex_listed_coins[resource] !== undefined) {
      return alphadex_listed_coins[resource];
    }
    if (radixplanet_listed_coins[resource] !== undefined) {
      return radixplanet_listed_coins[resource];
    }
    if (radixplanet_lp[resource] !== undefined) {
      return radixplanet_lp[resource];
    }
    return resource;
  }

  function find_non_fungible_symbol(resource: string) {
    if (non_fungibles_symbols[resource] !== undefined) {
      return non_fungibles_symbols[resource];
    }
    if (claim_nft[resource] !== undefined) {
      return "Claim NFT " + validators_names[claim_nft[resource]].trim();
    }
    return resource;
  }

  function show_resources_in_worktop() {
    var resources = "";
    for (var fungible of Object.keys(fungibles_in_worktop)) {
      resources +=
        find_fungible_symbol(fungible) +
        " " +
        fungibles_in_worktop[fungible] +
        "\n";
    }
    for (var non_fungible of non_fungibles_in_worktop) {
      var res = non_fungible.split(" ");
      resources += find_non_fungible_symbol(res[0]) + " " + res[1] + "\n";
    }
    document.querySelector<HTMLTextAreaElement>("#worktop")!.value = resources;
  }

  document
    .querySelector<HTMLSelectElement>("#action")!
    .addEventListener("change", function () {
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      document.querySelector<HTMLDivElement>("#div1")!.hidden =
        this.selectedIndex != 0; //take coins from your account

      // --- SEND COINS ---
      document.querySelector<HTMLDivElement>("#div2")!.hidden =
        this.selectedIndex != 2; //send coins to your account
      document.querySelector<HTMLDivElement>("#div3")!.hidden =
        this.selectedIndex != 3; //send coins to someone else's account
      document.querySelector<HTMLDivElement>("#div10")!.hidden =
        this.selectedIndex != 4; //airdrop fungible coins
      var nfungibles =
        document.querySelector<HTMLSelectElement>("#fungible2")!.options
          .length - 1;
      if (
        (this.selectedIndex == 2 || this.selectedIndex == 3) &&
        nfungibles == 0 &&
        non_fungibles_in_worktop.length == 0
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some coins in the worktop first";
      } else if (this.selectedIndex == 4 && nfungibles == 0) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some fungible coins in the worktop first";
      }

      // --- STAKE/UNSTAKE ---
      document.querySelector<HTMLDivElement>("#div4")!.hidden =
        this.selectedIndex != 6; //stake your XRDs
      document.querySelector<HTMLDivElement>("#div5")!.hidden =
        this.selectedIndex != 7; //unstake your LSUs
      document.querySelector<HTMLDivElement>("#div6")!.hidden =
        this.selectedIndex != 8; //claim your unstaked XRDs
      if (
        this.selectedIndex == 6 &&
        (fungibles_in_worktop[xrd] == undefined ||
          fungibles_in_worktop[xrd] == 0)
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some XRDs in the worktop first";
      } else if (
        this.selectedIndex == 7 &&
        document.querySelector<HTMLSelectElement>("#lsu5")!.options.length == 0
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some LSUs in the worktop first";
      } else if (
        this.selectedIndex == 8 &&
        document.querySelector<HTMLSelectElement>("#nft6")!.options.length == 0
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put a Stake Claim NFT in the worktop first";
      }

      // --- OCISWAP ---
      document.querySelector<HTMLDivElement>("#div11")!.hidden =
        this.selectedIndex != 10; //swap coins on Ociswap
      document.querySelector<HTMLDivElement>("#div12")!.hidden =
        this.selectedIndex != 11; //add liquidity to Ociswap
      document.querySelector<HTMLDivElement>("#div13")!.hidden =
        this.selectedIndex != 12; //withdraw liquidity from Ociswap
      if (this.selectedIndex == 10) {
        if (
          document.querySelector<HTMLSelectElement>("#send11")!.options
            .length == 0
        ) {
          document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
            "put some coin listed on Ociswap in the worktop first";
        } else {
          document
            .querySelector<HTMLSelectElement>("#send11")!
            .dispatchEvent(new Event("change"));
        }
      } else if (
        this.selectedIndex == 11 &&
        document.querySelector<HTMLSelectElement>("#send_2_12")!.options
          .length == 0
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put two different coins listed on Ociswap in the worktop first";
      } else if (
        this.selectedIndex == 12 &&
        document.querySelector<HTMLSelectElement>("#send13")!.options.length ==
          0
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some LSUs in the worktop first";
      }

      // --- CAVIARNINE ---
      document.querySelector<HTMLDivElement>("#div7")!.hidden =
        this.selectedIndex != 14; //add your LSUs in Caviarnine LSU pool
      document.querySelector<HTMLDivElement>("#div8")!.hidden =
        this.selectedIndex != 15; //retrieve LSUs from Caviarnine LSU pool
      document.querySelector<HTMLDivElement>("#div9")!.hidden =
        this.selectedIndex != 16; //swap LSUs on Caviarnine
      if (
        (this.selectedIndex == 14 || this.selectedIndex == 16) &&
        document.querySelector<HTMLSelectElement>("#lsu7")!.options.length == 0
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some LSUs in the worktop first";
      } else if (
        this.selectedIndex == 15 &&
        (fungibles_in_worktop[lsulp] == undefined ||
          fungibles_in_worktop[lsulp] == 0)
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some LSULPs in the worktop first";
      }

      // --- GABLE ---
      document.querySelector<HTMLDivElement>("#div14")!.hidden =
        this.selectedIndex != 18; //get flashloan
      document.querySelector<HTMLDivElement>("#div15")!.hidden =
        this.selectedIndex != 19; //repay flashloan
      document.querySelector<HTMLDivElement>("#div18")!.hidden =
        this.selectedIndex != 20; //provide liquidity to Gable
      if (this.selectedIndex == 19 && gable_loan_quantity == 0) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "get a loan first";
      } else if (
        this.selectedIndex == 20 &&
        (fungibles_in_worktop[gable_lsu] == undefined ||
          fungibles_in_worktop[gable_lsu] == 0)
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some Gable LSUs in the worktop first";
      }

      // --- DEFIPLAZA ---
      document.querySelector<HTMLDivElement>("#div16")!.hidden =
        this.selectedIndex != 22; //swap coins at DefiPlaza
      if (
        this.selectedIndex == 22 &&
        document.querySelector<HTMLSelectElement>("#send16")!.options.length ==
          0
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some coin listed on DefiPlaza in the worktop first";
      }

      // --- ALPHADEX ---
      document.querySelector<HTMLDivElement>("#div17")!.hidden =
        this.selectedIndex != 24; //swap coins at AlphaDEX
      if (
        this.selectedIndex == 24 &&
        document.querySelector<HTMLSelectElement>("#send17")!.options.length ==
          0
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some coin listed on AlphaDEX in the worktop first";
      }

      // --- RADIXPLANET ---
      document.querySelector<HTMLDivElement>("#div19")!.hidden =
        this.selectedIndex != 26; //swap coins at RadixPlanet
      if (
        this.selectedIndex == 26 &&
        document.querySelector<HTMLSelectElement>("#send19")!.options.length ==
          0
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some coin listed on RadixPlanet in the worktop first";
      }

      // --- WEFT ---
      document.querySelector<HTMLDivElement>("#div20")!.hidden =
        this.selectedIndex != 28; //redeem your WEFT
      if (
        this.selectedIndex == 28 &&
        document.querySelector<HTMLSelectElement>("#nft20")!.options.length == 0
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "you don't have a Weft Claimer NFT";
      }
    });

  document
    .querySelector<HTMLSelectElement>("#account1")!
    .addEventListener("change", function () {
      const selectFungible1 =
        document.querySelector<HTMLSelectElement>("#fungible1");
      selectFungible1!.innerHTML = "<option></option>";
      for (var resource of Object.keys(fungibles_in_accounts[this.value])) {
        selectFungible1!.options[selectFungible1!.options.length] = new Option(
          find_fungible_symbol(resource),
          resource
        );
      }
      document.querySelector<HTMLInputElement>("#quantity1")!.value = "";
      const selectNonFungible1 =
        document.querySelector<HTMLSelectElement>("#non_fungible1");
      selectNonFungible1!.innerHTML = "<option></option>";
      for (var non_fungible of non_fungibles_in_accounts[this.value]) {
        const res = non_fungible.split(" ");
        selectNonFungible1!.options[selectNonFungible1!.options.length] =
          new Option(
            find_non_fungible_symbol(res[0]) + " " + res[1],
            non_fungible
          );
      }
    });

  document
    .querySelector<HTMLSelectElement>("#fungible1")!
    .addEventListener("change", function () {
      if (this.selectedIndex > 0) {
        const account =
          document.querySelector<HTMLSelectElement>("#account1")!.value;
        document.querySelector<HTMLInputElement>("#quantity1")!.value =
          number_to_string(fungibles_in_accounts[account][this.value]);
      } else {
        document.querySelector<HTMLInputElement>("#quantity1")!.value = "";
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction1")!
    .addEventListener("click", function () {
      const account =
        document.querySelector<HTMLSelectElement>("#account1")!.value;
      const selectFungible1 =
        document.querySelector<HTMLSelectElement>("#fungible1");
      const selectNonFungible1 =
        document.querySelector<HTMLSelectElement>("#non_fungible1");

      if (
        selectFungible1!.selectedIndex < 1 &&
        selectNonFungible1!.selectedIndex < 1
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerText =
          "no coins selected";
        return false;
      } else {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "&nbsp;";
      }

      if (selectFungible1!.selectedIndex > 0) {
        const quantity =
          document.querySelector<HTMLInputElement>("#quantity1")!.value;
        if (!quantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
          document.querySelector<HTMLParagraphElement>("#warn")!.innerText =
            "invalid quantity!";
        } else {
          var q = parseFloat(quantity);
          if (q > 0) {
            const resource = selectFungible1!.value;
            if (q > fungibles_in_accounts[account][resource]) {
              q = fungibles_in_accounts[account][resource];
            }
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "CALL_METHOD\n" +
              '    Address("' +
              account +
              '")\n' +
              '    "withdraw"\n' +
              '    Address("' +
              resource +
              '")\n' +
              '    Decimal("' +
              String(q) +
              '")\n;\n';
            add_fungible_to_worktop(resource, q);
            remove_fungible_from_account(account, resource, q);
          }
        }
      }

      if (selectNonFungible1!.selectedIndex > 0) {
        const non_fungible = selectNonFungible1!.value.split(" ");
        document.querySelector<HTMLTextAreaElement>(
          "#transaction_manifest"
        )!.value +=
          "CALL_METHOD\n" +
          '    Address("' +
          account +
          '")\n' +
          '    "withdraw_non_fungibles"\n' +
          '    Address("' +
          non_fungible[0] +
          '")\n' +
          '    Array<NonFungibleLocalId>(\n        NonFungibleLocalId("' +
          non_fungible[1] +
          '")\n    )\n;\n';
        add_non_fungible_to_worktop(selectNonFungible1!.value);
        const i = non_fungibles_in_accounts[account].indexOf(
          selectNonFungible1!.value
        );
        if (i != -1) {
          non_fungibles_in_accounts[account].splice(i, 1);
        }
      }

      document
        .querySelector<HTMLSelectElement>("#account1")!
        .dispatchEvent(new Event("change"));
    });

  document
    .querySelector<HTMLInputElement>("#worktop2")!
    .addEventListener("change", function () {
      document.querySelector<HTMLInputElement>("#all2")!.disabled =
        this.checked;
      document.querySelector<HTMLInputElement>("#quantity2")!.disabled =
        this.checked ||
        document.querySelector<HTMLInputElement>("#all2")!.checked;
      document.querySelector<HTMLSelectElement>("#fungible2")!.disabled =
        this.checked;
      document.querySelector<HTMLSelectElement>("#non_fungible2")!.disabled =
        this.checked;
      if (this.checked) {
        document.querySelector<HTMLInputElement>("#all2")!.checked = true;
        document.querySelector<HTMLInputElement>("#quantity2")!.value = "";
        document.querySelector<HTMLSelectElement>(
          "#fungible2"
        )!.selectedIndex = 0;
        document.querySelector<HTMLSelectElement>(
          "#non_fungible2"
        )!.selectedIndex = 0;
      }
    });

  document
    .querySelector<HTMLInputElement>("#all2")!
    .addEventListener("change", function () {
      const quantity2 = document.querySelector<HTMLInputElement>("#quantity2");
      if (
        this.checked ||
        document.querySelector<HTMLInputElement>("#worktop2")!.checked
      ) {
        quantity2!.disabled = true;
        quantity2!.value = "";
      } else {
        quantity2!.disabled = false;
        const fungible2 =
          document.querySelector<HTMLSelectElement>("#fungible2")!.value;
        if (fungible2 != "") {
          quantity2!.value = String(fungibles_in_worktop[fungible2]);
        }
      }
    });

  document
    .querySelector<HTMLSelectElement>("#fungible2")!
    .addEventListener("change", function () {
      const all2 = document.querySelector<HTMLInputElement>("#all2");
      const quantity2 = document.querySelector<HTMLInputElement>("#quantity2");
      if (this.selectedIndex > 0) {
        all2!.disabled = false;
        if (!all2!.checked) {
          quantity2!.value = String(fungibles_in_worktop[this.value]);
        }
      } else {
        all2!.disabled = true;
        quantity2!.disabled = true;
        quantity2!.value = "";
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction2")!
    .addEventListener("click", function () {
      const account =
        document.querySelector<HTMLSelectElement>("#account2")!.value;

      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      if (document.querySelector<HTMLInputElement>("#worktop2")!.checked) {
        document.querySelector<HTMLTextAreaElement>(
          "#transaction_manifest"
        )!.value +=
          "CALL_METHOD\n" +
          '    Address("' +
          account +
          '")\n' +
          '    "deposit_batch"\n' +
          '    Expression("ENTIRE_WORKTOP")\n;\n';
        for (var f of Object.keys(fungibles_in_worktop)) {
          add_fungible_to_account(account, f, fungibles_in_worktop[f]);
        }
        remove_fungible_from_worktop("*", "*");
        for (var nf of non_fungibles_in_worktop) {
          add_non_fungible_to_account(account, nf);
        }
        remove_non_fungible_from_worktop("*");
      } else {
        const resource =
          document.querySelector<HTMLSelectElement>("#fungible2")!.value;
        if (resource.length > 0) {
          if (document.querySelector<HTMLInputElement>("#all2")!.checked) {
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "TAKE_ALL_FROM_WORKTOP\n" +
              '    Address("' +
              resource +
              '")\n' +
              '    Bucket("bucket' +
              bucket_number +
              '")\n;\n' +
              "CALL_METHOD\n" +
              '    Address("' +
              account +
              '")\n' +
              '    "deposit"\n' +
              '    Bucket("bucket' +
              bucket_number++ +
              '")\n;\n';
            add_fungible_to_account(
              account,
              resource,
              fungibles_in_worktop[resource]
            );
            remove_fungible_from_worktop(resource, "*");
          } else {
            const quantity =
              document.querySelector<HTMLInputElement>("#quantity2")!.value;
            if (!quantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
              document.querySelector<HTMLParagraphElement>("#warn")!.innerText =
                "invalid quantity!";
            } else {
              document.querySelector<HTMLInputElement>("#quantity2")!.value =
                "";
              document.querySelector<HTMLTextAreaElement>(
                "#transaction_manifest"
              )!.value +=
                "TAKE_FROM_WORKTOP\n" +
                '    Address("' +
                resource +
                '")\n' +
                '    Decimal("' +
                quantity +
                '")\n' +
                '    Bucket("bucket' +
                bucket_number +
                '")\n;\n' +
                "CALL_METHOD\n" +
                '    Address("' +
                account +
                '")\n' +
                '    "deposit"\n' +
                '    Bucket("bucket' +
                bucket_number++ +
                '")\n;\n';
              add_fungible_to_account(account, resource, parseFloat(quantity));
              remove_fungible_from_worktop(resource, quantity);
            }
          }
        }

        const non_fungible =
          document.querySelector<HTMLSelectElement>("#non_fungible2")!.value;
        if (non_fungible.length > 0) {
          const res = non_fungible.split(" ");
          if (res[1] == unknown_nft_id) {
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "TAKE_ALL_FROM_WORKTOP\n" +
              '    Address("' +
              res[0] +
              '")\n' +
              '    Bucket("bucket' +
              bucket_number +
              '")\n;\n';
          } else {
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "TAKE_NON_FUNGIBLES_FROM_WORKTOP\n" +
              '    Address("' +
              res[0] +
              '")\n' +
              "    Array<NonFungibleLocalId>(\n" +
              '        NonFungibleLocalId("' +
              res[1] +
              '")\n    )\n' +
              '    Bucket("bucket' +
              bucket_number +
              '")\n;\n';
          }
          document.querySelector<HTMLTextAreaElement>(
            "#transaction_manifest"
          )!.value +=
            "CALL_METHOD\n" +
            '    Address("' +
            account +
            '")\n' +
            '    "deposit"\n' +
            '    Bucket("bucket' +
            bucket_number++ +
            '")\n;\n';
          remove_non_fungible_from_worktop(non_fungible);
        }
      }
      document.querySelector<HTMLSelectElement>(
        "#fungible2"
      )!.selectedIndex = 0;
      document.querySelector<HTMLSelectElement>(
        "#non_fungible2"
      )!.selectedIndex = 0;
    });

  document
    .querySelector<HTMLInputElement>("#worktop3")!
    .addEventListener("change", function () {
      document.querySelector<HTMLInputElement>("#all3")!.disabled =
        this.checked;
      document.querySelector<HTMLInputElement>("#quantity3")!.disabled =
        this.checked ||
        document.querySelector<HTMLInputElement>("#all3")!.checked;
      document.querySelector<HTMLSelectElement>("#fungible3")!.disabled =
        this.checked;
      document.querySelector<HTMLSelectElement>("#non_fungible3")!.disabled =
        this.checked;
      if (this.checked) {
        document.querySelector<HTMLInputElement>("#all3")!.checked = true;
        document.querySelector<HTMLInputElement>("#quantity3")!.value = "";
        document.querySelector<HTMLSelectElement>(
          "#fungible3"
        )!.selectedIndex = 0;
        document.querySelector<HTMLSelectElement>(
          "#non_fungible3"
        )!.selectedIndex = 0;
      }
    });

  document
    .querySelector<HTMLInputElement>("#all3")!
    .addEventListener("change", function () {
      document.querySelector<HTMLInputElement>("#quantity3")!.disabled =
        this.checked ||
        document.querySelector<HTMLInputElement>("#worktop3")!.checked;
      if (this.checked) {
        document.querySelector<HTMLInputElement>("#quantity3")!.value = "";
      }
    });

  document
    .querySelector<HTMLSelectElement>("#fungible3")!
    .addEventListener("change", function () {
      if (this.selectedIndex > 0) {
        document.querySelector<HTMLInputElement>("#all3")!.disabled = false;
      } else {
        document.querySelector<HTMLInputElement>("#all3")!.disabled = true;
        document.querySelector<HTMLInputElement>("#all3")!.checked = true;
        document.querySelector<HTMLInputElement>("#quantity3")!.disabled = true;
        document.querySelector<HTMLInputElement>("#quantity3")!.value = "";
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction3")!
    .addEventListener("click", function () {
      const fail = document.querySelector<HTMLSelectElement>("#fail3")!.value;
      const account = document
        .querySelector<HTMLInputElement>("#account3")!
        .value.trim()
        .toLowerCase();

      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      if (!account.match(/^account_rdx1[0-9a-z]{54}$/)) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerText =
          "invalid account!";
        return false;
      }

      if (document.querySelector<HTMLInputElement>("#worktop3")!.checked) {
        document.querySelector<HTMLTextAreaElement>(
          "#transaction_manifest"
        )!.value +=
          "CALL_METHOD\n" +
          '    Address("' +
          account +
          '")\n' +
          '    "try_deposit_batch_or_' +
          fail +
          '"\n' +
          '    Expression("ENTIRE_WORKTOP")\n' +
          "    Enum<0u8>()\n;\n";
        if (fail == "abort") {
          remove_fungible_from_worktop("*", "*");
          remove_non_fungible_from_worktop("*");
        }
      } else {
        var fungible =
          document.querySelector<HTMLSelectElement>("#fungible3")!.value;
        if (fungible.length > 0) {
          if (document.querySelector<HTMLInputElement>("#all3")!.checked) {
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "TAKE_ALL_FROM_WORKTOP\n" +
              '    Address("' +
              fungible +
              '")\n' +
              '    Bucket("bucket' +
              bucket_number +
              '")\n;\n' +
              "CALL_METHOD\n" +
              '    Address("' +
              account +
              '")\n' +
              '    "try_deposit_or_' +
              fail +
              '"\n' +
              '    Bucket("bucket' +
              bucket_number++ +
              '")\n' +
              "    Enum<0u8>()\n;\n";
            if (fail == "abort") {
              remove_fungible_from_worktop(fungible, "*");
            }
          } else {
            var quantity =
              document.querySelector<HTMLInputElement>("#quantity3")!.value;
            if (!quantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
              document.querySelector<HTMLInputElement>("#warn")!.innerText =
                "invalid quantity!";
            } else {
              document.querySelector<HTMLInputElement>("#quantity3")!.value =
                "";
              document.querySelector<HTMLTextAreaElement>(
                "#transaction_manifest"
              )!.value +=
                "TAKE_FROM_WORKTOP\n" +
                '    Address("' +
                fungible +
                '")\n' +
                '    Decimal("' +
                quantity +
                '")\n' +
                '    Bucket("bucket' +
                bucket_number +
                '")\n;\n' +
                "CALL_METHOD\n" +
                '    Address("' +
                account +
                '")\n' +
                '    "try_deposit_or_' +
                fail +
                '"\n' +
                '    Bucket("bucket' +
                bucket_number +
                '")\n' +
                "    Enum<0u8>()\n;\n";
              remove_fungible_from_worktop(fungible, quantity);
            }
          }
        }

        const non_fungible =
          document.querySelector<HTMLSelectElement>("#non_fungible3")!.value;
        if (non_fungible.length > 0) {
          const res = non_fungible.split(" ");
          if (res[1] == unknown_nft_id) {
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "TAKE_ALL_FROM_WORKTOP\n" +
              '    Address("' +
              res[0] +
              '")\n' +
              '    Bucket("bucket' +
              bucket_number +
              '")\n;\n';
          } else {
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "TAKE_NON_FUNGIBLES_FROM_WORKTOP\n" +
              '    Address("' +
              res[0] +
              '")\n' +
              "    Array<NonFungibleLocalId>(\n" +
              '        NonFungibleLocalId("' +
              res[1] +
              '")\n    )\n' +
              '    Bucket("bucket' +
              bucket_number +
              '")\n;\n';
          }
          document.querySelector<HTMLTextAreaElement>(
            "#transaction_manifest"
          )!.value +=
            "CALL_METHOD\n" +
            '    Address("' +
            account +
            '")\n' +
            '    "try_deposit_or_' +
            fail +
            '"\n' +
            '    Bucket("bucket' +
            bucket_number++ +
            '")\n;\n';
          if (fail == "abort") {
            remove_non_fungible_from_worktop(non_fungible);
          }
        }
      }
    });

  document
    .querySelector<HTMLInputElement>("#all4")!
    .addEventListener("change", function () {
      document.querySelector<HTMLInputElement>("#quantity4")!.disabled =
        this.checked;
      if (this.checked) {
        document.querySelector<HTMLInputElement>("#quantity4")!.value = "";
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction4")!
    .addEventListener("click", function () {
      const validator =
        document.querySelector<HTMLSelectElement>("#validator4")!.value;
      var q = fungibles_in_worktop[xrd];
      if (q < 90 || q == undefined) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "not enough XRDs in worktop";
        return false;
      }
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      if (document.querySelector<HTMLInputElement>("#all4")!.checked) {
        document.querySelector<HTMLTextAreaElement>(
          "#transaction_manifest"
        )!.value +=
          "TAKE_ALL_FROM_WORKTOP\n" +
          '    Address("' +
          xrd +
          '")\n' +
          '    Bucket("bucket' +
          bucket_number +
          '")\n;\n' +
          "CALL_METHOD\n" +
          '    Address("' +
          validator +
          '")\n' +
          '    "stake"\n' +
          '    Bucket("bucket' +
          bucket_number++ +
          '")\n;\n';
        remove_fungible_from_worktop(xrd, "*");
      } else {
        const quantity =
          document.querySelector<HTMLInputElement>("#quantity4")!.value;
        if (!quantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
          document.querySelector<HTMLInputElement>("#warn")!.innerText =
            "invalid quantity!";
          return false;
        }
        q = parseFloat(quantity);
        document.querySelector<HTMLTextAreaElement>(
          "#transaction_manifest"
        )!.value +=
          "TAKE_FROM_WORKTOP\n" +
          '   Address("' +
          xrd +
          '")\n' +
          '   Decimal("' +
          quantity +
          '")\n' +
          '   Bucket("bucket' +
          bucket_number +
          '")\n;\n' +
          "CALL_METHOD\n" +
          '    Address("' +
          validator +
          '")\n' +
          '    "stake"\n' +
          '    Bucket("bucket' +
          bucket_number++ +
          '")\n;\n';
        remove_fungible_from_worktop(xrd, quantity);
      }
      for (var lsu of Object.keys(pool_units)) {
        if (pool_units[lsu] == validator) {
          add_fungible_to_worktop(lsu, q);
          break;
        }
      }
    });

  document
    .querySelector<HTMLInputElement>("#all5")!
    .addEventListener("change", function () {
      document.querySelector<HTMLInputElement>("#quantity5")!.disabled =
        this.checked;
      if (this.checked) {
        document.querySelector<HTMLInputElement>("#quantity5")!.value = "";
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction5")!
    .addEventListener("click", function () {
      const lsu = document.querySelector<HTMLSelectElement>("#lsu5")!.value;
      if (lsu == "") {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "there are no LSU in the worktop";
        return false;
      }
      const validator = pool_units[lsu];

      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      if (document.querySelector<HTMLInputElement>("#all5")!.checked) {
        document.querySelector<HTMLTextAreaElement>(
          "#transaction_manifest"
        )!.value +=
          "TAKE_ALL_FROM_WORKTOP\n" +
          '    Address("' +
          lsu +
          '")\n' +
          '    Bucket("bucket' +
          bucket_number +
          '")\n;\n' +
          "CALL_METHOD\n" +
          '    Address("' +
          validator +
          '")\n' +
          '    "unstake"\n' +
          '    Bucket("bucket' +
          bucket_number++ +
          '")\n;\n';
        remove_fungible_from_worktop(lsu, "*");
      } else {
        const quantity =
          document.querySelector<HTMLInputElement>("#quantity5")!.value;
        if (!quantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
          document.querySelector<HTMLInputElement>("#warn")!.innerText =
            "invalid quantity!";
          return false;
        }
        document.querySelector<HTMLTextAreaElement>(
          "#transaction_manifest"
        )!.value +=
          "TAKE_FROM_WORKTOP\n" +
          '    Address("' +
          lsu +
          '")\n' +
          '    Decimal("' +
          quantity +
          '")\n' +
          '    Bucket("bucket' +
          bucket_number +
          '")\n;\n' +
          "CALL_METHOD\n" +
          '    Address("' +
          validator +
          '")\n' +
          '    "unstake"\n' +
          '    Bucket("bucket' +
          bucket_number++ +
          '")\n;\n';
        remove_fungible_from_worktop(lsu, quantity);
      }
      for (var nft of Object.keys(claim_nft)) {
        if (claim_nft[nft] == validator) {
          add_non_fungible_to_worktop(nft + " " + unknown_nft_id);
        }
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction6")!
    .addEventListener("click", function () {
      const nft = document.querySelector<HTMLSelectElement>("#nft6")!.value;
      const res = nft.split(" ");

      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      // TODO: check claim_epoch

      if (nft.length > 0) {
        const validator = claim_nft[res[0]];
        if (res[1] == unknown_nft_id) {
          document.querySelector<HTMLTextAreaElement>(
            "#transaction_manifest"
          )!.value +=
            "TAKE_ALL_FROM_WORKTOP\n" +
            '    Address("' +
            res[0] +
            '")\n' +
            '    Bucket("bucket' +
            bucket_number +
            '")\n;\n';
        } else {
          document.querySelector<HTMLTextAreaElement>(
            "#transaction_manifest"
          )!.value +=
            "TAKE_NON_FUNGIBLES_FROM_WORKTOP\n" +
            '    Address("' +
            res[0] +
            '")\n' +
            "    Array<NonFungibleLocalId>(\n" +
            '        NonFungibleLocalId("' +
            res[1] +
            '")\n    )\n' +
            '    Bucket("bucket' +
            bucket_number +
            '")\n;\n';
        }
        document.querySelector<HTMLTextAreaElement>(
          "#transaction_manifest"
        )!.value +=
          "CALL_METHOD\n" +
          '    Address("' +
          validator +
          '")\n' +
          '    "claim_xrd"\n' +
          '    Bucket("bucket' +
          bucket_number++ +
          '")\n;\n';
        remove_non_fungible_from_worktop(nft);
        if (claim_amount[res[1]] == undefined) {
          add_fungible_to_worktop(xrd, 0);
        } else {
          add_fungible_to_worktop(xrd, claim_amount[res[1]]);
        }
      }
    });

  document
    .querySelector<HTMLInputElement>("#all7")!
    .addEventListener("change", function () {
      document.querySelector<HTMLInputElement>("#quantity7")!.disabled =
        this.checked;
      if (this.checked) {
        document.querySelector<HTMLInputElement>("#quantity7")!.value = "";
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction7")!
    .addEventListener("click", function () {
      const lsu = document.querySelector<HTMLSelectElement>("#lsu7")!.value;
      const all7 = document.querySelector<HTMLInputElement>("#all7")!.checked;

      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      if (lsu.length > 0) {
        const nft = document.querySelector<HTMLSelectElement>("#nft7")!.value;
        var transaction_manifest = "";
        var q = fungibles_in_worktop[lsu];
        if (nft.length > 0) {
          const parts = nft.split(" ");
          transaction_manifest =
            "CALL_METHOD\n" +
            '    Address("' +
            parts[0] +
            '")\n' +
            '    "create_proof_of_non_fungibles"\n' +
            '    Address("' +
            lsu_pool_receipt +
            '")\n' +
            "    Array<NonFungibleLocalId>(\n" +
            '        NonFungibleLocalId("' +
            parts[1] +
            '")\n    )\n;\n' +
            "CREATE_PROOF_FROM_AUTH_ZONE_OF_NON_FUNGIBLES\n" +
            '    Address("' +
            lsu_pool_receipt +
            '")\n' +
            "    Array<NonFungibleLocalId>(\n" +
            '        NonFungibleLocalId("' +
            parts[1] +
            '")\n    )\n' +
            '    Proof("proof' +
            proof_number +
            '")\n;\n';
        }
        if (all7) {
          transaction_manifest +=
            "TAKE_ALL_FROM_WORKTOP\n" +
            '    Address("' +
            lsu +
            '")\n' +
            '    Bucket("bucket' +
            bucket_number +
            '")\n;\n';
          remove_fungible_from_worktop(lsu, "*");
        } else {
          const quantity =
            document.querySelector<HTMLInputElement>("#quantity7")!.value;
          if (!quantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
            document.querySelector<HTMLInputElement>("#warn")!.innerText =
              "invalid quantity!";
            return false;
          }
          q = parseFloat(quantity);
          transaction_manifest +=
            "TAKE_FROM_WORKTOP\n" +
            '    Address("' +
            lsu +
            '")\n' +
            '    Decimal("' +
            quantity +
            '")\n' +
            '    Bucket("bucket' +
            bucket_number +
            '")\n;\n';
          remove_fungible_from_worktop(lsu, quantity);
        }
        transaction_manifest +=
          "CALL_METHOD\n" +
          '    Address("' +
          lsu_pool +
          '")\n' +
          '    "add_liquidity"\n' +
          '    Bucket("bucket' +
          bucket_number++ +
          '")\n';
        if (nft.length > 0) {
          transaction_manifest +=
            "    Enum<1u8>(\n" +
            '        Proof("proof' +
            proof_number++ +
            '")\n    )\n;\n';
        } else {
          transaction_manifest += "    Enum<0u8>()\n;\n";
          add_non_fungible_to_worktop(lsu_pool_receipt + " " + unknown_nft_id);
        }
        add_fungible_to_worktop(lsulp, q);
        document.querySelector<HTMLTextAreaElement>(
          "#transaction_manifest"
        )!.value += transaction_manifest;
      }
    });

  document
    .querySelector<HTMLInputElement>("#all8")!
    .addEventListener("change", function () {
      document.querySelector<HTMLInputElement>("#quantity8")!.disabled =
        this.checked;
      if (this.checked) {
        document.querySelector<HTMLInputElement>("#quantity8")!.value = "";
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction8")!
    .addEventListener("click", function () {
      var q = fungibles_in_worktop[lsulp];
      if (q == undefined) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "there are no LSULP in the worktop";
        return false;
      }
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      const lsu = document.querySelector<HTMLSelectElement>("#lsu8")!.value;
      const all8 = document.querySelector<HTMLInputElement>("#all8")!.checked;
      const nft = document.querySelector<HTMLSelectElement>("#nft8")!.value;
      var transaction_manifest = "";
      if (nft.length > 0) {
        const parts = nft.split(" ");
        transaction_manifest =
          "CALL_METHOD\n" +
          '    Address("' +
          parts[0] +
          '")\n' +
          '    "create_proof_of_non_fungibles"\n' +
          '    Address("' +
          lsu_pool_receipt +
          '")\n' +
          "    Array<NonFungibleLocalId>(\n" +
          '        NonFungibleLocalId("' +
          parts[1] +
          '")\n    )\n;\n' +
          "CREATE_PROOF_FROM_AUTH_ZONE_OF_NON_FUNGIBLES\n" +
          '    Address("' +
          lsu_pool_receipt +
          '")\n' +
          "    Array<NonFungibleLocalId>(\n" +
          '        NonFungibleLocalId("' +
          parts[1] +
          '")\n    )\n' +
          '    Proof("proof' +
          proof_number +
          '")\n;\n';
      }
      if (all8) {
        transaction_manifest +=
          "TAKE_ALL_FROM_WORKTOP\n" +
          '    Address("' +
          lsulp +
          '")\n' +
          '    Bucket("bucket' +
          bucket_number +
          '")\n;\n';
        remove_fungible_from_worktop(lsulp, "*");
      } else {
        const quantity =
          document.querySelector<HTMLInputElement>("#quantity8")!.value;
        if (!quantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
          document.querySelector<HTMLInputElement>("#warn")!.innerText =
            "invalid quantity!";
          return false;
        }
        q = parseFloat(quantity);
        transaction_manifest +=
          "TAKE_FROM_WORKTOP\n" +
          '    Address("' +
          lsulp +
          '")\n' +
          '    Decimal("' +
          quantity +
          '")\n' +
          '    Bucket("bucket' +
          bucket_number +
          '")\n;\n';
        remove_fungible_from_worktop(lsulp, quantity);
      }
      transaction_manifest +=
        "CALL_METHOD\n" +
        '    Address("' +
        lsu_pool +
        '")\n' +
        '    "remove_liquidity"\n' +
        '    Bucket("bucket' +
        bucket_number++ +
        '")\n' +
        '    Address("' +
        lsu +
        '")\n';
      if (nft.length > 0) {
        transaction_manifest +=
          "    Enum<1u8>(\n" +
          '        Proof("proof' +
          proof_number++ +
          '")\n    )\n;\n';
      } else {
        transaction_manifest += "    Enum<0u8>()\n;\n";
        add_non_fungible_to_worktop(lsu_pool_receipt + " " + unknown_nft_id);
      }
      add_fungible_to_worktop(lsu, q);
      document.querySelector<HTMLTextAreaElement>(
        "#transaction_manifest"
      )!.value += transaction_manifest;
    });

  document
    .querySelector<HTMLInputElement>("#all9")!
    .addEventListener("change", function () {
      document.querySelector<HTMLInputElement>("#quantity9")!.disabled =
        this.checked;
      if (this.checked) {
        document.querySelector<HTMLInputElement>("#quantity9")!.value = "";
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction9")!
    .addEventListener("click", function () {
      const send = document.querySelector<HTMLSelectElement>("#send9")!.value;
      var q = fungibles_in_worktop[send];
      if (q == undefined) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "there are no LSU in the worktop";
        return false;
      }
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      const all = document.querySelector<HTMLInputElement>("#all9")!.checked;
      const receive =
        document.querySelector<HTMLSelectElement>("#receive9")!.value;
      var transaction_manifest = "";
      if (all) {
        transaction_manifest =
          "TAKE_ALL_FROM_WORKTOP\n" +
          '    Address("' +
          send +
          '")\n' +
          '    Bucket("bucket' +
          bucket_number +
          '")\n;\n';
        remove_fungible_from_worktop(send, "*");
      } else {
        const quantity =
          document.querySelector<HTMLInputElement>("#quantity9")!.value;
        if (!quantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
          document.querySelector<HTMLInputElement>("#warn")!.innerText =
            "invalid quantity!";
          return false;
        }
        q = parseFloat(quantity);
        transaction_manifest =
          "TAKE_FROM_WORKTOP\n" +
          '    Address("' +
          send +
          '")\n' +
          '    Decimal("' +
          quantity +
          '")\n' +
          '    Bucket("bucket' +
          bucket_number +
          '")\n;\n';
        remove_fungible_from_worktop(send, quantity);
      }

      transaction_manifest +=
        "CALL_METHOD\n" +
        '    Address("' +
        lsu_pool +
        '")\n' +
        '    "swap"\n' +
        '    Bucket("bucket' +
        bucket_number++ +
        '")\n' +
        '    Address("' +
        receive +
        '")\n;\n';
      add_fungible_to_worktop(receive, q);
      document.querySelector<HTMLTextAreaElement>(
        "#transaction_manifest"
      )!.value += transaction_manifest;
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction10")!
    .addEventListener("click", function () {
      const quantity =
        document.querySelector<HTMLInputElement>("#quantity10")!.value;
      if (!quantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
        document.querySelector<HTMLInputElement>("#warn")!.innerText =
          "invalid quantity!";
        return false;
      }
      var q = parseFloat(quantity);

      const fungible =
        document.querySelector<HTMLSelectElement>("#fungible10")!.value;
      if (fungible == "") {
        document.querySelector<HTMLInputElement>("#warn")!.innerText =
          "no coins in the worktop!";
        return false;
      }

      const recipients = document
        .querySelector<HTMLTextAreaElement>("#recipients10")!
        .value.split("\n");
      if (recipients.length * q > fungibles_in_worktop[fungible]) {
        document.querySelector<HTMLInputElement>("#warn")!.innerText =
          "not enough coins in the worktop!";
        return false;
      }

      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      var transaction_manifest = "";
      const account =
        document.querySelector<HTMLSelectElement>("#account10")!.value;
      for (var recipient of recipients) {
        recipient = recipient.trim().toLowerCase();
        if (recipient != "") {
          if (!recipient.match(/^account_rdx1[0-9a-z]{54}$/)) {
            document.querySelector<HTMLParagraphElement>("#warn")!.innerText =
              "invalid recipient: " + recipient;
            return false;
          }
          transaction_manifest +=
            "TAKE_FROM_WORKTOP\n" +
            '    Address("' +
            fungible +
            '")\n' +
            '    Decimal("' +
            quantity +
            '")\n' +
            '    Bucket("bucket' +
            bucket_number +
            '")\n;\n' +
            "CALL_METHOD\n" +
            '    Address("' +
            recipient +
            '")\n' +
            '    "try_deposit_or_refund' +
            '"\n' +
            '    Bucket("bucket' +
            bucket_number++ +
            '")\n' +
            "    Enum<0u8>()\n;\n";
          remove_fungible_from_worktop(fungible, quantity);
        }
      }

      transaction_manifest +=
        "TAKE_ALL_FROM_WORKTOP\n" +
        '    Address("' +
        fungible +
        '")\n' +
        '    Bucket("bucket' +
        bucket_number +
        '")\n;\n' +
        "CALL_METHOD\n" +
        '    Address("' +
        account +
        '")\n' +
        '    "deposit"\n' +
        '    Bucket("bucket' +
        bucket_number++ +
        '")\n;\n';
      add_fungible_to_account(
        account,
        fungible,
        fungibles_in_worktop[fungible]
      );
      remove_fungible_from_worktop(fungible, "*");
      document.querySelector<HTMLTextAreaElement>(
        "#transaction_manifest"
      )!.value += transaction_manifest;
      document.querySelector<HTMLTextAreaElement>("#recipients10")!.value = "";
      document.querySelector<HTMLInputElement>("#quantity10")!.value = "";
    });

  document
    .querySelector<HTMLInputElement>("#all11")!
    .addEventListener("change", function () {
      document.querySelector<HTMLInputElement>("#quantity11")!.disabled =
        this.checked;
      if (this.checked) {
        document.querySelector<HTMLInputElement>("#quantity11")!.value = "";
      }
    });

  document
    .querySelector<HTMLInputElement>("#send11")!
    .addEventListener("change", function () {
      const receiveSelect =
        document.querySelector<HTMLSelectElement>("#receive11");
      const send = document.querySelector<HTMLSelectElement>("#send11")!.value;

      receiveSelect!.innerHTML = "";
      for (var receive of Object.keys(ociswap_listed_coins)) {
        if (receive != send) {
          receiveSelect!.options[receiveSelect!.options.length] = new Option(
            find_fungible_symbol(receive),
            receive
          );
        }
      }
    });

  function build_ociswap_swaps(swaps: ociswap_swap[], quantity: string) {
    var transaction_manifest = "";
    for (var i of swaps) {
      if (quantity == "*") {
        remove_fungible_from_worktop(i.input_address, "*");
        transaction_manifest +=
          "TAKE_ALL_FROM_WORKTOP\n" +
          '    Address("' +
          i.input_address +
          '")\n' +
          '    Bucket("bucket' +
          bucket_number +
          '")\n;\n';
      } else {
        remove_fungible_from_worktop(i.input_address, quantity);
        transaction_manifest +=
          "TAKE_FROM_WORKTOP\n" +
          '    Address("' +
          i.input_address +
          '")\n' +
          '    Decimal("' +
          quantity +
          '")\n' +
          '    Bucket("bucket' +
          bucket_number +
          '")\n;\n';
        quantity = "*";
      }
      transaction_manifest +=
        "CALL_METHOD\n" +
        '    Address("' +
        i.pool_address +
        '")\n' +
        '    "swap' +
        '"\n' +
        '    Bucket("bucket' +
        bucket_number++ +
        '")\n;\n';
      add_fungible_to_worktop(
        i.output_address,
        parseFloat(i.output_amount.token)
      );
      document.querySelector<HTMLTextAreaElement>(
        "#transaction_manifest"
      )!.value += transaction_manifest;
    }
  }

  document
    .querySelector<HTMLButtonElement>("#add_instruction11")!
    .addEventListener("click", async function () {
      const send = document.querySelector<HTMLSelectElement>("#send11")!.value;
      if (send == "") {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "no coins to send";
        return false;
      }

      var q = fungibles_in_worktop[send];
      if (q == undefined) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "no coins to send";
        return false;
      }
      var quantity = "*";
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      const all = document.querySelector<HTMLInputElement>("#all11")!.checked;
      if (!all) {
        quantity =
          document.querySelector<HTMLInputElement>("#quantity11")!.value;
        if (!quantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
          document.querySelector<HTMLInputElement>("#warn")!.innerText =
            "invalid quantity!";
          return false;
        }
        q = parseFloat(quantity);
      }
      const receive =
        document.querySelector<HTMLSelectElement>("#receive11")!.value;

      const options = {
        method: "GET",
        headers: { accept: "application/json" },
      };
      fetch(
        "https://api.ociswap.com/preview/swap?input_address=" +
          send +
          "&input_amount=" +
          q +
          "&output_address=" +
          receive,
        options
      ).then((r1) => {
        if (r1.ok) {
          r1.json().then((j1) => {
            build_ociswap_swaps(j1.swaps, quantity);
          });
        } else {
          fetch(
            "https://api.ociswap.com/preview/swap?input_address=" +
              send +
              "&input_amount=" +
              q +
              "&output_address=" +
              xrd,
            options
          ).then((r2) => {
            if (r2.ok) {
              r2.json().then(async (j2) => {
                for (var i of j2.swaps) {
                  if (i.output_address == xrd) {
                    fetch(
                      "https://api.ociswap.com/preview/swap?input_address=" +
                        xrd +
                        "&input_amount=" +
                        i.output_amount.token +
                        "&output_address=" +
                        receive,
                      options
                    ).then((r3) => {
                      if (r3.ok) {
                        build_ociswap_swaps(j2.swaps, quantity);
                        r3.json().then(async (j3) => {
                          build_ociswap_swaps(j3.swaps, "*");
                        });
                      }
                    });
                  }
                }
              });
            }
          });
        }
      });
    });

  document
    .querySelector<HTMLInputElement>("#send_1_12")!
    .addEventListener("change", function () {
      const send_1_12 =
        document.querySelector<HTMLSelectElement>("#send_1_12")!.value;
      const send_2_12 = document.querySelector<HTMLSelectElement>("#send_2_12");

      send_2_12!.innerHTML = "";
      if (send_1_12 != undefined) {
        for (var r of Object.keys(ociswap_listed_coins)) {
          if (r != send_1_12 && fungibles_in_worktop[r] != undefined) {
            send_2_12!.options[send_2_12!.options.length] = new Option(
              find_fungible_symbol(r),
              r
            );
          }
        }

        if (!document.querySelector<HTMLInputElement>("#all12")!.checked) {
          document.querySelector<HTMLInputElement>("#quantity_1_12")!.value =
            number_to_string(fungibles_in_worktop[send_1_12]);
        }
      }
    });

  document
    .querySelector<HTMLInputElement>("#all12")!
    .addEventListener("change", function () {
      if (!document.querySelector<HTMLInputElement>("#all12")!.checked) {
        document.querySelector<HTMLInputElement>("#quantity_1_12")!.value =
          number_to_string(
            fungibles_in_worktop[
              document.querySelector<HTMLSelectElement>("#send_1_12")!.value
            ]
          );
        document.querySelector<HTMLInputElement>("#quantity_1_12")!.disabled =
          false;
      } else {
        document.querySelector<HTMLInputElement>("#quantity_1_12")!.value = "";
        document.querySelector<HTMLInputElement>("#quantity_1_12")!.disabled =
          true;
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction12")!
    .addEventListener("click", async function () {
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      const send_1_12 = document.querySelector<HTMLSelectElement>("#send_1_12");
      const send_2_12 = document.querySelector<HTMLSelectElement>("#send_2_12");
      if (send_1_12!.selectedIndex < 0 || send_2_12!.selectedIndex < 0) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "select coins to send";
        return false;
      }

      var send1 = send_1_12!.value;
      var quantity1 = 0;
      var send2 = send_2_12!.value;
      var quantity2 = fungibles_in_worktop[send_2_12!.value];
      var component = "";
      var lp_token = "";
      var lp_quantity = 0;

      var all = "";
      if (document.querySelector<HTMLInputElement>("#all12")!.checked) {
        quantity1 = fungibles_in_worktop[send_1_12!.value];
        all = send_1_12!.value;
      } else {
        const q =
          document.querySelector<HTMLSelectElement>("#quantity_1_12")!.value;
        if (!q.match(/^[0-9]+(\.[0-9]+)?$/)) {
          document.querySelector<HTMLInputElement>("#warn")!.innerText =
            "invalid quantity!";
          return false;
        }
        quantity1 = parseFloat(q);
      }
      var limit_condition = "x_amount=" + quantity1;

      const options = {
        method: "GET",
        headers: { accept: "application/json" },
      };
      fetch(
        "https://api.ociswap.com/pools?cursor=0&limit=1&token_address=" +
          send1 +
          "," +
          send2 +
          "&order=rank&direction=asc",
        options
      ).then((r1) => {
        if (!r1.ok) {
          document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
            "something went wrong";
          return false;
        }
        r1.json().then((j1) => {
          if (j1.data[0] == undefined) {
            document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
              "no such pool";
            return false;
          }
          component = j1.data[0].address;
          if (j1.data[0].x.token.address == send2) {
            const tmp_string = send1;
            const tmp_number = quantity1;
            send1 = send2;
            quantity1 = quantity2;
            send2 = tmp_string;
            quantity2 = tmp_number;
            limit_condition = "y_amount=" + quantity2;
          }

          fetch(
            "https://api.ociswap.com/preview/add-liquidity?pool_address=" +
              component +
              "&" +
              limit_condition,
            options
          ).then((r2) => {
            if (!r2.ok) {
              document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
                "something went wrong";
              return false;
            }
            r2.json().then(async (j2) => {
              const amount_x = parseFloat(j2.x_amount.token);
              const amount_y = parseFloat(j2.y_amount.token);
              if (amount_y > quantity2 || amount_x > quantity1) {
                if (amount_y > quantity2) {
                  limit_condition = "y_amount=" + quantity2;
                  all = send2;
                } else {
                  limit_condition = "x_amount=" + quantity1;
                  all = send1;
                }
                fetch(
                  "https://api.ociswap.com/preview/add-liquidity?pool_address=" +
                    component +
                    "&" +
                    limit_condition,
                  options
                ).then((r3) => {
                  if (!r3.ok) {
                    document.querySelector<HTMLParagraphElement>(
                      "#warn"
                    )!.innerHTML = "something went wrong";
                    return false;
                  }
                  r3.json().then((j3) => {
                    lp_quantity = parseFloat(j3.liquidity_amount);
                    quantity1 = parseFloat(j3.x_amount.token);
                    quantity2 = parseFloat(j3.y_amount.token);
                  });
                });
              } else {
                lp_quantity = parseFloat(j2.liquidity_amount);
                quantity1 = parseFloat(j2.x_amount.token);
                quantity2 = parseFloat(j2.y_amount.token);
              }

              for (var lp of Object.keys(ociswap_lp_pools)) {
                if (component == ociswap_lp_pools[lp]) {
                  lp_token = lp;
                  break;
                }
              }

              const textarea = document.querySelector<HTMLTextAreaElement>(
                "#transaction_manifest"
              );
              if (send1 == all) {
                remove_fungible_from_worktop(send1, "*");
                textarea!.value +=
                  "TAKE_ALL_FROM_WORKTOP\n" +
                  '    Address("' +
                  send1 +
                  '")\n' +
                  '    Bucket("bucket' +
                  bucket_number +
                  '")\n;\n';
              } else {
                remove_fungible_from_worktop(send1, String(quantity1));
                textarea!.value +=
                  "TAKE_FROM_WORKTOP\n" +
                  '    Address("' +
                  send1 +
                  '")\n' +
                  '    Decimal("' +
                  quantity1 +
                  '")\n' +
                  '    Bucket("bucket' +
                  bucket_number +
                  '")\n;\n';
              }
              if (send2 == all) {
                remove_fungible_from_worktop(send2, "*");
                textarea!.value +=
                  "TAKE_ALL_FROM_WORKTOP\n" +
                  '    Address("' +
                  send2 +
                  '")\n' +
                  '    Bucket("bucket' +
                  (bucket_number + 1) +
                  '")\n;\n';
              } else {
                remove_fungible_from_worktop(send2, String(quantity2));
                textarea!.value +=
                  "TAKE_FROM_WORKTOP\n" +
                  '    Address("' +
                  send2 +
                  '")\n' +
                  '    Decimal("' +
                  quantity2 +
                  '")\n' +
                  '    Bucket("bucket' +
                  (bucket_number + 1) +
                  '")\n;\n';
              }
              textarea!.value +=
                "CALL_METHOD\n" +
                '    Address("' +
                component +
                '")\n' +
                '    "add_liquidity"\n' +
                '    Bucket("bucket' +
                bucket_number++ +
                '")\n' +
                '    Bucket("bucket' +
                bucket_number++ +
                '")\n;\n';
              add_fungible_to_worktop(lp_token, lp_quantity);
            });
          });
        });
      });
    });

  document
    .querySelector<HTMLInputElement>("#send13")!
    .addEventListener("change", function () {
      const send13 =
        document.querySelector<HTMLSelectElement>("#send13")!.value;
      if (!document.querySelector<HTMLInputElement>("#all13")!.checked) {
        document.querySelector<HTMLInputElement>("#quantity13")!.value =
          number_to_string(fungibles_in_worktop[send13]);
      }
    });

  document
    .querySelector<HTMLInputElement>("#all13")!
    .addEventListener("change", function () {
      if (!document.querySelector<HTMLInputElement>("#all13")!.checked) {
        document.querySelector<HTMLInputElement>("#quantity13")!.value =
          number_to_string(
            fungibles_in_worktop[
              document.querySelector<HTMLSelectElement>("#send13")!.value
            ]
          );
        document.querySelector<HTMLInputElement>("#quantity13")!.disabled =
          false;
      } else {
        document.querySelector<HTMLInputElement>("#quantity13")!.value = "";
        document.querySelector<HTMLInputElement>("#quantity13")!.disabled =
          true;
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction13")!
    .addEventListener("click", async function () {
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      const send13 = document.querySelector<HTMLSelectElement>("#send13");
      if (send13!.selectedIndex < 0) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "select coins to send";
        return false;
      }

      var quantity13 = 0;
      if (document.querySelector<HTMLInputElement>("#all13")!.checked) {
        quantity13 = fungibles_in_worktop[send13!.value];
      } else {
        const q =
          document.querySelector<HTMLSelectElement>("#quantity13")!.value;
        if (!q.match(/^[0-9]+(\.[0-9]+)?$/)) {
          document.querySelector<HTMLInputElement>("#warn")!.innerText =
            "invalid quantity!";
          return false;
        }
        quantity13 = parseFloat(q);
      }

      const component = ociswap_lp_pools[send13!.value];
      var receive1 = "";
      var receive2 = "";
      const options = {
        method: "GET",
        headers: { accept: "application/json" },
      };
      fetch("https://api.ociswap.com/pools/" + component, options).then(
        (r1) => {
          if (!r1.ok) {
            document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
              "something went wrong";
            return false;
          }
          r1.json().then(async (j1) => {
            receive1 = j1.x.token.address;
            receive2 = j1.y.token.address;

            fetch(
              "https://api.ociswap.com/preview/remove-liquidity?pool_address=" +
                component +
                "&liquidity_amount=" +
                quantity13,
              options
            ).then((r2) => {
              if (!r2.ok) {
                document.querySelector<HTMLParagraphElement>(
                  "#warn"
                )!.innerHTML = "something went wrong";
                return false;
              }
              r2.json().then(async (j2) => {
                add_fungible_to_worktop(
                  receive1,
                  parseFloat(j2.x_amount.token)
                );
                add_fungible_to_worktop(
                  receive2,
                  parseFloat(j2.y_amount.token)
                );
              });
            });
          });
        }
      );

      const textarea = document.querySelector<HTMLTextAreaElement>(
        "#transaction_manifest"
      );
      if (document.querySelector<HTMLInputElement>("#all13")!.checked) {
        textarea!.value +=
          "TAKE_ALL_FROM_WORKTOP\n" +
          '    Address("' +
          send13!.value +
          '")\n' +
          '    Bucket("bucket' +
          bucket_number +
          '")\n;\n';
        remove_fungible_from_worktop(send13!.value, "*");
      } else {
        textarea!.value +=
          "TAKE_FROM_WORKTOP\n" +
          '    Address("' +
          send13!.value +
          '")\n' +
          '    Decimal("' +
          quantity13 +
          '")\n' +
          '    Bucket("bucket' +
          bucket_number +
          '")\n;\n';
        remove_fungible_from_worktop(send13!.value, String(quantity13));
      }
      textarea!.value +=
        "CALL_METHOD\n" +
        '    Address("' +
        component +
        '")\n' +
        '    "remove_liquidity"\n' +
        '    Bucket("bucket' +
        bucket_number++ +
        '")\n;\n';
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction14")!
    .addEventListener("click", function () {
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      if (gable_loan_quantity > 0) {
        document.querySelector<HTMLInputElement>("#warn")!.innerText =
          "can't handle multiple loans";
        return false;
      }

      const quantity =
        document.querySelector<HTMLInputElement>("#quantity14")!.value;
      if (!quantity.match(/^[0-9]+(\.[0-9]+)?$/)) {
        document.querySelector<HTMLInputElement>("#warn")!.innerText =
          "invalid quantity!";
        return false;
      }

      document.querySelector<HTMLTextAreaElement>(
        "#transaction_manifest"
      )!.value +=
        "CALL_METHOD\n" +
        '    Address("' +
        gable_component +
        '")\n' +
        '    "get_flashloan"\n' +
        '    Decimal("' +
        quantity +
        '")\n;\n';
      gable_loan_quantity = parseFloat(quantity);
      add_fungible_to_worktop(xrd, gable_loan_quantity);
      add_non_fungible_to_worktop(gable_transient_nft + " " + unknown_nft_id);
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction15")!
    .addEventListener("click", function () {
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      if (gable_loan_quantity == 0) {
        document.querySelector<HTMLInputElement>("#warn")!.innerText =
          "no loan to repay";
        return false;
      }

      var xrd_to_refund = gable_loan_quantity * (1 + gable_loan_fees);
      if (fungibles_in_worktop[xrd] < xrd_to_refund) {
        document.querySelector<HTMLInputElement>("#warn")!.innerText =
          "not enogh XRDs in the worktop";
        return false;
      }

      document.querySelector<HTMLTextAreaElement>(
        "#transaction_manifest"
      )!.value +=
        "TAKE_FROM_WORKTOP\n" +
        '    Address("' +
        xrd +
        '")\n' +
        '    Decimal("' +
        xrd_to_refund +
        '")\n' +
        '    Bucket("bucket' +
        bucket_number +
        '")\n;\n' +
        "TAKE_ALL_FROM_WORKTOP\n" +
        '    Address("' +
        gable_transient_nft +
        '")\n' +
        '    Bucket("bucket' +
        (bucket_number + 1) +
        '")\n;\n' +
        "CALL_METHOD\n" +
        '    Address("' +
        gable_component +
        '")\n' +
        '    "repay_flashloan"\n' +
        '    Bucket("bucket' +
        bucket_number++ +
        '")\n' +
        '    Bucket("bucket' +
        bucket_number++ +
        '")\n;\n';
      gable_loan_quantity = 0;
      remove_fungible_from_worktop(xrd, String(xrd_to_refund));
      remove_non_fungible_from_worktop(
        gable_transient_nft + " " + unknown_nft_id
      );
    });

  document
    .querySelector<HTMLInputElement>("#send16")!
    .addEventListener("change", function () {
      const send16 =
        document.querySelector<HTMLSelectElement>("#send16")!.value;
      const receive16 = document.querySelector<HTMLSelectElement>("#receive16");
      if (!document.querySelector<HTMLInputElement>("#all16")!.checked) {
        document.querySelector<HTMLInputElement>("#quantity16")!.value = String(
          fungibles_in_worktop[send16]
        );
      }
      receive16!.innerHTML = "";
      for (var receive of Object.keys(defiplaza_listed_coins)) {
        if (receive != send16) {
          receive16!.options[receive16!.options.length] = new Option(
            find_fungible_symbol(receive),
            receive
          );
        }
      }
    });

  document
    .querySelector<HTMLInputElement>("#all16")!
    .addEventListener("change", function () {
      if (!document.querySelector<HTMLInputElement>("#all16")!.checked) {
        document.querySelector<HTMLInputElement>("#quantity16")!.value = String(
          fungibles_in_worktop[
            document.querySelector<HTMLSelectElement>("#send16")!.value
          ]
        );
        document.querySelector<HTMLInputElement>("#quantity16")!.disabled =
          false;
      } else {
        document.querySelector<HTMLInputElement>("#quantity16")!.value = "";
        document.querySelector<HTMLInputElement>("#quantity16")!.disabled =
          true;
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction16")!
    .addEventListener("click", async function () {
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      const send16 =
        document.querySelector<HTMLSelectElement>("#send16")!.value;
      if (send16 == "") {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "select a coin to send";
        return false;
      }

      var quantity16: number;
      if (document.querySelector<HTMLInputElement>("#all16")!.checked) {
        quantity16 = fungibles_in_worktop[send16];
        remove_fungible_from_worktop(send16, "*");
        document.querySelector<HTMLTextAreaElement>(
          "#transaction_manifest"
        )!.value +=
          "TAKE_ALL_FROM_WORKTOP\n" +
          '    Address("' +
          send16 +
          '")\n' +
          '    Bucket("bucket' +
          bucket_number +
          '")\n;\n';
      } else {
        const q =
          document.querySelector<HTMLSelectElement>("#quantity16")!.value;
        if (!q.match(/^[0-9]+(\.[0-9]+)?$/)) {
          document.querySelector<HTMLInputElement>("#warn")!.innerText =
            "invalid quantity!";
          return false;
        }
        if (parseFloat(q) > fungibles_in_worktop[send16]) {
          quantity16 = fungibles_in_worktop[send16];
          remove_fungible_from_worktop(send16, "*");
          document.querySelector<HTMLTextAreaElement>(
            "#transaction_manifest"
          )!.value +=
            "TAKE_ALL_FROM_WORKTOP\n" +
            '    Address("' +
            send16 +
            '")\n' +
            '    Bucket("bucket' +
            bucket_number +
            '")\n;\n';
        } else {
          quantity16 = parseFloat(q);
          remove_fungible_from_worktop(send16, q);
          document.querySelector<HTMLTextAreaElement>(
            "#transaction_manifest"
          )!.value +=
            "TAKE_FROM_WORKTOP\n" +
            '    Address("' +
            send16 +
            '")\n' +
            '    Decimal("' +
            q +
            '")\n' +
            '    Bucket("bucket' +
            bucket_number +
            '")\n;\n';
        }
      }

      const receive16 =
        document.querySelector<HTMLSelectElement>("#receive16")!.value;

      const url =
        "https://tmbuilder.stakingcoins.eu/defiplaza.php?inputToken=" +
        send16 +
        "&outputToken=" +
        receive16 +
        "&inputAmount=" +
        quantity16;
      fetch(url).then((r) => {
        if (r.ok) {
          r.json().then((j) => {
            add_fungible_to_worktop(receive16, j.quoteToken.amount);
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "CALL_METHOD\n" +
              '    Address("' +
              defiplaza_component +
              '")\n' +
              '    "swap"\n' +
              '    Bucket("bucket' +
              bucket_number++ +
              '")\n' +
              '    Address("' +
              receive16 +
              '")\n;\n';
          });
        }
      });
      document
        .querySelector<HTMLSelectElement>("#send16")!
        .dispatchEvent(new Event("change"));
    });

  document
    .querySelector<HTMLInputElement>("#send17")!
    .addEventListener("change", function () {
      const send17 =
        document.querySelector<HTMLSelectElement>("#send17")!.value;
      const receive17 = document.querySelector<HTMLSelectElement>("#receive17");
      if (!document.querySelector<HTMLInputElement>("#all17")!.checked) {
        document.querySelector<HTMLInputElement>("#quantity17")!.value = String(
          fungibles_in_worktop[send17]
        );
      }
      receive17!.innerHTML = "";
      for (var receive of Object.keys(alphadex_listed_coins)) {
        if (receive != send17) {
          receive17!.options[receive17!.options.length] = new Option(
            find_fungible_symbol(receive),
            receive
          );
        }
      }
    });

  document
    .querySelector<HTMLInputElement>("#all17")!
    .addEventListener("change", function () {
      if (!document.querySelector<HTMLInputElement>("#all17")!.checked) {
        document.querySelector<HTMLInputElement>("#quantity17")!.value = String(
          fungibles_in_worktop[
            document.querySelector<HTMLSelectElement>("#send17")!.value
          ]
        );
        document.querySelector<HTMLInputElement>("#quantity17")!.disabled =
          false;
      } else {
        document.querySelector<HTMLInputElement>("#quantity17")!.value = "";
        document.querySelector<HTMLInputElement>("#quantity17")!.disabled =
          true;
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction17")!
    .addEventListener("click", async function () {
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      const send17 =
        document.querySelector<HTMLSelectElement>("#send17")!.value;
      if (send17 == "") {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "select a coin to send";
        return false;
      }

      var quantity17: number;
      if (document.querySelector<HTMLInputElement>("#all17")!.checked) {
        quantity17 = fungibles_in_worktop[send17];
      } else {
        const q =
          document.querySelector<HTMLSelectElement>("#quantity17")!.value;
        if (!q.match(/^[0-9]+(\.[0-9]+)?$/)) {
          document.querySelector<HTMLInputElement>("#warn")!.innerText =
            "invalid quantity!";
          return false;
        }
        if (parseFloat(q) > fungibles_in_worktop[send17]) {
          quantity17 = fungibles_in_worktop[send17];
        } else {
          quantity17 = parseFloat(q);
        }
      }

      const receive17 =
        document.querySelector<HTMLSelectElement>("#receive17")!.value;
      var fee_badge = "5";
      if (donor || staked_amount >= 5000) {
        fee_badge = "6";
      }
      const body = JSON.stringify({
        fromTokenAddress: send17,
        fromTokenAmount: String(quantity17),
        toTokenAddress: receive17,
        maxSlippage: "1",
        platformId: fee_badge,
      });

      fetch("https://api.alphadex.net/v0/quote/swap", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: body,
      }).then((r1) => {
        if (r1.status != 200 && r1.status != 406) {
          document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
            "something went wrong";
          return false;
        }
        r1.json().then(async (j1) => {
          if (r1.status == 200) {
            if (quantity17 == fungibles_in_worktop[send17]) {
              remove_fungible_from_worktop(send17, "*");
              document.querySelector<HTMLTextAreaElement>(
                "#transaction_manifest"
              )!.value +=
                "TAKE_ALL_FROM_WORKTOP\n" +
                '    Address("' +
                send17 +
                '")\n' +
                '    Bucket("bucket' +
                bucket_number +
                '")\n;\n';
            } else {
              remove_fungible_from_worktop(send17, String(quantity17));
              document.querySelector<HTMLTextAreaElement>(
                "#transaction_manifest"
              )!.value +=
                "TAKE_FROM_WORKTOP\n" +
                '    Address("' +
                send17 +
                '")\n' +
                '    Decimal("' +
                quantity17 +
                '")\n' +
                '    Bucket("bucket' +
                bucket_number +
                '")\n;\n';
            }
          } else {
            quantity17 = j1.quotes[0].fromAmount - epsilon;
            remove_fungible_from_worktop(send17, String(quantity17));
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "TAKE_FROM_WORKTOP\n" +
              '    Address("' +
              send17 +
              '")\n' +
              '    Decimal("' +
              quantity17 +
              '")\n' +
              '    Bucket("bucket' +
              bucket_number +
              '")\n;\n';
          }
          var next = "";
          for (var swaps of j1.quotes) {
            var to_coin: string;
            if (send17 == xrd || next != "") {
              to_coin = receive17;
            } else {
              to_coin = xrd;
            }
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              next +
              "CALL_METHOD\n" +
              '    Address("' +
              swaps.pairAddress +
              '")\n' +
              '    "swap"\n' +
              '    Bucket("bucket' +
              bucket_number++ +
              '")\n' +
              '    Decimal("100")\n' +
              "    " +
              fee_badge +
              "u32\n;\n";
            if (to_coin == receive17) {
              add_fungible_to_worktop(receive17, swaps.toAmount);
            } else {
              next =
                "TAKE_ALL_FROM_WORKTOP\n" +
                '    Address("' +
                to_coin +
                '")\n' +
                '    Bucket("bucket' +
                bucket_number +
                '")\n;\n';
            }
          }
        });
      });
    });

  document
    .querySelector<HTMLInputElement>("#all18")!
    .addEventListener("change", function () {
      if (!document.querySelector<HTMLInputElement>("#all18")!.checked) {
        if (fungibles_in_worktop[gable_lsu] != undefined) {
          document.querySelector<HTMLInputElement>("#quantity18")!.value =
            String(fungibles_in_worktop[gable_lsu]);
        }
        document.querySelector<HTMLInputElement>("#quantity18")!.disabled =
          false;
      } else {
        document.querySelector<HTMLInputElement>("#quantity18")!.value = "";
        document.querySelector<HTMLInputElement>("#quantity18")!.disabled =
          true;
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction18")!
    .addEventListener("click", async function () {
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      var quantity18: number;
      if (document.querySelector<HTMLInputElement>("#all18")!.checked) {
        quantity18 = fungibles_in_worktop[gable_lsu];
      } else {
        const q =
          document.querySelector<HTMLSelectElement>("#quantity18")!.value;
        if (!q.match(/^[0-9]+(\.[0-9]+)?$/)) {
          document.querySelector<HTMLInputElement>("#warn")!.innerText =
            "invalid quantity!";
          return false;
        }
        if (parseFloat(q) > fungibles_in_worktop[gable_lsu]) {
          quantity18 = fungibles_in_worktop[gable_lsu];
        } else {
          quantity18 = parseFloat(q);
        }
      }

      if (quantity18 == fungibles_in_worktop[gable_lsu]) {
        remove_fungible_from_worktop(gable_lsu, "*");
        document.querySelector<HTMLTextAreaElement>(
          "#transaction_manifest"
        )!.value +=
          "TAKE_ALL_FROM_WORKTOP\n" +
          '    Address("' +
          gable_lsu +
          '")\n' +
          '    Bucket("bucket' +
          bucket_number +
          '")\n;\n';
      } else {
        remove_fungible_from_worktop(gable_lsu, String(quantity18));
        document.querySelector<HTMLTextAreaElement>(
          "#transaction_manifest"
        )!.value +=
          "TAKE_FROM_WORKTOP\n" +
          '    Address("' +
          gable_lsu +
          '")\n' +
          '    Decimal("' +
          quantity18 +
          '")\n' +
          '    Bucket("bucket' +
          bucket_number +
          '")\n;\n';
      }
      document.querySelector<HTMLTextAreaElement>(
        "#transaction_manifest"
      )!.value +=
        "CALL_METHOD\n" +
        '    Address("' +
        gable_component +
        '")\n' +
        '    "deposit_lsu"\n' +
        '    Bucket("bucket' +
        bucket_number++ +
        '")\n;\n';
      add_non_fungible_to_worktop(gable_liquidity_nft + " " + unknown_nft_id);
    });

  document
    .querySelector<HTMLInputElement>("#send19")!
    .addEventListener("change", function () {
      const send19 =
        document.querySelector<HTMLSelectElement>("#send19")!.value;
      const receive19 = document.querySelector<HTMLSelectElement>("#receive19");
      if (!document.querySelector<HTMLInputElement>("#all19")!.checked) {
        document.querySelector<HTMLInputElement>("#quantity19")!.value = String(
          fungibles_in_worktop[send19]
        );
      }
      receive19!.innerHTML = "";
      for (var pool of Object.keys(radixplanet_pools)) {
        var found = false;
        for (var resource of radixplanet_pools[pool].resources) {
          if (resource == send19) {
            found = true;
            break;
          }
        }
        if (found) {
          for (var resource of radixplanet_pools[pool].resources) {
            if (resource != send19) {
              receive19!.options[receive19!.options.length] = new Option(
                find_fungible_symbol(resource) +
                  " - " +
                  radixplanet_pools[pool].name +
                  " pool",
                resource + " " + pool
              );
            }
          }
        }
      }
    });

  document
    .querySelector<HTMLInputElement>("#all19")!
    .addEventListener("change", function () {
      if (!document.querySelector<HTMLInputElement>("#all19")!.checked) {
        const send19 =
          document.querySelector<HTMLSelectElement>("#send19")!.value;
        document.querySelector<HTMLInputElement>("#quantity19")!.value = String(
          fungibles_in_worktop[send19]
        );
        document.querySelector<HTMLInputElement>("#quantity19")!.disabled =
          false;
      } else {
        document.querySelector<HTMLInputElement>("#quantity19")!.value = "";
        document.querySelector<HTMLInputElement>("#quantity19")!.disabled =
          true;
      }
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction19")!
    .addEventListener("click", async function () {
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      const send19 =
        document.querySelector<HTMLSelectElement>("#send19")!.value;
      const receive19 =
        document.querySelector<HTMLSelectElement>("#receive19")!.value;
      if (send19 == undefined || receive19 == undefined) {
        document.querySelector<HTMLInputElement>("#warn")!.innerText =
          "select coins to swap!";
      }

      var quantity19: number;
      if (document.querySelector<HTMLInputElement>("#all19")!.checked) {
        quantity19 = fungibles_in_worktop[send19];
      } else {
        const q =
          document.querySelector<HTMLSelectElement>("#quantity19")!.value;
        if (!q.match(/^[0-9]+(\.[0-9]+)?$/)) {
          document.querySelector<HTMLInputElement>("#warn")!.innerText =
            "invalid quantity!";
          return false;
        }
        if (parseFloat(q) > fungibles_in_worktop[send19]) {
          quantity19 = fungibles_in_worktop[send19];
        } else {
          quantity19 = parseFloat(q);
        }
      }

      const r = receive19.split(" ");
      var send_liquidity = 0;
      var receive_liquidity = 0;
      const fees = radixplanet_pools[r[1]].fees;

      gatewayApi.state
        .getEntityDetailsVaultAggregated([r[1]])
        .then((response) => {
          if (quantity19 == fungibles_in_worktop[send19]) {
            remove_fungible_from_worktop(send19, "*");
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "TAKE_ALL_FROM_WORKTOP\n" +
              '    Address("' +
              send19 +
              '")\n' +
              '    Bucket("bucket' +
              bucket_number +
              '")\n;\n';
          } else {
            remove_fungible_from_worktop(send19, String(quantity19));
            document.querySelector<HTMLTextAreaElement>(
              "#transaction_manifest"
            )!.value +=
              "TAKE_FROM_WORKTOP\n" +
              '    Address("' +
              send19 +
              '")\n' +
              '    Decimal("' +
              quantity19 +
              '")\n' +
              '    Bucket("bucket' +
              bucket_number +
              '")\n;\n';
          }

          for (var item of response[0].fungible_resources.items) {
            if (item.resource_address == r[0]) {
              for (var item2 of item.vaults.items) {
                receive_liquidity += parseFloat(item2.amount);
              }
            } else if (item.resource_address == send19) {
              for (var item2 of item.vaults.items) {
                send_liquidity += parseFloat(item2.amount);
              }
            }
          }
          var received_quantity =
            receive_liquidity *
            (1 - send_liquidity / (send_liquidity + quantity19 * (1 - fees)));
          add_fungible_to_worktop(r[0], received_quantity);
          add_fungible_to_worktop(radixplanet_pools[r[1]].lp, 0);
          document.querySelector<HTMLTextAreaElement>(
            "#transaction_manifest"
          )!.value +=
            "CALL_METHOD\n" +
            '    Address("' +
            r[1] +
            '")\n' +
            '    "swap"\n' +
            "    Tuple(\n" +
            "        Array<Tuple>(\n" +
            "            Tuple(\n" +
            "                Enum<0u8>(),\n" +
            '                Bucket("bucket' +
            bucket_number +
            '")\n' +
            "            )\n" +
            "        ),\n" +
            "        Tuple(\n" +
            '            Address("' +
            r[0] +
            '"),\n' +
            "            Enum<0u8>()\n" +
            "        )\n" +
            "    )\n;\n";
        });
    });

  document
    .querySelector<HTMLButtonElement>("#add_instruction20")!
    .addEventListener("click", function () {
      const nft = document.querySelector<HTMLSelectElement>("#nft20")!.value;
      if (nft) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "&nbsp;";
      } else {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "you don't have a Weft Claimer NFT";
        return false;
      }

      const a_i = nft.split(" ");

      document.querySelector<HTMLTextAreaElement>(
        "#transaction_manifest"
      )!.value +=
        "CALL_METHOD\n" +
        '    Address("' +
        a_i[0] +
        '")\n' +
        '    "create_proof_of_non_fungibles"\n' +
        '    Address("' +
        weft_claimer_nft +
        '")\n' +
        "    Array<NonFungibleLocalId>(\n" +
        '        NonFungibleLocalId("' +
        a_i[1] +
        '")\n' +
        "    )\n;\n" +
        "POP_FROM_AUTH_ZONE\n" +
        '    Proof("proof' +
        proof_number +
        '")\n;\n' +
        "CALL_METHOD\n" +
        '    Address("component_rdx1crys4t0nvfjzwvsa2pt3zgsmaaaqql8squkannhzcfh36j6u993dnz")\n' +
        '    "claim"\n' +
        "    1u8\n" +
        '    Decimal("' +
        weft_amount_to_collect[a_i[1]] +
        '")\n' +
        '    Proof("proof' +
        proof_number++ +
        '")\n;\n';
      add_fungible_to_worktop(weft, weft_amount_to_collect[a_i[1]]);
    });

  async function send_to_wallet() {
    const result = await rdt.walletApi.sendTransaction({
      transactionManifest: document.querySelector<HTMLTextAreaElement>(
        "#transaction_manifest"
      )!.value,
    });
    if (!result.isErr()) {
      document.querySelector<HTMLTextAreaElement>(
        "#transaction_manifest"
      )!.value = "";
    }
  }

  document
    .querySelector<HTMLButtonElement>("#send_to_wallet")!
    .addEventListener("click", function () {
      send_to_wallet();
    });
}
