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

### Run e2e tests:

Coming next.

### Run backend server with inmemory implementations

```
npm run dev:inmemory
```

Use REST Client VSCode plugin to send queries using events.rest file.

### Run backend server with a read database using docker compose

```
npm run dev:docker
```

Use REST Client VSCode plugin to send queries using events.rest file.

## Next steps

- Implement missing unit tests
- Password authentication: plug + switch
- Localization & error string mapping
- e2e tests: supertest / testcontainers with real database on current code base
- e2e tests with a built docker image

## Notes

PowerShell command to add Docker traces for testcontainers:

```
$Env:DEBUG = "testcontainers\*"
```
