function withdraw(account: string, resource: string, q: number) {
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
  return `
  TAKE_FROM_WORKTOP
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
  quantity: number,
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
  amount: number,
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
};
