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

export default {
  withdraw,
  withdrawNonFungibles,
  depositEntireWortop,
  sendAllResourceToAccount,
  sendQuantityToAccount,
  putAllResourceToBucket,
  putNonFungibleToBucket,
  sendBucketToAccount,
};
