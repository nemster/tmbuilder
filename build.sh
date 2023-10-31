#!/bin/bash

./update_ociswap_pools.sh

./update_validators_list.sh

npm run build

rm /var/www/tmbuilder/assets/ -Rf
mv dist/* /var/www/tmbuilder/
