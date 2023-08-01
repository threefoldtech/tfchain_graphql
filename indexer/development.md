# Tfchain hydra indexer development

## Modifying the types.json

When the typesBundle.json file has been modified, it needs to be updated in the helm chart as well.

```sh
kubectl create configmap indexer-config --from-file=./typesBundle.json --dry-run=client --output=yaml > chart/templates/indexer-config.yaml
```

Don't forget to update the chart version afterwards.
