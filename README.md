# Clean Architecture on a simple Nodejs backend server

## Goal

The goal of this repository is to apply clean architecture concepts on a simple Nodejs backend server.

References:

- https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- https://www.goodreads.com/book/show/18043011-clean-architecture

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
