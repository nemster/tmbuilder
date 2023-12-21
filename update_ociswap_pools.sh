#!/bin/bash

echo 'export const ociswap_listed_coins: {[key: string]: string}= {' >src/ociswap.ts
CURSOR=0
while true
do
  OUT=`curl -s --request GET --header 'accept: application/json'\
       --url "https://api.ociswap.com/tokens?cursor=$CURSOR&limit=100&order=rank&direction=asc&min_liquidity_usd=1000"`
  echo $OUT |
    jq -r '.data[] | ("  \"" + .address + "\": \"" + .symbol + " " + .name + "\",")' >>src/ociswap.ts
  CURSOR=`echo $OUT |
	  jq .next_cursor`
  if [ "$CURSOR" == "0" ]
  then
    break
  fi
  sleep 1
done
echo '};' >>src/ociswap.ts

LPS=`mktemp`

CURSOR=0
while true
do
  OUT=`curl -s --request GET --header 'accept: application/json'\
       --url "https://api.ociswap.com/pools?cursor=$CURSOR&limit=100&order=rank&direction=asc"`
  echo $OUT |
    jq -r '.data[] | (.address + " " + .name)' |
    while read COMPONENT NAME
    do
      echo -n $NAME
      curl -s --request POST 'https://mainnet.radixdlt.com/state/entity/details' \
        --header 'accept: application/json' --header 'Content-Type: application/json' \
        --data '{"addresses": ["'$COMPONENT'"]}' |
	jq -r '" " + (.items[] | (.metadata.items[] | select(.key == "lp_address") | .value.typed.value) + " " + .address)'
      sleep 1
    done >>$LPS
  CURSOR=`echo $OUT |
	  jq .next_cursor`
  if [ "$CURSOR" == "0" ]
  then
    break
  fi
done

echo 'export const ociswap_lp_names: {[key: string]: string}= {' >>src/ociswap.ts
uniq <$LPS | awk '{print "  \"" $2 "\": \"Ociswap LP " $1 "\","}' >>src/ociswap.ts
echo '};' >>src/ociswap.ts

echo 'export const ociswap_lp_pools: {[key: string]: string}= {' >>src/ociswap.ts
uniq <$LPS | awk '{print "  \"" $2 "\": \"" $3 "\","}' >>src/ociswap.ts
echo '};' >>src/ociswap.ts

rm $LPS
