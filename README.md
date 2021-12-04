# Periodic Tables Restaurant Reservation System

<p align="center">
<a href="https://warm-waters-56754.herokuapp.com/">Periodic Tables</a>
</p>

### The Project

This is a Responsive Web Application designed to help restaurants create and manage reservations for customers in order for them to have an organized list of each reservation on a day to day basis. This application can also manage the tables in the restaurant and the seating of reservations associated with them. Finally, the user can also search a phone number in case they need to pull up a reservation quickly or that they can't find.

This application uses a mobile first approach combined with the PostgreSQL, Express.js, React, and Node.js (PERN) stack set up as a Monorepo. I used Elephantsql for the database and Heroku for deployment. Heroku uses Amazon Web Services (AWS).

## Database setup

1. Set up four new ElephantSQL database instances - development, test, preview, and production.
1. After setting up your database instances, connect DBeaver to your new database instances.

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

## Existing API

Below is a list of each API currently used with screenshots. Each API takes an abort controller as it's signal.

### createReservation

The createReservation(newRes, signal) API takes information for a new Reservation as newRes. It then sends a POST request to the back-end to add the reservation to the reservation database. Finally it redirects the user to the dashboard listing the current reservations for the new reservation date:

<p align="center">
<img src="./back-end/api_images/createReservationAPI.png" alt="An image of the create reservation form for this API">
</p>

### listOne

The listOne(params, signal) API takes a reservation_id as params then sends a GET request to the back-end to retrieve the specific reservation. This is used mainly for seating a single reservation:

<p align="center">
<img src="./back-end/api_images/listOneAPI.png" alt="An image of the create reservation form for this API">
</p>

### listReservations

The listReservations(params, signal) API takes a date as params then sends a GET request to the back-end to retrieve every reservation on that date organized by time. This is used mainly for the dashboard:

<p align="center">
<img src="./back-end/api_images/listReservationsAPI.png" alt="An image of the create reservation form for this API">
</p>

### searchRes

The searchRes(mobile_number, signal) API takes a series of numbers as mobile_number then sends a GET request to the back-end to retrieve every reservation who's mobile phone number includes the numbers used for mobile_number. Those reservations are then organized by date and time. This is mainly used for the search function:

<p align="center">
<img src="./back-end/api_images/searchResAPI.png" alt="An image of the create reservation form for this API">
</p>

### editRes

The editRes(editRes, signal) API takes information for an updated Reservation as editRes. It then sends a PUT request to the back-end in order to update the same reservation with the new data in the database. It then returns the user to the previous page:

<p align="center">
<img src="./back-end/api_images/editResAPI.png" alt="An image of the create reservation form for this API">
</p>

### updateRes

The updateRes(reservation_id, status, signal) API takes a reservation id and a new status as its parameters then it sends a PUT request to the back-end in order to update the reservation matching the id with the new status. These statuses can be updated from booked to cancelled, seated, or after seated, finished:

<p align="center">
<img src="./back-end/api_images/updateResAPI.png" alt="An image of the create reservation form for this API">
</p>

### createTable

The createTable(newTab, signal) API takes information for a new table as newTab. It then sends a POST request to the back-end to add the table to the database. Finally it redirect the user to the dashboard listing all tables:

<p align="center">
<img src="./back-end/api_images/createTableAPI.png" alt="An image of the create reservation form for this API">
</p>

### listTables

The listTables(signal) API sends a GET request to the back-end in order to return a complete list of tables in the database organized by name. This is used for the dashboard:

<p align="center">
<img src="./back-end/api_images/listTablesAPI.png" alt="An image of the create reservation form for this API">
</p>

### updateTable

The updateTable(table_id, reservation_id, signal) API takes a table id and reservation id as it's parameters. It then sends a PUT request to the back-end to update the table with the reservation id of the reservation seated:

<p align="center">
<img src="./back-end/api_images/updateTableAPI.png" alt="An image of the create reservation form for this API">
</p>

### removeTable

The removeTable(table_id, signal) API takes a table id as its parameter. It then sends a DELETE request to the back-end that deletes the reservation id listed for the table to allow for another reservation to be seated there:

<p align="center">
<img src="./back-end/api_images/removeTableAPI.png" alt="An image of the create reservation form for this API">
</p>
