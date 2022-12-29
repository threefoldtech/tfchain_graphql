# Developing on tfchain graphql

Install: 

```
yarn
yarn build
```

## Local Network

### Run tfchain 

see https://github.com/threefoldtech/tfchain

### Run Indexer

Check `indexer/.env` and adjust the websocket endpoint to your local tfchain address.

```
cd indexer
docker-compose up -d
```

Indexer services should now be started, you can check if it's syncing properly by streaming the logs for the indexer:

```
docker logs indexer_indexer_1 -f
```

### Run processor

Check `.env` and adjust the websocket endpoint to your local tfchain address.

```
yarn build
yarn db:up
yarn process
```

### Run graphql UI

```
yarn api
```

Browse to http://localhost:4000/graphql to see the UI