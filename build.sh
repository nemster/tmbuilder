#!/bin/bash

npm run build

rm /var/www/tmbuilder/assets/ -Rf
mv dist/* /var/www/tmbuilder/
