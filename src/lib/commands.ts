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

export default {
  withdraw,
  withdrawNonFungibles,
};
