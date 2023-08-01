# Release Process

## Release a new version

1. Update the version in `indexer/chart.yaml` and `processor-chart/chart.yaml`
2. Update the version `package.json` and `package-lock.json` (by doing `npm install` or `yarn`)
3. Commit and these changes and tag the commit with the new version (e.g. `v0.0.1`)
4. Create a release on github release page from the tag. The release title should be the version number and the release description should contain the changelog.