# Periodic Tables Restaurant Reservation System

### The Project

This is a Responsive Web Application designed to help restaurants create and manage reservations for customers in order for them to have an organized list of each reservation on a day to day basis. This application can also manage the tables in the restaurant and the seating of reservations associated with them. Finally, the user can also search a phone number in case they need to pull up a reservation quickly or that they can't find.

This application uses a mobile first approach combined with the PostgreSQL, Express.js, React, and Node.js (PERN) stack set up as a Monorepo. I used Elephantsql for the database and Heroku for deployment. Heroku uses Amazon Web Services (AWS).

## Database setup

1. Set up four new ElephantSQL database instances - development, test, preview, and production - by following the instructions in the "PostgreSQL: Creating & Deleting Databases" checkpoint.
1. After setting up your database instances, connect DBeaver to your new database instances by following the instructions in the "PostgreSQL: Installing DBeaver" checkpoint.

### Knex

Run `npx knex` commands from within the `back-end` folder, which is where the `knexfile.js` file is located.

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

If you have trouble getting the server to run, reach out for assistance.

## Running tests

This project has unit, integration, and end-to-end (e2e) tests. You have seen unit and integration tests in previous projects.
End-to-end tests use browser automation to interact with the application just like the user does.
Once the tests are passing for a given user story, you have implemented the necessary functionality.

Test are split up by user story. You can run the tests for a given user story by running:

`npm run test:X` where `X` is the user story number.

Have a look at the following examples:

- `npm run test:1` runs all the tests for user story 1 (both frontend and backend).
- `npm run test:3:backend` runs only the backend tests for user story 3.
- `npm run test:3:frontend` runs only the frontend tests for user story 3.

Whenever possible, frontend tests will run before backend tests to help you follow outside-in development.

> **Note** When running `npm run test:X` If the frontend tests fail, the tests will stop before running the backend tests. Remember, you can always run `npm run test:X:backend` or `npm run test:X:frontend` to target a specific part of the application.

Since tests take time to run, you might want to consider running only the tests for the user story you're working on at any given time.

Once you have all user stories complete, you can run all the tests using the following commands:

- `npm test` runs _all_ tests.
- `npm run test:backend` runs _all_ backend tests.
- `npm run test:frontend` runs _all_ frontend tests.
- `npm run test:e2e` runs only the end-to-end tests.

If you would like a reminder of which npm scripts are available, run `npm run` to see a list of available commands.

Note that the logging level for the backend is set to `warn` when running tests and `info` otherwise.

> **Note**: After running `npm test`, `npm run test:X`, or `npm run test:e2e` you might see something like the following in the output: `[start:frontend] Assertion failed:`. This is not a failure, it is just the frontend project getting shutdown automatically.

> **Note**: If you are getting a `unable to resolve dependency tree` error when running the frontend tests, run the following command: `npm install --force --prefix front-end`. This will allow you to run the frontend tests.

> **Hint**: If you stop the tests before they finish, it can leave the test database in an unusual state causing the tests to fail unexpectedly the next time you run them. If this happens, delete all tables in the test database, including the `knex_*` tables, and try the tests again.

### Frontend test timeout failure

Running the frontend tests on a resource constrained computer may result in timeout failures.

If you believe your implementation is correct, but needs a bit more time to finish, you can update the `testTimeout` value in `front-end/e2e/jest.config.js`. A value of 10000 or even 12000 will give each test a few more seconds to complete.

#### Screenshots

To help you better understand what might be happening during the end-to-end tests, screenshots are taken at various points in the test.

The screenshots are saved in `front-end/.screenshots` and you can review them after running the end-to-end tests.

You can use the screenshots to debug your code by rendering additional information on the screen.

## Existing API

Below is a list of each API currently used with screenshots. Each API takes an abort controller as it's signal.

### createReservation

The createReservation(newRes, signal) API takes information for a new Reservation as newRes. It then sends a POST request to the back-end to add the reservation to the reservation database. Finally it redirects the user to the dashboard listing the current reservations for the new reservation date:

### listOne

The listOne(params, signal) API takes a reservation_id as params then sends a GET request to the back-end to retrieve the specific reservation. This is used mainly for seating a single reservation:

### listReservations

The listReservations(params, signal) API takes a date as params then sends a GET request to the back-end to retrieve every reservation on that date organized by time. This is used mainly for the dashboard:

### searchRes

The searchRes(mobile_number, signal) API takes a series of numbers as mobile_number then sends a GET request to the back-end to retrieve every reservation who's mobile phone number includes the numbers used for mobile_number. Those reservations are then organized by date and time. This is mainly used for the search function:

### editRes

The editRes(editRes, signal) API takes information for an updated Reservation as editRes. It then sends a PUT request to the back-end in order to update the same reservation with the new data in the database. It then returns the user to the previous page:

### updateRes

The updateRes(reservation_id, status, signal) API takes a reservation id and a new status as its parameters then it sends a PUT request to the back-end in order to update the reservation matching the id with the new status. These statuses can be updated from booked to cancelled, seated, or after seated, finished:

### createTable

The createTable(newTab, signal) API takes information for a new table as newTab. It then sends a POST request to the back-end to add the table to the database. Finally it redirect the user to the dashboard listing all tables:

### listTables

The listTables(signal) API sends a GET request to the back-end in order to return a complete list of tables in the database organized by name. This is used for the dashboard:

### updateTable

The updateTable(table_id, reservation_id, signal) API takes a table id and reservation id as it's parameters. It then sends a PUT request to the back-end to update the table with the reservation id of the reservation seated:

### removeTable

The removeTable(table_id, signal) API takes a table id as its parameter. It then sends a DELETE request to the back-end that deletes the reservation id listed for the table to allow for another reservation to be seated there:
