# Clean Architecture on a simple Nodejs backend server

## Goal

The goal of this repository is to apply clean architecture concepts on a simple Nodejs backend server.

References:

- https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- https://www.goodreads.com/book/show/18043011-clean-architecture

## Run

### Setup:

```
npm install
```

### Run unit/integration tests:

```
npm run test
```

```
npm run test:coverage
```

### Run e2e tests:

#### Based on testcontainers with GenericContainers

```
npm run test:e2e
```

#### Based on testcontainers with docker compose and a mysql database

```
npm run test:e2e:compose:mysql
```

#### Based on testcontainers with docker compose and an in-memory database

```
npm run test:e2e:compose:inmemory
```

### Run backend server with inmemory implementations

```
npm run dev:inmemory
```

Use REST Client VSCode plugin to send queries using events.rest file.

### Run backend server with a read database using docker-compose

```
npm run dev:docker
```

Use REST Client VSCode plugin to send queries using events.rest file.

NB: Docker must be installed and running.

## Next steps

- DDD: use Event instead of validator
- Make an image and test e2e with that image
- Implement missing unit tests
- Localization & error string mapping

## Notes: Testcontainers debug traces

Add an environment variable to enable debug traces.

PowerShell command:

```
$Env:DEBUG = "testcontainers\*"
```
