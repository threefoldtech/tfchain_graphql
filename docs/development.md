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
docker logs indexer-ingest-1 -f
```

You should be able to follow tfchain blocks processing:

![image](https://user-images.githubusercontent.com/73958772/209998096-3d5381d9-97ee-438d-824d-d92d997b42aa.png)

### Run processor

Check `.env` and adjust the websocket endpoint to your local tfchain address.

```
yarn build
yarn db:up
yarn process
```

You should be able to follow tfchain blocks processing:

![image](https://user-images.githubusercontent.com/73958772/210000023-c575d91a-382e-4fdc-85b3-199a135b493f.png)


If you make some changes, don't forget to turn down container before tuning it on again.

```
docker-compose down
```

### Run graphql UI

At this step, by running 

```
docker ps
```

it should display such list of running containers:

![image](https://user-images.githubusercontent.com/42457449/258668686-cd331bd6-ed80-47ea-87a5-16f88d969025.png)

Make sure indexer and processor are both listening to tfchain to be able to browse.

```
yarn api
```

Now you can use the UI (http://localhost:4000/graphql) and run some tests.
