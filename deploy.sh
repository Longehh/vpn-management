#!/bin/bash
echo "AzuraX Deploy Panel"
cd frontend
npm run build
mkdir -p /var/www/azura

cp -r build/. /var/www/azura
echo Deploy Complete!