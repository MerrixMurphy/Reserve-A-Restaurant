import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import { listOne, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import SeatForm from "../forms/SeatForm";

function Seat({ setReservations, selectedDate }) {
  const params = useParams();

  const [seat, setSeat] = useState([]);
  const [tables, setTables] = useState([]);
  const [firstTable, setFirstTable] = useState();
  const [currentTable, setCurrentTable] = useState();
  const [currentError, setCurrentError] = useState(null);

  function loadSeat() {
    const abortController = new AbortController();
    setCurrentError(null);
    listOne(params.reservation_id, abortController.signal)
      .then(setSeat)
      .catch(setCurrentError);
    return () => abortController.abort();
  }

  function loadTable() {
    const abortController = new AbortController();
    setCurrentError(null);
    listTables(abortController.signal).then(setTables).catch(setCurrentError);
    return () => abortController.abort();
  }

  function loadFirst() {
    if (seat.people) {
      const firstTab = tables.find(
        (tab) => tab.capacity >= seat.people && tab.reservation_id === null
      );
      firstTab ? setFirstTable(firstTab) : setFirstTable(null);
    }
  }

  useEffect(loadSeat, [params.reservation_id, setCurrentError]);
  useEffect(loadTable, [setCurrentError]);
  useEffect(loadFirst, [tables, seat.people]);

  return (
    <main>
      <h1 className="py-4">Seat Table Here</h1>
      <ErrorAlert className="alert alert-danger" error={currentError} />
      <SeatForm
        setReservations={setReservations}
        selectedDate={selectedDate}
        setCurrentError={setCurrentError}
        firstTable={firstTable}
        currentTable={currentTable}
        setCurrentTable={setCurrentTable}
        seat={seat}
        tables={tables}
      />
    </main>
  );
}

export default Seat;
