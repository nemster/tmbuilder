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

function sendEntireResourceToAccount(
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

export default {
  withdraw,
  withdrawNonFungibles,
  depositEntireWortop,
  sendEntireResourceToAccount,
  sendQuantityToAccount,
};
