# Setting up an indexer

## Docker compose

First check `.env` file, this contains 2 variables:

```
WS_ENDPOINT=ws://localhost:9944
START_HEIGHT=0
```

Set the `WS_ENDPOINT` to a URL you want to connect to. Eg `wss://tfchain.dev.grid.tf` or `ws://localhost:9944`

Start indexer:

```
docker-compose up -d
``` 

Stop:

```
docker-compose down
```

### Docker Compose setup

This stack consists of 4 containers:

- Cockcroach db: database for storing the indexer data
- subsquid/substrate-ingest: the ingester program
- subsquid/substrate-gateway: a gateway to the ingested data (graphql endpoint)
- subsquid/substrate-explorer: a web interface to explore the raw ingester data and it's status

Note on cockroach db: "The --insecure flag used in this tutorial is intended for non-production testing only. To run CockroachDB in production, use a secure cluster instead." See [official docs](https://www.cockroachlabs.com/docs/stable/deploy-cockroachdb-on-premises-insecure)