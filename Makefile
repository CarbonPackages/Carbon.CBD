.PHONY: update prettier lint upgrades help build watch dev

## Prettier files
prettier:
	@pnpm prettier --write --no-error-on-unmatched-pattern '{Configuration,NodeTypes}/**/*.yaml'
	@pnpm prettier --write --no-error-on-unmatched-pattern 'Resources/Private/**/*.{js,jsx,css}'
	@pnpm prettier --write --no-error-on-unmatched-pattern '*.{mjs,md}'

## Lint files
lint:
	@pnpm eslint Resources/Private/**/*.{js,jsx}

## Update to latest pnpm packages
update:
	@corepack use pnpm@latest
	@pnpm upgrade
	@pnpm up --latest --interactive

## Build files in production mode
build:
	@pnpm install --silent
	@rm -rf Resources/Public
	@make prettier
	@pnpm build

## Watch files in development mode
watch:
	@pnpm watch

## Build files in development mode
dev:
	@pnpm dev


# Define colors
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RESET  := $(shell tput -Txterm sgr0)

# define indention for descriptions
TARGET_MAX_CHAR_NUM=12

help:
	@echo ''
	@echo '${GREEN}CLI command list:${RESET}'
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  ${YELLOW}%-$(TARGET_MAX_CHAR_NUM)s${RESET} ${GREEN}%s${RESET}\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
	@echo ''

.DEFAULT_GOAL := help
