#!/bin/bash

DEX_IP=127.0.0.1   
DEX_HOST=dex.local



clear

echo "Compose Full (Auth + App), requires sudo permissions to modify /etc/hosts"
echo "-------------------------------------------------------------------------"
sed -i.bak "/$DEX_HOST/d" /etc/hosts
echo -e "\nAdding $DEX_HOST to /etc/hosts with IP $DEX_IP\n"

# Add entry if not already present
if ! grep -q "$DEX_HOST" /etc/hosts; then
  echo "$DEX_IP $DEX_HOST" >> /etc/hosts
fi

# Down Dex-Full Compose if running
docker compose -f ../dex-dev/compose.yml down
# Down/Up your containers
docker compose down && docker compose up -d --wait
echo -e "\nLet's do it!"