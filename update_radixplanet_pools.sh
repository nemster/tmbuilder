#!/bin/bash

RADIXPLANET=`mktemp`

while read COMPONENT
do
  curl -s -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' https://mainnet.radixdlt.com/state/entity/details \
    --data "{\"addresses\": [\"$COMPONENT\"],\"aggregation_level\": \"Global\",\"opt_ins\": {\"explicit_metadata\": [\"symbol\", \"name\"]}}"
  sleep 1
done >$RADIXPLANET <<EOF
component_rdx1cpnffthkvyjzz4fn98a9y3kewyy8fk6jjlg5seh94zxzq4fwqpmnmu
component_rdx1cry2knaknfzmtx93ucagww9sj7hdw90pt88extnq8pkd3wzyzm7zq6
component_rdx1cp3e5jf7unn4ge3fz23pu24ppngj2s5yzjt7vga4k3unymt9da3hus
component_rdx1crl39z974elznxxte9ttfyghlanx4yw37t9dyrd2t9lc3d2eaf7ql8
component_rdx1cqt408dlt5en7vrtutf03ktxqzhkrc0s6adgzaj3hvxvdd4danva6f
component_rdx1crf4azrppelstq4pspgj05ske04smd6z7aq0gv6hq09ap7kgtalm5t
component_rdx1crvuhh6gd557qgp00h2nwfku6xsvekd2598ddw5p56kgjzvnnwlxk5
component_rdx1czuy0qlyqltg43yylc8kdphtetq74dju8zpph4wjsuk762yc5jrtlu
component_rdx1crzskghjxtg0h46kfzt9pswfvr4trz2q2r05kvt2qcn2m7zz663g87
component_rdx1cp85g8dsqnw24vdtu9d7jkyasr5rekrjdn9cnda52um7q6lu0ncznr
component_rdx1cr6xvq7n7zwww0s2kpccr3fmdy4sg3xq3c2qpt0ktz7uk0ntshsmhu
component_rdx1cqnm40xy4qq93dxa2e7mwhggme2r8d46npndw4lz6myqw6xmazywe9
component_rdx1cqjnhsg0cv72fe0vewcn8y823uxvpulvnnrejd9xcmv82zyvl55qpw
component_rdx1cpwj3c7r5eq895szyke6vs2p7mgmd5q6c3z5ha2ac27xkhaekap5wx
component_rdx1cqax0qtumwldkqfelff3yam2n3694rdapq2e52ew9cx79aqn6xp3yp
component_rdx1crvfcr4nwdu8nrtur0tadjdg5c99mnmg3l88r5tqxsmrpc8v6vm8em
component_rdx1cp0luww2aswertzaf580d8clpxua8npkxarddpxxnjszpqwvy94hvx
component_rdx1czrtnd0wvw3ar6k4xtqt6ht24sml6hwzu9uje5l2cceejrc63qdsnt
component_rdx1cq3urp5nvpfrxscr80yvg5vku5x6t9vzj5a7hzmg598vazq6kmfzyx
component_rdx1cr5hexmf2lqc5073z0npv0hwt0pfrmxtpwel7dh6kf2d7g8rtncvl0
component_rdx1czhm0qggs4qpv0kme7rtwn574s9znmc9x8alqq7p0lsythxxtned79
component_rdx1czlaxprrq9fxcp2gevgapkjuwem4zc3474cc330l8sqn93mu0l6xys
component_rdx1cruafjjtrhknn5ht6z63lp5khrdfl9ka9lvgke5rm849u862uz45gt
component_rdx1cphl0q2adx5pyhq9awpa0agnaydp7n3e5ch83qmj3j7fgfgf0xgxvf
component_rdx1czrf2rmxrzer3sj30tu0qzyxape2gd24ztr9sjvupl4ak6tp0k4rh0
component_rdx1cz8seaylq87c96r2uwpa3hayn6r72rdkrs2athmxvvdqqv99mshhp2
component_rdx1cqwe6rl9jhy44s93keud0pv49h9qlrcjfcptc0xxfkefgemde9pyy6
component_rdx1cpdvqj0axt3g0h0vxe75f3ghhpt0hc8y93tf7w25nk6vldmc3ug6vd
component_rdx1cq59w02v0jzpu08ul9zltkhlr4kmwxzytn4785hxs82nkdgx0hjpnf
component_rdx1cz38n7h3k3pl0nje64tm73gpcz5vht4rffh3x4jxqywvkgcv4lg6g7
component_rdx1czy5utgrpxxk30yj0lvc49zm3rvfl4wfmmtk37xe6cw3r4d02xl9ck
component_rdx1cr67jvqshhhc93yr76ntqjpqaagd3x9knm90vgwh4np3zc7jszxdzv
component_rdx1cpwcphjewhza7rpvtr70lzqzpha7w68j06pm7anee2taz0q6frp2a2
component_rdx1cq0tygqte8s9dncdnu80e2ftxtv5lkkm486de86c7durhum5w4gpn5
component_rdx1cr5dx6s27u2tjmzkk44hma4v3eyqkv8ldm32nw2dzfuqx0swynauhy
component_rdx1cppcmxshstkxt372kn2m3n80q2txnn2zu6ezygnmazqksynuua8yg3
component_rdx1cq980eccf5q4wsahwa3rqkeqxdgey7rwrp70wae60fgcr7m74lpuye
component_rdx1cpaxt6z368gv7ksxzny02v93gxfd0p9fzxvjga5g5pfg5tx9dkl9ne
component_rdx1crhzfcw2ghnzmsz8rwawqtu4qspf8qk60gsfjkmgmvca7y5tyn8zhd
component_rdx1cqhlng85plalnwvyrh440ls6cfxgdk63s5cfsnuu236gglnvxk6nh3
component_rdx1crvlp6u6sx3hxn9sz4s57ktpszqpaaz6ln327umtcvgp23fjet4amk
component_rdx1crrflqtm3e43zfkd4z9j2gxyuv2qjkmuvg0avdmsx52500lcempsra
component_rdx1czgkwhvvek5uyl4j394fkaj8hu9hv4h5kjlj0jre7lfvtq00rxzahm
component_rdx1cqsda609f8cemetddnck554vz7pwnkwdnty9cqmn8qu3lkqy32xh5p
component_rdx1cprhtf8n35gga9arkq26zzjftk47ftpdnkgv6r3elzrvx08tl0zh8p
component_rdx1cql5vq52mpp8f5yz8fyczysvq7c089c8763st992vfper8j5dxz9fy
component_rdx1czxfdhuqtr2sdkxtcwlt6r3ewasjv3yk35c83mxdc4f6qgv2c5zxyv
component_rdx1cqekztcjp5yzpyqjea6a6s20v2lc3y0djx7dnyekvqeaj9j7shhwtq
component_rdx1cpxp9ve5j77hp5v8gquu5l0wqfld646hluv7pguxlx0d8urdy8z8kc
component_rdx1cruqpdzqdwwchr4c20wq9rrckm0g7dg6k06lkfsp7y2wlhpnk7qtkq
component_rdx1cz2pu2cymeuh2fqpc52venkw49657rqy0vhgnwymqyvqpyw72vcktj
component_rdx1cr6c0myfwrjgj0sytujsajze7c83kgdpj6nu0puxkd4v7pwyj46tfu
component_rdx1cpm5ufq9r68fdntrlct9esdamd6krunmlq8pqg5a9ggrddqgjqq9ej
EOF

RESOURCES=`mktemp`
jq -r '.items[] | (.address + " " + (.fungible_resources.items[] | (.resource_address + " " + .explicit_metadata.items[].value.typed.value)))' <$RADIXPLANET |
  awk '{
       k=$3
       for (i=4;i<=NF;i++)
         k=k $i
       if (! a[$1 " " $2])
         a[$1 " " $2]=k
       else
         a[$1 " " $2]=a[$1 " " $2] " " k
       }
       END{
        for (i in a)
        print i " " a[i]
     }' >$RESOURCES

echo 'export const radixplanet_listed_coins: {[key: string]: string}= {' >src/radixplanet.ts
  awk '{print "  \"" $2 "\": \"" $3 " " $4 " " $5 "\","}' <$RESOURCES |
  sort |
  uniq >>src/radixplanet.ts
echo '}' >>src/radixplanet.ts

echo 'export const radixplanet_pool1: {[key: string]: string}= {' >>src/radixplanet.ts
grep -v PLANET <$RESOURCES |
  awk '{print $1}' |
  sort |
  uniq -c |
  while read NUMBER_OF_TOKENS COMPONENT
  do
    if [ $NUMBER_OF_TOKENS -lt 3 ]
    then
      grep -m 1 $COMPONENT <$RESOURCES |
        awk '{print "  \"" $1 "\": \"" $2 "\","}' >>src/radixplanet.ts
    fi
  done
echo '}' >>src/radixplanet.ts

PLANET="resource_rdx1thn6xa5vjdh5zagqzvxkxpd70r6eadpzmzr83m20ayp3yhxrjavxz5"

echo 'export const radixplanet_pool2: {[key: string]: string}= {' >>src/radixplanet.ts
grep -v PLANET <$RESOURCES |
  awk '{print $1}' |
  sort |
  uniq -c |
  while read NUMBER_OF_TOKENS COMPONENT
  do
    if [ $NUMBER_OF_TOKENS -eq 2 ]
    then
      grep $COMPONENT <$RESOURCES |
	tail -n 1 |
        awk '{print "  \"" $1 "\": \"" $2 "\","}' >>src/radixplanet.ts
    elif [ $NUMBER_OF_TOKENS -eq 1 ]
    then
      echo "  \"$COMPONENT\": \"$PLANET\"," >>src/radixplanet.ts
    fi
  done
echo '}' >>src/radixplanet.ts

echo 'export const radixplanet_fees: {[key: string]: number}= {' >>src/radixplanet.ts
jq -r '.items[] | (.address + " " + (.details.state.fields[] | select(.field_name=="rules").elements[].fields[].fields[] | select(.field_name=="value").value))' <$RADIXPLANET |
  awk '{
       k=$2
       for (i=3;i<=NF;i++)
         k=k $i
       if (! a[$1])
         a[$1]=k
       else
         a[$1]=a[$1] "+" k
       }
       END{
        for (i in a)
        print i " " a[i]
     }' |
  while read COMPONENT FEES
  do
    TOTAL_FEES=`echo $FEES | bc | awk '{printf "%f", $0}'`
    echo "  \"$COMPONENT\": ${TOTAL_FEES},"
  done >>src/radixplanet.ts
echo '}' >>src/radixplanet.ts

rm $RADIXPLANET $RESOURCES
