import React, { useEffect, useState } from "react";
import {
  listReservations,
  listTables,
  removeTable,
  updateRes,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import { useHistory } from "react-router";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  date,
  setSelectedDate,
  whichList,
  setWhichList,
  tables,
  setTables,
  reservations,
  setReservations,
}) {
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);

  //load list of reservations on date change
  useEffect(loadDashboard, [date, setReservations]);

  // load list of tables on load.
  useEffect(loadTable, [setTables]);

  // load reservations
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // load tables
  function loadTable() {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables);
    return () => abortController.abort();
  }

  // Finish Seating
  const finish = (event) => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      removeTable(event.target.id, abortController.signal)
        .then(() => listTables(abortController.signal))
        .then(setTables);
      return () => abortController.abort();
    }
  };

  const cancelled = (event) => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      updateRes(event.target.id, abortController.signal)
        .then(() => listTables(abortController.signal))
        .then(setTables)
        .then(loadDashboard);
      return () => abortController.abort();
    }
  };

  // Display currently selected month, day, and year
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

  return (
    <main className="text-center">
      <h1>Dashboard</h1>
      <div className="text-center">
        <button onClick={() => setWhichList("reservations")}>
          Reservations
        </button>
        <button onClick={() => setWhichList("tables")}>Tables</button>
      </div>
      {whichList === "reservations" ? (
        <div>
          <div>
            <h4>Reservations for:</h4>
            <h4>
              {monthNames[month - 1]} {day}, {year}
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
          {Object.keys(reservations).length !== 0 ? (
            reservations.map((res, index) => {
              return (
                <div key={index}>
                  <table className="table border mt-3 text-center">
                    <thead>
                      <tr>
                        <th className="border">Reservation ID</th>
                        <th className="border">Reservation Name</th>
                        <th className="border">Reservation Headcount</th>
                        <th className="border">Reservation Phone Number</th>
                        <th className="border">Reservation Date</th>
                        <th className="border">Reservation Time</th>
                        <th className="border">Reservation Status</th>
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
                          {res.mobile_number.includes("-")
                            ? res.mobile_number
                            : res.mobile_number.slice(0, 3) +
                              "-" +
                              res.mobile_number.slice(3, 6) +
                              "-" +
                              res.mobile_number.slice(6)}
                        </td>
                        <td className="border">{res.reservation_date}</td>
                        <td className="border">{res.reservation_time}</td>
                        <td data-reservation-id-status={res.reservation_id}>
                          {res.status}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <button
                    className="w-25 mr-2"
                    href={`/reservations/${res.reservation_id}/edit`}
                    disabled={res.status === "booked" ? false : true}
                    onClick={() =>
                      history.push(`/reservations/${res.reservation_id}/edit`)
                    }
                  >
                    Edit
                  </button>
                  {res.status !== "booked" ? null : (
                    <button
                      className="w-25 ml-2 mr-2"
                      disabled={res.status === "booked" ? false : true}
                      href={`/reservations/${res.reservation_id}/seat`}
                      onClick={() =>
                        history.push(`/reservations/${res.reservation_id}/seat`)
                      }
                    >
                      SEAT
                    </button>
                  )}
                  <button
                    id={res.reservation_id}
                    className="w-25 ml-2"
                    disabled={res.status === "booked" ? false : true}
                    data-reservation-id-cancel={res.reservation_id}
                    onClick={cancelled}
                  >
                    Cancel
                  </button>
                </div>
              );
            })
          ) : (
            <h3>No Reservations For This Day.</h3>
          )}
        </div>
      ) : (
        <div>
          <div>
            <h4>Tables:</h4>
          </div>
          {Object.keys(tables).length !== 0 ? (
            tables.map((tab, index) => {
              return (
                <div key={index}>
                  <table className="table border mt-3 text-center">
                    <thead>
                      <tr>
                        <th className="border">Table Name</th>
                        <th className="border">Table Capacity</th>
                        <th className="border">Table Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border">{tab.table_name}</td>
                        <td className="border">{tab.capacity}</td>
                        <td
                          className="border"
                          data-table-id-status={tab.table_id}
                        >
                          {tab.reservation_id ? "Occupied" : "Free"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <button
                    data-table-id-finish={tab.table_id}
                    id={tab.table_id}
                    onClick={finish}
                    disabled={tab.reservation_id ? false : true}
                    className="w-25"
                  >
                    Finish
                  </button>
                </div>
              );
            })
          ) : (
            <h3>No Tables Listed.</h3>
          )}
        </div>
      )}
    </main>
  );
}

export default Dashboard;
