# Production setup

## Requirements

- Tfchain network url. (e.g. `wss://tfchain.dev.grid.tf/ws`)
- Docker
- Docker-compose

## Run the setup

### Indexer

Configure the `.env` file in `./indexer`

Set the `WS_URL` to a tfchain network url.

```bash
cd indexer
docker-compose up -d
```

### Processor

Configure the `.env` file in `./processor`

Set the `WS_URL` to a tfchain network url.

```bash
docker-compose up -d
```

Now the graphql endpoint is available at `http://localhost:4000/graphql`