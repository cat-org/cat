ROOT=$(shell pwd)

install:
	@yarn install
	@yarn lerna bootstrap
	@make babel-all
	@yarn flow-typed install --verbose
	@yarn lerna exec "lerna-flow-typed-install --verbose" \
		--stream \
		--concurrency 1

babel-all:
	@$(call babel-build)
	@yarn lerna link

BRANCH=$(shell git branch | grep \* | cut -d ' ' -f2)
WATCH=""
babel-changed:
ifeq ($(shell printenv CI), true)
	@echo "Skip babel build"
else
	@$(call babel-build, $(WATCH), --since $(BRANCH))
endif

release:
	@yarn lerna-changelog && \
		echo "\nContinue with any keyword or exit with 'ctrl + c'..." && \
		read -p ""
	@vim CHANGELOG.md && \
		git add CHANGELOG.md && \
		git commit -m "chore(root): add CHANGELOG.md"
	@yarn lerna version

clean:
	@yarn lerna clean && rm -rf ./node_modules
	rm -rf ./packages/**/lib ./server/**/lib
	rm -rf ./flow-typed
	rm -rf ./coverage
	rm -rf ./.eslintcache
	rm -rf ./.changelog
	rm -rf ./*.log

define babel-build
	yarn lerna exec \
		"USE_DEFAULT_BABEL=true babel src -d lib --config-file ../../.catrc.js --verbose" \
		--parallel \
		--stream \
		--include-filtered-dependencies \
		--scope @cat-org/configs \
		--scope @cat-org/babel-* \
		$(2)
	yarn lerna link
	yarn lerna exec \
		"configs babel:lerna $(1)" \
		--parallel \
		--stream \
		$(2)
endef
