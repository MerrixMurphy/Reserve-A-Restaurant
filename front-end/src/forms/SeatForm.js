import { useHistory } from "react-router";
import { updateTable, listReservations } from "../utils/api";

function SeatForm({
  setReservations,
  selectedDate,
  setCurrentError,
  currentTable,
  setCurrentTable,
  firstTable,
  seat,
  tables,
}) {
  const history = useHistory();

  function listRes() {
    const abortController = new AbortController();
    setCurrentError(null);
    listReservations(selectedDate, abortController.signal)
      .then(setReservations)
      .catch((err) => setCurrentError(err));
    return () => abortController.abort();
  }

  function updateTab() {
    const abortController = new AbortController();
    setCurrentError(null);
    if (currentTable) {
      updateTable(currentTable, seat.reservation_id, abortController.signal)
        .then(() => history.push("/dashboard"))
        .catch((err) => setCurrentError(err));
    } else {
      updateTable(
        firstTable.table_id,
        seat.reservation_id,
        abortController.signal
      )
        .then(() => history.push("/dashboard"))
        .catch((err) => setCurrentError(err));
    }
    return () => abortController.abort();
  }
  const changeHandler = (event) => {
    setCurrentTable(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    updateTab();
    listRes();
  };

  return (
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
              <tr
                className={
                  seat.status === "booked"
                    ? "bg-success"
                    : seat.status === "seated"
                    ? "bg-warning"
                    : "bg-danger"
                }
              >
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
                <td className="border">{seat.reservation_date}</td>
                <td className="border">{seat.reservation_time}</td>
                <td className="border">
                  {firstTable ? (
                    <label htmlFor="table_id">
                      <select
                        name="table_id"
                        id="table_id"
                        onChange={changeHandler}
                      >
                        {Object.keys(tables).length !== 0
                          ? tables.map((tab, index) => {
                              if (
                                tab.capacity >= seat.people &&
                                tab.reservation_id === null
                              ) {
                                return (
                                  <option key={index} value={tab.table_id}>
                                    {tab.table_name} - {tab.capacity}
                                  </option>
                                );
                              } else {
                                return null;
                              }
                            })
                          : null}
                      </select>
                    </label>
                  ) : (
                    "No Tables Listed."
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <h3>No Seating.</h3>
      )}
      <button type="submit">Submit</button>
      <button type="button" onClick={() => history.goBack()}>
        Cancel
      </button>
    </form>
  );
}

export default SeatForm;
