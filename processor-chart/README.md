# Processor chart

## Install chart with helm

Create PersistentVolumeClaims for the database if wanted and reference the name in your values file in the `volume.existingpersistentVolumeClaim` property.

```sh
cd tfchain/graphql/processor-chart
helm install tfchainprocessor  [-f yourvaluesfile.yaml] .
```

If the processor cannot reach the database, you can set `db_url` to the db-service cluster ip.

```sh
kubectl get svc
```

## NOTES

take note of the IP assigned the db-service. Use this IP in `values.yaml` for the db url.
