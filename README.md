# Space Service

## Getting Started

### Install

#### Copy template

- Click on "use this template" within github repository

#### Bulk rename

Assuming you want to create `new-service` repository.

- `hello-service` ~~> `new-service`
- `hello.sidebyside.live` ~~> `new.sidebyside.live`
- `hello.dev.sidebyside.live` ~~> `new.dev.sidebyside.live`
- `hello.test.sidebyside.live` ~~> `new.test.sidebyside.live`
- `hello.test.dev.sidebyside.live` ~~> `new.test.dev.sidebyside.live`

See https://github.com/amfa-team/template-service/pull/1

#### Create `packages/api/.env` from `packages/api/.env.example`

- Create Sentry project named `new-service-api` and set `SENTRY_DNS` env-vars

#### Create `packages/example/.env` from `packages/example/.env.example`

- Create Sentry project named `new-service-example` and set `SENTRY_DNS` env-vars

#### AWS Profile

- Create AWS profile named `picnic` https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

> You can also use `cd package/api && yarn serverless config credentials --provider aws --key xxxx --secret xxx --profile picnic`

#### Create Secrets

Add following secrets to your repository:

- `SLACK_WEBHOOK_SDK`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SENTRY_API_DNS`
- `SENTRY_EXAMPLE_DNS`
- `SENTRY_AUTH_TOKEN`
- `API_ENDPOINT_STAGING`: `https://new.dev.sidebyside.live/api/`
- `API_ENDPOINT_PRODUCTION`: `https://new.sidebyside.live/api/`

#### Github Repository

- Open your github repository Settings
- Go to Branches
- Set `develop` as default branch

## Usage

### Github Packages

In order to use private npm packages, you need to set `.npmrc` using the `.npmrc.template`

see https://docs.github.com/en/free-pro-team@latest/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#authenticating-with-a-personal-access-token

## What's included

### Start

Run `yarn && yarn start`

> If you have the following error `Error: Can't resolve '@amfa-team/test-service'`, just restart the
> tab with example script (lib sdk was not build on start).

### Prettier

- Extensions: `js,ts,tsx,css,md,json`
- VsCode settings: AutoFormat on save
- Husky: AutoFormat on commit
- Github Action check

### Linter

- Includes `eslint` with `eslint-config-sbs`
- Includes `stylelint`

### Yarn Workspaces

- Uses yarn workspaces

### Github Actions

- prettier check
- build

### Commit Hooks

- Prettier
- Commit Lint with conventional commits (https://www.conventionalcommits.org/en/v1.0.0/#summary)

### Packages

#### React

- React component library
- Deployment with Slack message on `#deploy` channel

#### Example

- React App example project using react component library
- Deployment with Slack message on `#deploy` channel

#### API

- Serverless API
- Deployment with Slack message on `#deploy` channel
