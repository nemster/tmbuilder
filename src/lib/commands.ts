import PrecisionNumber from "./PrecisionNumber";

function withdraw(account: string, resource: string, q: PrecisionNumber) {
  return `CALL_METHOD
    Address("${account}")
    "withdraw"
    Address("${resource}")
    Decimal("${q}")
;
`;
}
function withdrawNonFungibles(account: string, resource: string, id: string) {
  return `CALL_METHOD
    Address("${account}")
    "withdraw_non_fungibles"
    Address("${resource}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("${id}")
    )
;
`;
}
function depositEntireWortop(account: string) {
  return `CALL_METHOD
    Address("${account}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;
`;
}
function sendAllResourceToAccount(
  account: string,
  resource: string,
  bucketNumber: number
) {
  return `TAKE_ALL_FROM_WORKTOP
    Address("${resource}")
    Bucket("bucket${bucketNumber}")
;
CALL_METHOD
    Address("${account}")
    "deposit"
    Bucket("bucket${bucketNumber}")
;
`;
}
function sendQuantityToAccount(
  account: string,
  resource: string,
  quantity: string,
  bucketNumber: number
) {
  return `TAKE_FROM_WORKTOP
    Address("${resource}")
    Decimal("${quantity}")
    Bucket("bucket${bucketNumber}")
;
CALL_METHOD
    Address("${account}")
    "deposit"
    Bucket("bucket${bucketNumber}")
;
`;
}
function putAllResourceToBucket(resource: string, bucketNumber: number) {
  return `TAKE_ALL_FROM_WORKTOP
    Address("${resource}")
    Bucket("bucket${bucketNumber}")
;
`;
}

function putResourceToBucket(
  resourceAddress: string,
  quantity: PrecisionNumber,
  bucketNumber: number
) {
  return `TAKE_FROM_WORKTOP
    Address("${resourceAddress}")
    Decimal("${quantity}")
    Bucket("bucket${bucketNumber}")
;
`;
}

function putNonFungibleToBucket(
  resource: string,
  id: string,
  bucketNumber: number
) {
  return `TAKE_NON_FUNGIBLES_FROM_WORKTOP
    Address("${resource}")
    Array<NonFungibleLocalId>(
      NonFungibleLocalId("${id}")
    )
    Bucket("bucket${bucketNumber}")
;
`;
}
function sendBucketToAccount(account: string, bucketNumber: number) {
  return `CALL_METHOD
    Address("${account}")
    "deposit"
    Bucket("bucket${bucketNumber}")
;
`;
}
function tryDepositEntireWortop(account: string, fail: string) {
  return `CALL_METHOD
    Address("${account}")
    "try_deposit_batch_or_${fail}"
    Expression("ENTIRE_WORKTOP")
    Enum<0u8>()
;
`;
}

function trySendAllFungibleToAccount(
  accountAddress: string,
  fungibleAddress: string,
  bucketNumber: number,
  fail: "refund" | "abort"
) {
  return `TAKE_ALL_FROM_WORKTOP
    Address("${fungibleAddress}")
    Bucket("bucket${bucketNumber}")
;
CALL_METHOD
    Address("${accountAddress}")
    "try_deposit_or_${fail}"
    Bucket("bucket${bucketNumber}")
    Enum<0u8>()
;
`;
}

function trySendAmountFungibleToAccount(
  accountAddress: string,
  fungibleAddress: string,
  amount: PrecisionNumber,
  bucketNumber: number,
  fail: "refund" | "abort"
) {
  return `TAKE_FROM_WORKTOP
    Address("${fungibleAddress}")
    Decimal("${amount}")
    Bucket("bucket${bucketNumber}")
;
CALL_METHOD
    Address("${accountAddress}")
    "try_deposit_or_${fail}"
    Bucket("bucket${bucketNumber}")
    Enum<0u8>()
;
`;
}

function tryDepositBucketToAccount(
  account: string,
  fail: string,
  bucketNumber: number
) {
  return `CALL_METHOD
    Address("${account}")
    "try_deposit_or_${fail}"
    Bucket("bucket${bucketNumber}")
;
`;
}

function stakeBucket(validatorAdress: string, bucketNumber: number) {
  return `CALL_METHOD
    Address("${validatorAdress}")
    "stake"
    Bucket("bucket${bucketNumber}")
;
`;
}

function unstakeBucket(validatorAdress: string, bucketNumber: number) {
  return `CALL_METHOD
    Address("${validatorAdress}")
    "unstake"
    Bucket("bucket${bucketNumber}")
;
`;
}

function claimXrd(validator: string, bucketNumber: number) {
  return `CALL_METHOD
    Address("${validator}")
    "claim_xrd"
    Bucket("bucket${bucketNumber}")
  ;
  `;
}

function swap(poolAddress: string, bucketNumber: number) {
  return `CALL_METHOD
    Address("${poolAddress}")
    "swap"
    Bucket("bucket${bucketNumber}")
;
`;
}

function addLiquidity(component: string, bucketA: number, bucketB: number) {
  return `CALL_METHOD
    Address("${component}")
    "add_liquidity"
    Bucket("bucket${bucketA}")
    Bucket("bucket${bucketB}")
;
`;
}

function removeLiquidity(component: string, bucketNumber: number) {
  return `CALL_METHOD
    Address("${component}")
    "remove_liquidity"
    Bucket("bucket${bucketNumber}")
;
`;
}

function createProofOfNonFungibles(
  nftAddress: string,
  receiptAddress: string,
  nftId: string
) {
  return `CALL_METHOD
    Address("${nftAddress}")
    "create_proof_of_non_fungibles"
    Address("${receiptAddress}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("${nftId}")
    )
;
`;
}

function createProofFromAuthZoneOfNonFungibles(
  receptAddress: string,
  nftId: string,
  proffNumber: number
) {
  return `CREATE_PROOF_FROM_AUTH_ZONE_OF_NON_FUNGIBLES
    Address("${receptAddress}")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("${nftId}")
    )
    Proof("proof${proffNumber}")
;
`;
}

export default {
  withdraw,
  withdrawNonFungibles,
  depositEntireWortop,
  sendAllResourceToAccount,
  sendQuantityToAccount,
  putAllResourceToBucket,
  putNonFungibleToBucket,
  sendBucketToAccount,
  tryDepositEntireWortop,
  trySendAllFungibleToAccount,
  trySendAmountFungibleToAccount,
  tryDepositBucketToAccount,
  stakeBucket,
  putResourceToBucket,
  unstakeBucket,
  claimXrd,
  swap,
  addLiquidity,
  removeLiquidity,
  createProofOfNonFungibles,
  createProofFromAuthZoneOfNonFungibles,
};
