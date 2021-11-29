import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { listTables, searchRes, updateRes } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Search({ tables, setTables }) {
  const history = useHistory();
  const [phoneSearch, setPhoneSearch] = useState({ mobile_phone: "" });
  const [firstSearch, setFirstSeach] = useState(true);
  const [matchSearch, setMatchSearch] = useState(null);
  const [currentError, setCurrentError] = useState(null);

  const changeHandler = (event) => {
    setPhoneSearch({ mobile_phone: event.target.value });
  };

  function searchReservations() {
    const abortController = new AbortController();
    setCurrentError(null);
    searchRes(phoneSearch.mobile_phone, abortController.signal)
      .then(setMatchSearch)
      .catch(setCurrentError);
    return () => abortController.abort();
  }

  useEffect(loadTable, [setTables]);

  function loadTable() {
    const abortController = new AbortController();
    setCurrentError(null);
    listTables(abortController.signal).then(setTables).catch(setCurrentError);
    return () => abortController.abort();
  }

  const find = () => {
    setFirstSeach(false);
    searchReservations();
  };

  const cancelled = (event) => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      setCurrentError(null);
      updateRes(event.target.id, "cancelled", abortController.signal)
        .then(() => listTables(abortController.signal))
        .then(setTables)
        .then(searchReservations)
        .catch(setCurrentError);
      return () => abortController.abort();
    }
  };

  const reservationsList = JSON.parse(JSON.stringify(matchSearch));

  if (reservationsList) {
    reservationsList.forEach((res) => res.mobile_number.split());
  }

  return (
    <main className="text-center">
      <h1>New Search</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Search a Reservation Phone Number Here!</h4>
      </div>
      <div className="col-1">
        <ErrorAlert className="alert alert-danger" error={currentError} />
        <label htmlFor="mobile_number">
          Search:{" "}
          <input
            name="mobile_number"
            id="mobile_number"
            type="tel"
            value={phoneSearch.mobile_phone}
            onChange={changeHandler}
            placeholder="Enter a customer's phone number"
            maxLength="10"
            minLength="10"
            required
          />
        </label>
      </div>
      <button onClick={find}>Find</button>
      {firstSearch ? null : matchSearch ? (
        Object.keys(reservationsList).length !== 0 ? (
          reservationsList.map((res, index) => {
            res.mobile_number = res.mobile_number.split("-").join("");
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
                        {res.mobile_number.slice(0, 3) +
                          "-" +
                          res.mobile_number.slice(3, 6) +
                          "-" +
                          res.mobile_number.slice(6)}
                      </td>
                      <td className="border">{res.reservation_date}</td>
                      <td className="border">{res.reservation_time}</td>
                      <td className="border">{res.status}</td>
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
                {Object.keys(tables).length !== 0 ? (
                  tables.find(
                    (tab) => tab.reservation_id === res.reservation_id
                  ) ? null : (
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
                  )
                ) : (
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
          <h3>No reservations found</h3>
        )
      ) : (
        <h3>No reservations found</h3>
      )}
    </main>
  );
}

export default Search;
