# My implementation of the Udemy Course on Nest.JS

<p align="center">
  <a href="https://www.udemy.com/certificate/UC-aee2960b-a073-4f5b-a6d2-72e52214fd30/" target="blank"><img src="https://udemy-certificate.s3.amazonaws.com/image/UC-aee2960b-a073-4f5b-a6d2-72e52214fd30.jpg?v=1692065060000" width="50%" alt="Nest certificate" /></a>
</p>
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" /></a>
  <a href="https://www.karatelabs.io/" target="blank"><img src="src/utils/karate-labs-logo-ring.svg" width="100" alt="Karate Logo" /></a>
</p>

## Description

My implementation of the **RealWorld** specs, as taught through the Udemy course [NestJS - Building Real Project API From Scratch](https://www.udemy.com/course/nestjs-building-real-project-api-from-scratch)

**Now with Karate tests!**
I've added some [Karate tests](/test/Karate Tests) and actually found a couple of errors!

This course was based on building the [RealWorld](https://realworld-docs.netlify.app/docs/intro) demo. Specifically adhering to the [backend specs](https://realworld-docs.netlify.app/docs/specs/backend-specs/introduction). This was really nice since it really gave you a chance to build something more that an simple 'to do' application.

### What I liked about the course

- Gave you a lot of experience following predefined specs
- He included a lot of 'production ready' tips
- He also explained file structure and organization
- In the later modules, he paused to let you complete the module on your own, then gave hints if you just needed a little help, then explained the full module. I did find myself completing many of the modules on my own or with a couple of hints, but watching the full explanation showed me things I didn't know or think about.
- There is a complimentary frontend course using Angular and NgRx
- PostGres is one of my least familiar databases, I got learn a lot of the syntax around it. In the course, he didn't use the Admin UI, we interacted with the database through code or through the CLI.

### What I didn't like about the course

- He used TypeORM because of the long term stability it had. Then they updated breaking changes soon after the course was created. He provided on screen tips for the newer version, but I found myself reading the documentation a lot.
- TypeORM provides a simple "save()" command. It made it easy to go through the course, but I think in a production environment, it could have performance issues. If this were an actual production application, I would have used more granular "insert" or "update" commands, especially when I know ahead of time which one I'm doing like in Create or Update methods.

### What I changed

- He used stock Nest validation pipes, I find JOI easy to read and intuitive. I replaced his validation pipes with Joi validation.
- For brevity, he didn't include any Unit testing. I'm adding unit tests after the course.
- Also, for brevity, he used strings directly. This makes unit tests brittle and maintenance a little difficult.
  - I'm just starting this while creating unit tests.
  - This is technical debt, I don't want to stop and do this all at once, I'll be converting strings to constants as I go
- He also didn't cover the 'Comments' section of the application. I'll fill those out as I'm working on the frontend course.

## Installation

```bash
yarn install
```

## Running the app

```bash
# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod
```

## Test

```bash
# unit tests
yarn run test

# e2e tests
yarn run test:e2e

# test coverage
yarn run test:cov
```

## DB integration

```bash
# Make changes
- make updates in <entity>.entity.ts file
- Use the @Entity() decorator

# Create Migration
yarn db:create <full path and file name>
# example
- yarn db:create src/migrations/CreateUsers
- Creates src/migrations/<timestamp>-CreateUsers.ts

# Apply changes
yarn db:migrate

```

## DB cli

```bash
# Start and login
- cmd: psql mediumclone tfc_svc
- psql -d mediumclone -U tfc_svc

# Common Commands
-  \l list all databases
-  \dt display all tables
-  \du display all users
-  \c <database name> log into database
-  \d <table name> describe table
-  \x toggle expended display ('pretty print') displays as record insted of table format

# example
- yarn db:create src/migrations/CreateUsers
- Creates src/migrations/<timestamp>-CreateUsers.ts

# Apply changes
yarn db:migrate

```
