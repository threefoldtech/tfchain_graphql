# Tfchain graphql

[Subsquid](https://docs.subsquid.io) is used to index and provide a graphql interface on top of tfchain.

## Concept

The substrate events are processed in a multi-step pipeline:

    Tfchain => Squid Indexer => Indexer GraphQL gateway => Squid Processor => Database => Query Node GraphQL endpoint

![Bird eye overview](https://gblobscdn.gitbook.com/assets%2F-MdI-MAyz-csivC8mmdb%2Fsync%2Fe587479ff22ad79886861487b2734b6556302d10.png?alt=media)

## Prerequisites

* Node v14x
* Docker
* Docker-compose

## Running

see [docs](./docs/readme.md)