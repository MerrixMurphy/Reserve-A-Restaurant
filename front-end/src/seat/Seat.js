import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { updateTable, listOne, listTables } from "../utils/api";

function Seat() {
  const history = useHistory();
  const params = useParams();

  const [seat, setSeat] = useState([]);
  const [tables, setTables] = useState([]);
  const [firstTable, setFirstTable] = useState();
  const [currentTable, setCurrentTable] = useState();

  useEffect(loadSeat, [params.reservation_id]);

  useEffect(loadTable, []);

  useEffect(() => setFirstTable(tables[0]), [tables]);

  function loadSeat() {
    const abortController = new AbortController();
    listOne(params.reservation_id, abortController.signal).then(setSeat);
    return () => abortController.abort();
  }

  function loadTable() {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables);
    return () => abortController.abort();
  }

  function updateTab() {
    const abortController = new AbortController();
    if (currentTable) {
      updateTable(
        currentTable.table_id,
        seat.reservation_id,
        abortController.signal
      );
    } else {
      updateTable(
        firstTable.table_id,
        seat.reservation_id,
        abortController.signal
      );
    }
    return () => abortController.abort();
  }

  const changeHandler = (event) => {
    setCurrentTable(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    updateTab();
    history.push(`/dashboard`);
  };

  return (
    <main>
      <h1>Seat Table Here:</h1>
      <form onSubmit={submitHandler}>
        {Object.keys(seat).length !== 0 ? (
          <div>
            <table
              key={seat.reservation_id}
              className="table border mt-3 text-center"
            >
              <thead>
                <tr>
                  <th className="border">Reservation ID</th>
                  <th className="border">Reservation Name</th>
                  <th className="border">Reservation Headcount</th>
                  <th className="border">Reservation Phone Number</th>
                  <th className="border">Reservation Date</th>
                  <th className="border">Reservation Time</th>
                  <th className="border">Table number</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border">{seat.reservation_id}</td>
                  <td className="border">
                    {seat.first_name} {seat.last_name}
                  </td>
                  <td className="border">{seat.people}</td>
                  <td className="border">
                    {seat.mobile_number.includes("-")
                      ? seat.mobile_number
                      : seat.mobile_number.slice(0, 3) +
                        "-" +
                        seat.mobile_number.slice(3, 6) +
                        "-" +
                        seat.mobile_number.slice(6)}
                  </td>
                  <td className="border">
                    {seat.reservation_date.slice(0, 10)}
                  </td>
                  <td className="border">{seat.reservation_time}</td>
                  <td className="border">
                    <label htmlFor="table_id">
                      <select
                        name="table_id"
                        id="table_id"
                        onChange={changeHandler}
                      >
                        {Object.keys(tables).length !== 0 ? (
                          tables.map((tab) => {
                            if (
                              tab.capacity >= seat.people &&
                              tab.reservation_id === null
                            ) {
                              return (
                                <option value={tab.table_id}>
                                  {tab.table_name} - {tab.capacity}
                                </option>
                              );
                            } else {
                              return null;
                            }
                          })
                        ) : (
                          <h3>No Tables Listed.</h3>
                        )}
                      </select>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <h3>No Seating.</h3>
        )}
        <button type="submit">Submit</button>
        <button onClick={() => history.goBack()}>Cancel</button>
      </form>
    </main>
  );
}

export default Seat;
