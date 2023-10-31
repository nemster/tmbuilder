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
