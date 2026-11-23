.DEFAULT_GOAL := help
.PHONY: help install tokens build lint fmt types test verify pack release tag clean playground storybook visual visual-update dart

help: ## Показати цілі
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

install: ## Поставити залежності строго за lock-файлом
	pnpm install --frozen-lockfile

tokens: ## Згенерувати CSS, тему Tailwind, TS і Dart-пакет з tokens/*.json
	pnpm run tokens

FLUTTER_IMAGE := ghcr.io/cirruslabs/flutter:stable

dart: ## Перевірити Dart-пакет tokens/dart (flutter analyze у Docker, як у CI)
	docker run --rm -v "$(CURDIR)/tokens/dart:/w" -w /w $(FLUTTER_IMAGE) \
		sh -c 'flutter pub get >/dev/null && flutter analyze --fatal-infos; s=$$?; rm -rf .dart_tool pubspec.lock; exit $$s'

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

release: ## Крок 1 релізу: гілка release/vV з новою версією і PR — make release V=0.8.0
	@test -n "$(V)" || (echo "Вкажи версію: make release V=0.8.0"; exit 1)
	@test -z "$$(git status --porcelain)" || (echo "Спершу закоміть або сховай зміни"; exit 1)
	git switch main && git pull --ff-only
	git switch -c "release/v$(V)"
	pnpm version "$(V)" --no-git-tag-version
	pnpm run tokens   # версія Dart-пакета tokens/dart/pubspec.yaml = версія package.json
	git commit -am "Реліз $(V)"
	git push -u origin "release/v$(V)"
	gh pr create --title "Реліз $(V)" --body "Версія $(V). Після злиття: make tag."

tag: ## Крок 2 релізу (після злиття PR): тег vX.Y.Z на main → публікація і Storybook
	git switch main && git pull --ff-only
	@v="$$(node -p "require('./package.json').version")"; \
		git tag -a "v$$v" -m "@kite-post/ui $$v" && git push origin "v$$v"

clean: ## Прибрати збірку і кеші
	rm -rf dist coverage storybook-static node_modules/.tmp node_modules/.vite

playground: ## Майданчик компонентів (http://localhost:5174, ?shell — оболонка)
	pnpm exec vite --config playground/vite.config.ts

PLAYWRIGHT_IMAGE :=mcr.microsoft.com/playwright:v1.65.1-noble

storybook: ## Storybook для розробки (http://localhost:6006)
	pnpm storybook

visual: ## Візуальні регресії в Linux-образі Playwright (як у CI)
	pnpm build-storybook
	docker run --rm --ipc=host -v "$(CURDIR):/work" -w /work -e CI=1 $(PLAYWRIGHT_IMAGE) npx playwright test

visual-update: ## Оновити еталонні знімки (після навмисних змін вигляду)
	pnpm build-storybook
	docker run --rm --ipc=host -v "$(CURDIR):/work" -w /work $(PLAYWRIGHT_IMAGE) npx playwright test --update-snapshots
