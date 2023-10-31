#!/bin/bash

VALIDATORS=`mktemp`

curl -s -X 'POST' \
  'https://mainnet.radixdlt.com/state/validators/list' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "at_ledger_state": null
}' |
  jq '.validators.items[] | .address + " " + .stake_vault.balance + " " + (.state.is_registered|tostring) + " " + (.state.accepts_delegated_stake|tostring) + " " + (.metadata.items[] | .key + " " + .value.typed.value)' |
  grep ' true true ' |
  grep -v ' 0 ' |
  tr -d '"' |
  sort -g -k2 -r >$VALIDATORS

echo 'export const validators_names: {[key: string]: string}= {' >/home/rigel/tmbuilder/src/validators.ts
grep ' name ' <$VALIDATORS |
  awk '{print "  \"" $1 "\": \"" $6 " " $7 " " $8 " " $9 " " $10 " " $11 " " $12 "\","}' |
  sed 's/" /"/' >>/home/rigel/tmbuilder/src/validators.ts
echo '}' >>/home/rigel/tmbuilder/src/validators.ts

echo 'export const pool_units: {[key: string]: string}= {' >>/home/rigel/tmbuilder/src/validators.ts
grep ' pool_unit ' <$VALIDATORS |
  awk '{print "  \"" $6 "\": \"" $1 "\","}' >>/home/rigel/tmbuilder/src/validators.ts
echo '}' >>/home/rigel/tmbuilder/src/validators.ts

echo 'export const claim_nft: {[key: string]: string}= {' >>/home/rigel/tmbuilder/src/validators.ts
grep ' claim_nft ' <$VALIDATORS |
  awk '{print "  \"" $6 "\": \"" $1 "\","}' >>/home/rigel/tmbuilder/src/validators.ts
echo '}' >>/home/rigel/tmbuilder/src/validators.ts

echo 'export const validators_you_can_stake_to: {[key: string]: number}= {' >>/home/rigel/tmbuilder/src/validators.ts
grep ' true true name ' <$VALIDATORS |
  awk '{print "  \"" $1 "\": 1,"}' |
  sed 's/" /"/' >>/home/rigel/tmbuilder/src/validators.ts
echo '}' >>/home/rigel/tmbuilder/src/validators.ts

rm $VALIDATORS
