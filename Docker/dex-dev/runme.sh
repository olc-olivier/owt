#!/bin/bash

clear

echo "Compose Dev (Auth)"
echo -e "------------------\n"

# Down Dex-Full Compose if running
docker compose -f ../dex-full/compose.yml down
# Down/Up your containers
docker compose down && docker compose up -d --wait

echo -e "\nRun the Spring Boot App separately, from the base folder. cmd -> ./mvnw spring-boot:run\n"