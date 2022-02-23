# Setup Indexer + Processor steps

Requirements:

- node 14
- yarn
- docker-compose

## Step 1

Start indexer, see [docs](./indexer/readme.md)

## Step 2: Start processor

First start database

```
yarn db:up
yarn db:migrate
yarn db:init
```

Migrate processor:

```
yarn processor:migrate
```

Start everything:

```
docker-compose up -d
```
