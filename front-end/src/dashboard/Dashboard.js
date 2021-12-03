import React, { useState, useEffect } from "react";

import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import TablesData from "../renderedData/TablesData";
import ReservationsData from "../renderedData/ReservationsData";

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
  const [currentError, setCurrentError] = useState(null);

  function loadDashboard() {
    const abortController = new AbortController();
    setCurrentError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch((err) => setCurrentError(err));
    return () => abortController.abort();
  }

  function loadTable() {
    const abortController = new AbortController();
    setCurrentError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch((err) => setCurrentError(err));
    return () => abortController.abort();
  }

  useEffect(loadDashboard, [date, setReservations, setCurrentError]);
  useEffect(loadTable, [setTables, setCurrentError]);

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
    <main className="text-center ">
      <h1 className="clearmargin">Dashboard</h1>
      <div className="text-center">
        <button
          className="custbutton"
          onClick={() => setWhichList("reservations")}
        >
          Reservations
        </button>
        <button className="custbutton" onClick={() => setWhichList("tables")}>
          Tables
        </button>
      </div>
      {whichList === "reservations" ? (
        <div>
          <div>
            <h4 className="pt-2">Reservations for</h4>
            <h4 className="pb-2">
              {monthNames[month - 1]} {day}, {year}
            </h4>
          </div>
          <div>
            <button
              className="smcustbutton"
              onClick={() => setSelectedDate(previous(date))}
            >
              Previous
            </button>
            <button
              className="smcustbutton"
              onClick={() => setSelectedDate(today)}
            >
              Today
            </button>
            <button
              className="smcustbutton"
              onClick={() => setSelectedDate(next(date))}
            >
              Next
            </button>
          </div>
          <ErrorAlert className="alert alert-danger" error={currentError} />
          <ReservationsData
            setCurrentError={setCurrentError}
            setTables={setTables}
            loadResults={loadDashboard}
            reservationsList={reservations}
          />
        </div>
      ) : (
        <div>
          <div>
            <h4 className="py-2">Tables</h4>
          </div>
          <ErrorAlert className="alert alert-danger" error={currentError} />
          <TablesData
            setCurrentError={setCurrentError}
            setTables={setTables}
            tables={tables}
          />
        </div>
      )}
    </main>
  );
}

export default Dashboard;
