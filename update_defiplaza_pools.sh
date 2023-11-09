#!/bin/bash

DEFIPLAZA=`mktemp`

curl -s https://radix.defiplaza.net/api/pairs |
  jq -r '.data[] | (.address + " " + .baseToken + " " + .basePool + " " + .quotePool)' >$DEFIPLAZA 2>/dev/null
if [ $? -ne 0 ]
then
  echo '{"data":[{"address":"component_rdx1cq2jyc7mmjnhp64daynj6he3y0ranzn27vrsleej0hpew5hgtktgj6","baseToken":"resource_rdx1tkmwanknxau3f62kvufsk7sn80gaqhtllz8dasuq2en7nzdfka4t2t","basePool":"pool_rdx1c5hcjdzvv4mas55cscxtw77xstlyyq2rzh8f49q36j0jnweqeu64yq","quotePool":"pool_rdx1c4xcu2zud2vgagsm336r686s8d34tkkcv7tlgcr0qggvkkzyj9yx09"},{"address":"component_rdx1cpy4nydd2eqnya8cdvrayjjpka5zcdh7qe7znv8x0fzf30q52m77n9","baseToken":"resource_rdx1tkm7e4gw7v08qcy4f7f46acr06mycqhz0ppr7dyshjxvcxmegj7du7","basePool":"pool_rdx1ch4dmxh38s2as5k4c425lul5y98n0h67k7c7wl7wfpcjk2egrk7z6m","quotePool":"pool_rdx1c4ener2ytn9atu9k9qvmcsxsuae3e4d075pgwskv6ddqvquy9y9809"},{"address":"component_rdx1cpsjsatmr2ky2kzpunu33gxum8r9z0p5f4q05re826d22qc3pplfmy","baseToken":"resource_rdx1tkhseye4w0hmf2af5enwurkxu4x29zk73yckyzhndv8xdk8tp2tn8q","basePool":"pool_rdx1ckupjj2nd9ffj6glj4wq56t2v99fw6pfasaxgwggfrme0wu343hydd","quotePool":"pool_rdx1ch4gz2t686wznxmv4nrt5y08yku4ws4xymjed7l4mw2ns5q4urpmmr"},{"address":"component_rdx1cp6ldagny2mhmpxjwfhltu5nl2yajs2emzk0f6a800937gha9xxuw0","baseToken":"resource_rdx1t5ga7j04ek4laprf7xryxlu4hl04373sskdaaptfnjhnsns98vma8m","basePool":"pool_rdx1chqm6f6ufat0zt2g6d02msfk3l80n5acsc79wzwmw62qeqqwsz672c","quotePool":"pool_rdx1c5dkfdtdqvczcwzdyvzeuhddyha768p2q28erden533fty8h68ay6m"},{"address":"component_rdx1cq4a6uqk2ypgm8j2r77wecrraqs3qtjv09k0pge0dj2pvzg9nvqvk4","baseToken":"resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd","basePool":"pool_rdx1ch3fnuxnm05ngh5y0sap8fugwep0x2fg6v5aj5gv8ph9ddxv439c8f","quotePool":"pool_rdx1c5s3l6r7r53395ervsplly28e02sfyew80afdrlm88mm5egcajqnav"}]}' |
  jq -r '.data[] | (.address + " " + .baseToken + " " + .basePool + " " + .quotePool)' >$DEFIPLAZA
fi

echo 'export const defiplaza_listed_coins: {[key: string]: string}= {
  "resource_rdx1thyqj6yn4rmc8awxqhz6d60q9t677tre0ervrqpzfp4fzc20s4cmce": "dfp2 DefiPlaza",' >src/defiplaza.ts
cat $DEFIPLAZA |
  while read COMPONENT TOKEN POOL1 POOL2
  do
    curl -s --request POST 'https://mainnet.radixdlt.com/state/entity/details' \
      --header 'accept: application/json' --header 'Content-Type: application/json' \
      --data '{"addresses": ["'$TOKEN'"]}' |
      jq -r '.items[] | (.address + " " + (.metadata.items[] | (select(.key == "symbol" or .key == "name").value.typed.value)))' |
      awk '{
             k=$2
             for (i=3;i<=NF;i++)
               k=k $i
             if (! a[$1])
               a[$1]=k
             else
               a[$1]=a[$1] " " k
           }
           END{
             for (i in a)
               print "  \"" i "\": \"" a[i] "\","
           }' >>src/defiplaza.ts
  done
echo '};' >>src/defiplaza.ts

rm $DEFIPLAZA
