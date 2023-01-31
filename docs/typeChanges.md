# How to handle type changes on chain

## Type change

If a type change was made or some types were added we can use the following process to add the corresponding changes.

### 1: Run a local chain

See [./development]

Make sure you increment the `specVersion` before you compile and run tfchain.

### 2: Setup new indexer types

Modify `indexer/typesBundle.json` with the new types additions / changes.

Example: in specVersion 104, `solution_provider_id` was added to the `Contract` object, the typesbundle definition for that looks like:

```json
{
    "minmax": [
        104,
        null
    ],
    "types": {
        "Contract": {
          "version": " u32",
          "state": "ContractState",
          "contractId": "u64",
          "twinId": "u32",
          "contractType": "ContractData",
          "solutionProviderID": "Option<U64>"
        }
    }
},
```

Notice the [104, null] definition, this means this type if valid from specVersion 104 until some to define perdiod (null if you don't know).

If specVersion 104 would just add a type without modifiying existing types it could look like this:

```json
{
    "minmax": [
        104,
        null
    ],
    "types": {
        "newType": {
          "someId": "u64",
        }
    }
},
```

When the types.json file has been modified, it needs to be updated in the helm chart as well.

```sh
kubectl create configmap indexer-config --from-file=./typesBundle.json --dry-run=client --output=yaml > chart/templates/indexer-config.yaml
```

Also increment the indexer chart version `indexer/chart/chart.yaml`

### 3: Run typegen exploration

`cd typegenLocal`

Copy over the typesBundle.json changes to `typegenLocal/typesBundle.json`.

Once the typesBundle is modified, check if changes are required for generating types in `typegen.json`

If you for example need to track a new event you need to edit the events declaration:

```json
  "events": [
    "balances.Transfer",
    "TfgridModule.EntityStored",
    "TfgridModule.EntityUpdated",
    "TfgridModule.EntityDeleted",
    ...
    "someModule.newEvent"
    ...
```

Once you have done this, it's time to generate the types.

```
rm tfchainVersions.json
```

First, explore new types from the metadata:

```
npx squid-substrate-metadata-explorer \
                --chain ws://localhost:9944 \
                --out tfchainVersions.json
```

Then, run the type generation:

```
npx squid-substrate-typegen typegen.json
```

Notice it will re-generate following files:

- src/typesLocal/events.js
- src/typesLocal/$SPECVERSION.js

### 4: Add new types / event to the main events definitions

All events / types should be moved to `src/types` because we cannot generate types based on 1 chain because this code served more than 1 chain.

At the inception of this project we generated `src/types` from devnet chain, but since we resetted devnet and we don't incrementally upgrade every network
at all times, we stopped generating `src/types` and started modifiying them manually. While this is not really easy to develop against, it's the only solution for us.

So we need to extend the generated src/types with incremental type changes we make over time.

Steps:

- move new $specVersion.ts file to `src/types`
- copy changes from `src/typesLocal/events.ts` to `src/types/events.ts` (see which events were added / modified and only copy those over)

### 5: Modify graphql schema

Make changes to the graphql schema but prepare the database first:

```
yarn db:up
yarn process
```

The process will likely crash or stop but the db is initialised with the current schema. Now we can edit the graphql schema file: `schema.graphql`.

Once changes are done to the schema, you can create a database migration:

```
yarn codegen
yarn build
yarn db:create-migration
```

### 6: Create / extend mappers

Make the corresponding changes in `src/processor.ts` and mappers `src/mappings/..` for the type changes that were made

### 7: Build and test

TODO
