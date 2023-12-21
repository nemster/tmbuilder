/*
 * This is the content script that previously was in main.ts
 * and running on page load,
 * will be refactored into smaller pieces in svelte components
 */

import {
  FungibleResourcesCollectionItemGloballyAggregated,
  GatewayApiClient,
  MetadataStringValue,
  NonFungibleResourcesCollectionItemVaultAggregated,
  ProgrammaticScryptoSborValueDecimal,
  ProgrammaticScryptoSborValueMap,
  ProgrammaticScryptoSborValueString,
  ProgrammaticScryptoSborValueTuple,
  ProgrammaticScryptoSborValueU64,
  ProgrammaticScryptoSborValueU8,
} from "@radixdlt/babylon-gateway-api-sdk";
import {
  DataRequestBuilder,
  RadixDappToolkit,
} from "@radixdlt/radix-dapp-toolkit";
import { alphadex_listed_coins } from "./alphadex.ts";
import { defiplaza_listed_coins } from "./defiplaza.ts";
import { PrecisionNumber } from "./lib/PrecisionNumber.ts";
import { accounts } from "./lib/stores/accounts.ts";
import { ociswap_listed_coins, ociswap_lp_names } from "./ociswap.ts";
import { radixplanet_listed_coins, radixplanet_lp } from "./radixplanet.ts";
import { claim_nft, pool_units, validators_names } from "./validators.ts";
import { amountToCollect as weftAmountToCollect } from "./lib/stores/weft.ts";
import { manifest } from "./lib/stores/transaction";

export const XRD =
  "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd";
export const weft =
  "resource_rdx1tk3fxrz75ghllrqhyq8e574rkf4lsq2x5a0vegxwlh3defv225cth3";
const fungibles_symbols: { [key: string]: string } = {
  resource_rdx1tk3fxrz75ghllrqhyq8e574rkf4lsq2x5a0vegxwlh3defv225cth3:
    "WEFT Weft Finance",
};

export const gable_loan_fees = new PrecisionNumber("0.001");
export const gable_component =
  "component_rdx1cpmh7lyg0hx6efv5q79lv6rqxdqpuh27y99nzm0jpwu2u44ne243ws";
export const gable_transient_nft =
  "resource_rdx1ngxzt7uq9l2wm5gd8vefcq5pkwcqwrn530a98p72mnkjzjev8hlxdn";
export const gable_lsu =
  "resource_rdx1thrz4g8g83802lumrtrdsrhjd6k5uxhxhgkrwjg0jn75cvxfc99nap";
export const gable_liquidity_nft =
  "resource_rdx1nfxg3t4eyls2qycqqrp6df8wkz3n2r04ex20443jtsgz5c23wsf74w";
const non_fungibles_symbols: { [key: string]: string } = {
  resource_rdx1ngxzt7uq9l2wm5gd8vefcq5pkwcqwrn530a98p72mnkjzjev8hlxdn:
    "STT Gable Transient Token",
  resource_rdx1nt3vrt8xtdal6gn7ddv0zfzvxpqylxyfmr97setz8r3amhhk90yqmg:
    "Weft Claimer Nft",
};
export const defiplaza_component =
  "component_rdx1cze7e7437y9pmntk94w72eyanngw522j8yf07aa27frn63m9ezkfeu";

export const EPSILON = 0.000001;
export const lsu_pool_receipt =
  "resource_rdx1nt3frmqu4v57dy55e90n0k3uy352zyy89vszzamvjld6vqvr98rls9";
export const lsu_pool =
  "component_rdx1cppy08xgra5tv5melsjtj79c0ngvrlmzl8hhs7vwtzknp9xxs63mfp";
export const lsulp =
  "resource_rdx1thksg5ng70g9mmy9ne7wz0sc7auzrrwy7fmgcxzel2gvp8pj0xxfmf";
export const UNKNOWN_NFT_ID = "???";
export const claim_amount: { [key: string]: PrecisionNumber } = {};
const claim_epoch: { [key: string]: number } = {};
const backeum_trophies =
  "resource_rdx1ng8ugxt6tj0e22fvf6js4e3x5k8uwaqvz9tl8u924u54h7zxeh6jnp";
const my_backeum_collection_id =
  "component_rdx1cqzr66e6vc5mp7hsqjjnyzmhdzmamafnn7dfyc2yn7mz7r3g7k3mwp";
export let donor = false;
export const my_validator_address =
  "validator_rdx1sva6pmkgm5yacumw4p6k0xsfnqg598xkj9p4e2a58dl6gcrqpx7z86";
const my_lsu_address =
  "resource_rdx1t4pl597e7lp6flduhd3a6tp9jsqw2vzgyj9jxtk8y3dawum5aahap0";
export let staked_amount = new PrecisionNumber("0");
export const weft_claimer_nft =
  "resource_rdx1nt3vrt8xtdal6gn7ddv0zfzvxpqylxyfmr97setz8r3amhhk90yqmg";
export const caviarnine_enabled_validators: { [key: string]: number } = {
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

export function find_fungible_symbol(resource: string) {
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
  if (resource === lsulp) {
    return "LSULP";
  }
  return resource;
}

export function find_non_fungible_symbol(resource: string) {
  if (non_fungibles_symbols[resource] !== undefined) {
    return non_fungibles_symbols[resource];
  }
  if (claim_nft[resource] !== undefined) {
    return "Claim NFT " + validators_names[claim_nft[resource]].trim();
  }
  if (resource === lsu_pool_receipt) {
    return "LSU Pool Receipt";
  }
  if (resource === gable_liquidity_nft) {
    return "Gable Liquidity NFT";
  }
  return resource;
}

export let gatewayApi: GatewayApiClient;

export function initContent() {
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

  gatewayApi = GatewayApiClient.initialize({
    basePath: "https://mainnet.radixdlt.com",
    applicationName: "tmbuilder",
  });

  async function get_fungibles(account: string) {
    const response = await gatewayApi.state.innerClient.entityFungiblesPageRaw({
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
    const response =
      await gatewayApi.state.innerClient.entityNonFungiblesPageRaw({
        stateEntityNonFungiblesPageRequest: {
          address: account,
          aggregation_level: "Vault",
          opt_ins: {
            non_fungible_include_nfids: true,
            explicit_metadata: ["name"],
          },
        },
      });
    return response.value();
  }

  async function get_non_fungible_data(resource: string, id: string) {
    const response = await gatewayApi.state.innerClient.nonFungibleData({
      stateNonFungibleDataRequest: {
        resource_address: resource,
        non_fungible_ids: [id],
      },
    });
    return response;
  }

  rdt.walletApi.walletData$.subscribe((walletData) => {
    for (const account of walletData.accounts) {
      accounts.updateAccount(account.address, account.label);
      get_fungibles(account.address).then((value) => {
        for (const fungible of value.items) {
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
          let amount = new PrecisionNumber(
            (<FungibleResourcesCollectionItemGloballyAggregated>fungible).amount
          );
          if (fungible.resource_address == XRD) {
            amount = amount.minus(new PrecisionNumber("10"));
          }
          if (amount.isGreaterThanZero()) {
            accounts.addFungible(
              value.address,
              fungible.resource_address,
              amount
            );
          }
          if (
            fungible.resource_address == my_lsu_address &&
            amount.isGreaterThan(new PrecisionNumber("50"))
          ) {
            document.querySelector<HTMLParagraphElement>("#footer")!.innerText =
              "Thank you for staking with me!";
            staked_amount = staked_amount.plus(amount);
          }
        }
      });
      get_non_fungibles(account.address).then((value) => {
        for (const non_fungible of value.items) {
          if (
            non_fungibles_symbols[non_fungible.resource_address] == undefined
          ) {
            non_fungibles_symbols[non_fungible.resource_address] = (<
              MetadataStringValue
            >non_fungible.explicit_metadata!.items[0].value.typed).value;
          }
          for (const item of (<
            NonFungibleResourcesCollectionItemVaultAggregated
          >non_fungible).vaults.items) {
            for (const id of item!.items!) {
              accounts.addNonFungible(
                value.address,
                non_fungible.resource_address,
                id
              );
              if (non_fungible.resource_address == weft_claimer_nft) {
                get_non_fungible_data(weft_claimer_nft, id).then((v) => {
                  for (const nf of v.non_fungible_ids) {
                    for (const field of (<ProgrammaticScryptoSborValueTuple>(
                      nf.data!.programmatic_json
                    )).fields) {
                      for (const entry of (<ProgrammaticScryptoSborValueMap>(
                        field
                      )).entries) {
                        for (const field2 of (<
                          ProgrammaticScryptoSborValueTuple
                        >entry.value).fields) {
                          if (field2.field_name == "amount") {
                            weftAmountToCollect.add(
                              nf.non_fungible_id + (<ProgrammaticScryptoSborValueU8>entry.key).value,
                              new PrecisionNumber(
                                (<ProgrammaticScryptoSborValueDecimal>(
                                  field2
                                )).value
                              )
                            );
                          } else if (field2.field_name == "collected_amount") {
                            weftAmountToCollect.remove(
                              nf.non_fungible_id + (<ProgrammaticScryptoSborValueU8>entry.key).value,
                              new PrecisionNumber(
                                (<ProgrammaticScryptoSborValueDecimal>(
                                  field2
                                )).value
                              )
                            );
                          }
                        }
                      }
                    }
                  }
                });
              } else if (non_fungible.resource_address == backeum_trophies) {
                get_non_fungible_data(backeum_trophies, id).then((v) => {
                  for (const nf of v.non_fungible_ids) {
                    for (const field of (<ProgrammaticScryptoSborValueTuple>(
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
              } else if (
                claim_nft[non_fungible.resource_address] != undefined
              ) {
                get_non_fungible_data(non_fungible.resource_address, id).then(
                  (v) => {
                    for (const nf of v.non_fungible_ids) {
                      for (const field of (<ProgrammaticScryptoSborValueTuple>(
                        nf.data!.programmatic_json
                      )).fields) {
                        if (field.field_name == "claim_amount") {
                          claim_amount[nf.non_fungible_id] =
                            new PrecisionNumber(
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
      });
    }
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
      manifest.set("");
    }
  }

  document
    .querySelector<HTMLButtonElement>("#send_to_wallet")!
    .addEventListener("click", function () {
      send_to_wallet();
    });
}
