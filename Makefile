.PHONY: version-bump

# usage: > type=patch make version-bump
# usage: > type=minor make version-bump
# usage: > type=major make version-bump
version-bump:
	set -e; \
	if [ "$(type)" = "patch" ] || [ "$(type)" = "minor" ] || [ "$(type)" = "major" ]; then \
		default_branch=$$(git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'); \
		git checkout $$default_branch; \
		git pull origin $$default_branch; \
		new_version=$$(npx semver -i $(type) $$(jq -r .version package.json)); \
		branch_name="$$default_branch-bump-version-to-$$new_version"; \
		git checkout -b $$branch_name; \
		jq ".version = \"$$new_version\"" package.json > temp.json && mv temp.json package.json; \
		sed -i "s/^appVersion: .*/appVersion: '$$new_version'/" indexer/chart/Chart.yaml; \
		sed -i "s/^appVersion: .*/appVersion: '$$new_version'/" processor-chart/Chart.yaml; \
		git add processor-chart/Chart.yaml indexer/chart/Chart.yaml package.json ; \
		git commit -m "Bump version to $$new_version"; \
	else \
		echo "Invalid version type. Please use patch, minor, or major."; \
	fi
