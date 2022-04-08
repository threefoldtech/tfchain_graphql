set -e

yarn build
docker-compose down
yarn db:up
sleep 2
yarn process