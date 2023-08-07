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

Configure the `.env` file in the root of this repository.

Set the `WS_URL` to a tfchain network url.

```bash
docker-compose up -d
```

Now the graphql endpoint is available at `http://localhost:4000/graphql`

## Releasing

See [release process](./release_process.md)

## Notes

### Reprocessing of indexer data

Reprocessing of indexer data (running the processor) would be usefull in situation where bugs are found and the data that is mapped would need remapping. This can be done by deleting the processor data and running it from 0 again with the code changes.