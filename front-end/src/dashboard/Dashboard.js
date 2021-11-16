import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setSelectedDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const [year, month, day] = date.split("-");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const reservationsList = JSON.parse(JSON.stringify(reservations));
  return (
    <main className="text-center">
      <h1>Dashboard</h1>
      <div>
        <h4>
          Reservations for {monthNames[month - 1]} {day}, {year}
        </h4>
      </div>
      <div className="d-flex justify-content-center">
        <div className="mr-3">
          <button onClick={() => setSelectedDate(previous(date))}>
            Previous
          </button>
        </div>
        <div className="mr-3">
          <button onClick={() => setSelectedDate(today)}>Today</button>
        </div>
        <div className="mr-3">
          <button onClick={() => setSelectedDate(next(date))}>Next</button>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      {Object.keys(reservationsList).length !== 0 ? (
        reservationsList.map((res, index) => {
          return (
            <table key={index} className="table border mt-3 text-center">
              <thead>
                <tr>
                  <th className="border">Reservation ID</th>
                  <th className="border">Reservation Name</th>
                  <th className="border">Number for Reservation</th>
                  <th className="border">Reservation Phone Number</th>
                  <th className="border">Reservation Date</th>
                  <th className="border">Reservation Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border">{res.reservation_id}</td>
                  <td className="border">
                    {res.first_name} {res.last_name}
                  </td>
                  <td className="border">{res.people}</td>
                  <td className="border">
                    {res.mobile_number.slice(0, 3) +
                      "-" +
                      res.mobile_number.slice(3, 6) +
                      "-" +
                      res.mobile_number.slice(6)}
                  </td>
                  <td className="border">{res.reservation_date}</td>
                  <td className="border">{res.reservation_time}</td>
                </tr>
              </tbody>
            </table>
          );
        })
      ) : (
        <h3>No Reservations For This Day.</h3>
      )}
    </main>
  );
}

export default Dashboard;
