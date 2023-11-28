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
import {
  radixplanet_listed_coins,
  radixplanet_lp,
  radixplanet_pools,
} from "./radixplanet.ts";
import { claim_nft, pool_units, validators_names } from "./validators.ts";

interface fungibles_array {
  [index: string]: number;
}
interface fungibles_array_array {
  [index: string]: fungibles_array;
}
interface non_fungibles_array_array {
  [index: string]: string[];
}

export const XRD =
  "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd";
const weft =
  "resource_rdx1tk3fxrz75ghllrqhyq8e574rkf4lsq2x5a0vegxwlh3defv225cth3";
const fungibles_symbols: { [key: string]: string } = {
  resource_rdx1tk3fxrz75ghllrqhyq8e574rkf4lsq2x5a0vegxwlh3defv225cth3:
    "WEFT Weft Finance",
};
let gable_loan_quantity = new PrecisionNumber("0");
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
const defiplaza_component =
  "component_rdx1cze7e7437y9pmntk94w72eyanngw522j8yf07aa27frn63m9ezkfeu";
let bucket_number = 1;
let proof_number = 1;
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
let donor = false;
export const my_validator_address =
  "validator_rdx1sva6pmkgm5yacumw4p6k0xsfnqg598xkj9p4e2a58dl6gcrqpx7z86";
const my_lsu_address =
  "resource_rdx1t4pl597e7lp6flduhd3a6tp9jsqw2vzgyj9jxtk8y3dawum5aahap0";
let staked_amount = new PrecisionNumber("0");
const weft_claimer_nft =
  "resource_rdx1nt3vrt8xtdal6gn7ddv0zfzvxpqylxyfmr97setz8r3amhhk90yqmg";
const weft_amount_to_collect: { [key: string]: PrecisionNumber } = {};
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

export const fungibles_in_worktop: { [key: string]: PrecisionNumber } = {};
export const non_fungibles_in_worktop = [] as string[];
export const fungibles_in_accounts: fungibles_array_array = {};
export const non_fungibles_in_accounts: non_fungibles_array_array = {};

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

export function add_fungible_to_worktop(
  resource: string,
  quantity: PrecisionNumber
) {
  console.error(
    `add_fungible_to_worktop call, resource=${resource}, quantity=${quantity}`
  );
  //   if (fungibles_in_worktop[resource] == undefined) {
  //     fungibles_in_worktop[resource] = quantity;
  //     const symbol = find_fungible_symbol(resource);
  //     const resource2 = document.querySelector<HTMLSelectElement>("#fungible2");
  //     const resource3 = document.querySelector<HTMLSelectElement>("#fungible3");
  //     const resource10 = document.querySelector<HTMLSelectElement>("#fungible10");
  //     if (resource2) {
  //       resource2!.options[resource2!.options.length] = new Option(
  //         symbol,
  //         resource
  //       );
  //     }
  //     if (resource3) {
  //       resource3!.options[resource3!.options.length] = new Option(
  //         symbol,
  //         resource
  //       );
  //     }
  //     if (resource10) {
  //       resource10!.options[resource10!.options.length] = new Option(
  //         symbol,
  //         resource
  //       );
  //     }
  //     if (pool_units[resource] != undefined) {
  //       const lsu5 = document.querySelector<HTMLSelectElement>("#lsu5");
  //       lsu5!.options[lsu5!.options.length] = new Option(symbol, resource);
  //       if (caviarnine_enabled_validators[pool_units[resource]] != undefined) {
  //         const lsu7 = document.querySelector<HTMLSelectElement>("#lsu7");
  //         const send9 = document.querySelector<HTMLSelectElement>("#send9");
  //         lsu7!.options[lsu7!.options.length] = new Option(symbol, resource);
  //         send9!.options[send9!.options.length] = new Option(symbol, resource);
  //       }
  //     } else {
  //       if (defiplaza_listed_coins[resource] != undefined) {
  //         const send16 = document.querySelector<HTMLSelectElement>("#send16");
  //         send16!.options[send16!.options.length] = new Option(symbol, resource);
  //         send16!.dispatchEvent(new Event("change"));
  //       }
  //       if (alphadex_listed_coins[resource] != undefined) {
  //         const send17 = document.querySelector<HTMLSelectElement>("#send17");
  //         send17!.options[send17!.options.length] = new Option(symbol, resource);
  //         send17!.dispatchEvent(new Event("change"));
  //       }
  //       if (radixplanet_listed_coins[resource] != undefined) {
  //         const send19 = document.querySelector<HTMLSelectElement>("#send19");
  //         send19!.options[send19!.options.length] = new Option(symbol, resource);
  //         send19!.dispatchEvent(new Event("change"));
  //       }
  //     }
  //   } else {
  //     fungibles_in_worktop[resource] += quantity;
  //   }
  // }
  // export function add_non_fungible_to_worktop(resource: string) {
  //   if (non_fungibles_in_worktop.indexOf(resource) == -1) {
  //     non_fungibles_in_worktop.push(resource);
  //     const res = resource.split(" ");
  //     const symbol = find_non_fungible_symbol(res[0]);
  //     const resource2 =
  //       document.querySelector<HTMLSelectElement>("#non_fungible2");
  //     const resource3 =
  //       document.querySelector<HTMLSelectElement>("#non_fungible3");
  //     resource2!.options[resource2!.options.length] = new Option(
  //       symbol + " " + res[1],
  //       resource
  //     );
  //     resource3!.options[resource3!.options.length] = new Option(
  //       symbol + " " + res[1],
  //       resource
  //     );
  //   }
  // }
  // export function add_fungible_to_account(
  //   account: string,
  //   fungible: string,
  //   quantity: number
  // ) {
  //   if (fungibles_in_accounts[account][fungible] == undefined) {
  //     fungibles_in_accounts[account][fungible] = quantity;
  //   } else {
  //     fungibles_in_accounts[account][fungible] += quantity;
  //   }
  // }
  // export function add_non_fungible_to_account(
  //   account: string,
  //   non_fungible: string
  // ) {
  //   non_fungibles_in_accounts[account].push(non_fungible);
  // }
  // export function remove_fungible_from_worktop(
  //   resource: string,
  //   quantity: string
  // ) {
  //   const resource2 = document.querySelector<HTMLSelectElement>("#fungible2");
  //   const resource3 = document.querySelector<HTMLSelectElement>("#fungible3");
  //   const lsu5 = document.querySelector<HTMLSelectElement>("#lsu5");
  //   const lsu7 = document.querySelector<HTMLSelectElement>("#lsu7");
  //   const send9 = document.querySelector<HTMLSelectElement>("#send9");
  //   const fungible10 = document.querySelector<HTMLSelectElement>("#fungible10");
  //   const send11 = document.querySelector<HTMLSelectElement>("#send11");
  //   const send16 = document.querySelector<HTMLSelectElement>("#send16");
  //   const send19 = document.querySelector<HTMLSelectElement>("#send19");
  //   if (fungibles_in_worktop[resource] != undefined) {
  //     if (quantity == "*") {
  //       delete fungibles_in_worktop[resource];
  //       for (var i = resource2!.length - 1; i >= 0; --i) {
  //         if ((<HTMLOptionElement>resource2![i]).value == resource) {
  //           resource2!.remove(i);
  //           resource3!.remove(i);
  //           fungible10!.remove(i - 1);
  //           break;
  //         }
  //       }
  //       for (var i = lsu5!.length - 1; i >= 0; --i) {
  //         if ((<HTMLOptionElement>lsu5![i]).value == resource) {
  //           lsu5!.remove(i);
  //           lsu7!.remove(i);
  //           send9!.remove(i);
  //           break;
  //         }
  //       }
  //       if (defiplaza_listed_coins[resource] != undefined) {
  //         for (var i = send16!.length - 1; i >= 0; --i) {
  //           if ((<HTMLOptionElement>send16![i]).value == resource) {
  //             send16!.remove(i);
  //             break;
  //           }
  //         }
  //       }
  //       if (radixplanet_listed_coins[resource] != undefined) {
  //         for (var i = send19!.length - 1; i >= 0; --i) {
  //           if ((<HTMLOptionElement>send19![i]).value == resource) {
  //             send19!.remove(i);
  //             break;
  //           }
  //         }
  //       }
  //     } else {
  //       fungibles_in_worktop[resource] -= parseFloat(quantity);
  //       if (fungibles_in_worktop[resource] < EPSILON) {
  //         fungibles_in_worktop[resource] = 0;
  //       }
  //     }
  //   } else if (resource == "*") {
  //     fungibles_in_worktop = {};
  //     resource2!.innerHTML = "<option></option>";
  //     resource3!.innerHTML = "<option></option>";
  //     lsu5!.innerHTML = "";
  //     lsu7!.innerHTML = "";
  //     send9!.innerHTML = "";
  //     send16!.innerHTML = "";
  //     send19!.innerHTML = "";
  //   }
}

export function remove_fungible_from_worktop(
  resource: string,
  quantity: string
) {
  console.error(
    `remove_fungible_from_worktop call, resource=${resource}, quantity=${quantity}`
  );
}

export function add_non_fungible_to_worktop(resource: string) {
  console.error(`add_non_fungible_to_worktop call, resource=${resource}`);
}

export function remove_non_fungible_from_worktop(non_fungible: string) {
  console.error(
    "remove_non_fungible_from_worktop call, non_fungible=",
    non_fungible
  );
  // const resource2 = document.querySelector<HTMLSelectElement>("#non_fungible2");
  // const resource3 = document.querySelector<HTMLSelectElement>("#non_fungible3");
  // const resource6 = document.querySelector<HTMLSelectElement>("#nft6");
  // if (non_fungible == "*") {
  //   non_fungibles_in_worktop = [];
  //   resource2!.innerHTML = "<option></option>";
  //   resource3!.innerHTML = "<option></option>";
  //   resource6!.innerHTML = "";
  // } else {
  //   const parts = non_fungible.split(" ");
  //   if (parts[1] == UNKNOWN_NFT_ID) {
  //     for (var i = non_fungibles_in_worktop.length - 1; i >= 0; i--) {
  //       if (non_fungibles_in_worktop[i].includes(parts[0])) {
  //         non_fungibles_in_worktop.splice(i, 1);
  //         resource2!.remove(i + 1);
  //         resource3!.remove(i + 1);
  //       }
  //     }
  //     for (var i = resource6!.length - 1; i >= 0; i--) {
  //       if ((<HTMLOptionElement>resource6![i]).value.includes(parts[0])) {
  //         resource6!.remove(i);
  //         break;
  //       }
  //     }
  //   } else {
  //     const index = non_fungibles_in_worktop.indexOf(non_fungible);
  //     if (index > -1) {
  //       non_fungibles_in_worktop.splice(index, 1);
  //       resource2!.remove(index + 1);
  //       resource3!.remove(index + 1);
  //       for (var i = resource6!.length - 1; i >= 0; i--) {
  //         if ((<HTMLOptionElement>resource6![i]).value == non_fungible) {
  //           resource6!.remove(i);
  //           break;
  //         }
  //       }
  //     }
  //   }
  // }
}

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

  const gatewayApi = GatewayApiClient.initialize({
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
                const nft20 =
                  document.querySelector<HTMLSelectElement>("#nft20");
                nft20!.options[nft20!.options.length] = new Option(
                  id,
                  value.address + " " + id
                );
                get_non_fungible_data(weft_claimer_nft, id).then((v) => {
                  for (const nf of v.non_fungible_ids) {
                    weft_amount_to_collect[nf.non_fungible_id] =
                      PrecisionNumber.ZERO();
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
                            weft_amount_to_collect[nf.non_fungible_id] =
                              weft_amount_to_collect[nf.non_fungible_id].plus(
                                new PrecisionNumber(
                                  (<ProgrammaticScryptoSborValueDecimal>(
                                    field2
                                  )).value
                                )
                              );
                          } else if (field2.field_name == "collected_amount") {
                            weft_amount_to_collect[nf.non_fungible_id] =
                              weft_amount_to_collect[nf.non_fungible_id].minus(
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

  const lsuSelect8 = document.querySelector<HTMLSelectElement>("#lsu8");
  const receiveSelect9 = document.querySelector<HTMLSelectElement>("#receive9");
  for (const lsu of Object.keys(pool_units)) {
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

  document
    .querySelector<HTMLSelectElement>("#action")!
    .addEventListener("change", function () {
      document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
        "&nbsp;";

      // --- GABLE ---
      if (this.selectedIndex == 19 && gable_loan_quantity.isZero()) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "get a loan first";
      } else if (
        this.selectedIndex == 20 &&
        (fungibles_in_worktop[gable_lsu] == undefined ||
          fungibles_in_worktop[gable_lsu].isZero())
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some Gable LSUs in the worktop first";
      }

      // --- DEFIPLAZA ---
      if (
        this.selectedIndex == 22 &&
        document.querySelector<HTMLSelectElement>("#send16")!.options.length ==
          0
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some coin listed on DefiPlaza in the worktop first";
      }

      // --- ALPHADEX ---
      if (
        this.selectedIndex == 24 &&
        document.querySelector<HTMLSelectElement>("#send17")!.options.length ==
          0
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some coin listed on AlphaDEX in the worktop first";
      }

      // --- RADIXPLANET ---
      if (
        this.selectedIndex == 26 &&
        document.querySelector<HTMLSelectElement>("#send19")!.options.length ==
          0
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "put some coin listed on RadixPlanet in the worktop first";
      }

      // --- WEFT ---
      if (
        this.selectedIndex == 28 &&
        document.querySelector<HTMLSelectElement>("#nft20")!.options.length == 0
      ) {
        document.querySelector<HTMLParagraphElement>("#warn")!.innerHTML =
          "you don't have a Weft Claimer NFT";
      }
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
      for (const receive of Object.keys(defiplaza_listed_coins)) {
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

      let quantity16: PrecisionNumber;
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
        if (new PrecisionNumber(q) > fungibles_in_worktop[send16]) {
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
          quantity16 = new PrecisionNumber(q);
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
      for (const receive of Object.keys(alphadex_listed_coins)) {
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

      let quantity17: PrecisionNumber;
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
        if (
          new PrecisionNumber(q).isGreaterThan(fungibles_in_worktop[send17])
        ) {
          quantity17 = fungibles_in_worktop[send17];
        } else {
          quantity17 = new PrecisionNumber(q);
        }
      }

      const receive17 =
        document.querySelector<HTMLSelectElement>("#receive17")!.value;
      let fee_badge = "5";
      if (
        donor ||
        staked_amount.isGreaterThanOrEqualTo(new PrecisionNumber("5000"))
      ) {
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
            quantity17 = new PrecisionNumber(j1.quotes[0].fromAmount);
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
          let next = "";
          for (const swaps of j1.quotes) {
            let to_coin: string;
            if (send17 == XRD || next != "") {
              to_coin = receive17;
            } else {
              to_coin = XRD;
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
      for (const pool of Object.keys(radixplanet_pools)) {
        let found = false;
        for (const resource of radixplanet_pools[pool].resources) {
          if (resource == send19) {
            found = true;
            break;
          }
        }
        if (found) {
          for (const resource of radixplanet_pools[pool].resources) {
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

      let quantity19: PrecisionNumber;
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
        if (new PrecisionNumber(q) > fungibles_in_worktop[send19]) {
          quantity19 = fungibles_in_worktop[send19];
        } else {
          quantity19 = new PrecisionNumber(q);
        }
      }

      const r = receive19.split(" ");
      let send_liquidity = new PrecisionNumber(0);
      let receive_liquidity = new PrecisionNumber(0);
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

          for (const item of response[0].fungible_resources.items) {
            if (item.resource_address == r[0]) {
              for (const item2 of item.vaults.items) {
                receive_liquidity = receive_liquidity.plus(
                  new PrecisionNumber(item2.amount)
                );
              }
            } else if (item.resource_address == send19) {
              for (const item2 of item.vaults.items) {
                send_liquidity = send_liquidity.plus(
                  new PrecisionNumber(item2.amount)
                );
              }
            }
          }

          // const received_quantity =
          //   receive_liquidity *
          //   (1 - send_liquidity / (send_liquidity + quantity19 * (1 - fees)));

          const received_quantity = receive_liquidity.multipliedBy(
            new PrecisionNumber(1).minus(
              send_liquidity.dividedBy(
                send_liquidity.plus(
                  quantity19.multipliedBy(
                    new PrecisionNumber(1).minus(new PrecisionNumber(fees))
                  )
                )
              )
            )
          );
          add_fungible_to_worktop(r[0], received_quantity);
          add_fungible_to_worktop(
            radixplanet_pools[r[1]].lp,
            PrecisionNumber.ZERO()
          );
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
