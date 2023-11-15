#!/bin/bash

./update_ociswap_pools.sh

./update_validators_list.sh

./update_defiplaza_pools.sh

php update_radixplanet_pools.php >src/radixplanet.ts

npm run build

rm /var/www/tmbuilder/assets/ -Rf
mv dist/* /var/www/tmbuilder/

cp defiplaza.php /var/www/tmbuilder/
