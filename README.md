# News API App

This app serves data from a PostgreSQL database with articles, comments and users.
API endpoints have been created using Express.js and an Model-View-Controller approach has been taken to organize the project.

## Hosted on Heroku

https://nc-news-app-project.herokuapp.com/

## Environment setup

To set the environment values for the database, use the following:

### Test Setup:

- Create a `.env.test` file in the root directory
- insert `PGDATABASE=nc_news_test`

### Development setup:

- Create a `.env.development` file in the root directory
- insert `PGDATABASE=nc_news`

## Install Dependencies

run `npm install` to install the following dependencies:

- `dotenv` : to set the environment variables.
- `express` : to create the api server.
- `pg` : PostgreSQL client for Node.js.
- `supertest` : to run server endpoint tests.
- `jest` (dev) : to create and run tests.
- `jest-sorted` (dev) : to add a sorted method to jest tests of the PostgreSQL data.
- `pg-format` (dev) : Node.js implementation of PostgreSQL format() to safely create dynamic SQL queries. SQL identifiers and literals are escaped to help prevent SQL injection.
- `husky` (dev) : pre-commit check that tests pass before allowing a git commit.

## Scripts

- `setup-dbs` : runs the setup.sql file
- `seed` : runs the run-seed.js file to seed the database
- `test` : runs the app.tests.js file with jest
- `prepare` : installs husky

## Available Endpoints

- `GET /api/topics`
- `GET /api/articles/:article_id`
- `GET /api/users`
- `GET /api/articles`
- `GET /api/articles/:article_id/comments`
- `GET /api`

- `PATCH /api/articles/:article_id`

- `POST api/articles/:article_id/comments`

- `DELETE /api/comments/:comment_id`

## Requirements

- Node v17.2.0 (tested)
- PostgreSQL 12.9 (tested)

Earlier versions have not been tested.
