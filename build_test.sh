#!/bin/bash

npm run build

rm /var/www/tmbuilder/test/assets/ -Rf
mv dist/* /var/www/tmbuilder/test/
sed -i 's/\/assets/assets/' /var/www/tmbuilder/test/index.html
