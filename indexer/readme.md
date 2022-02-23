# Setting up an indexer

## Docker compose

First check `.env` file, this contains 2 variables:

```
WS_ENDPOINT=ws://localhost:9944
START_HEIGHT=0
```

Set the `WS_ENDPOINT` to a URL you want to connect to.

Start indexer:

```
docker-compose up -d
``` 

Stop:

```
docker-compose down
```