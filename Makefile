.DEFAULT_GOAL := help
.PHONY: help install tokens build lint fmt types test verify pack version clean storybook visual visual-update

help: ## Показати цілі
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

install: ## Поставити залежності строго за lock-файлом
	pnpm install --frozen-lockfile

tokens: ## Згенерувати CSS, тему Tailwind, TS і Dart з tokens/*.json
	pnpm run tokens

build: ## Зібрати пакет у ./dist (JS, CSS, .d.ts)
	pnpm run build

lint: ## ESLint + перевірка форматування
	pnpm run lint

fmt: ## Виправити те, що виправляється
	pnpm run lint:fix

types: ## vue-tsc
	pnpm run type-check

test: ## Юніт-тести одним проходом
	pnpm run test:unit --run

verify: ## Усе, що робить CI
	pnpm run tokens:check
	$(MAKE) lint types test build

pack: build ## Зібрати .tgz, як його побачить застосунок
	pnpm pack

version: ## Нова версія: make version V=0.2.0, потім git push --follow-tags
	@test -n "$(V)" || (echo "Вкажи версію: make version V=0.2.0"; exit 1)
	pnpm version "$(V)" --no-git-tag-version
	git commit -am "Реліз $(V)"
	git tag -a "v$(V)" -m "@kite-post/ui $(V)"

clean: ## Прибрати збірку і кеші
	rm -rf dist coverage storybook-static node_modules/.tmp node_modules/.vite

PLAYWRIGHT_IMAGE := mcr.microsoft.com/playwright:v1.65.1-noble

storybook: ## Storybook для розробки (http://localhost:6006)
	pnpm storybook

visual: ## Візуальні регресії в Linux-образі Playwright (як у CI)
	pnpm build-storybook
	docker run --rm --ipc=host -v "$(CURDIR):/work" -w /work -e CI=1 $(PLAYWRIGHT_IMAGE) npx playwright test

visual-update: ## Оновити еталонні знімки (після навмисних змін вигляду)
	pnpm build-storybook
	docker run --rm --ipc=host -v "$(CURDIR):/work" -w /work $(PLAYWRIGHT_IMAGE) npx playwright test --update-snapshots
