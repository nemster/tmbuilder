#!/bin/bash

ALPHADEX=`mktemp`

curl -s -X POST https://api.alphadex.net/v0/alphadex/pairs >$ALPHADEX

echo 'export const alphadex_listed_coins: {[key: string]: string}= {' >src/alphadex.ts
(
  jq -r '.pairs[].token1 | ("  \"" + .address + "\": \"" + .symbol + " " + .name + "\",")' <$ALPHADEX
  jq -r '.pairs[].token2 | ("  \"" + .address + "\": \"" + .symbol + " " + .name + "\",")' <$ALPHADEX
) |
  sort |
  uniq >>src/alphadex.ts
echo '};' >>src/alphadex.ts

rm $ALPHADEX
