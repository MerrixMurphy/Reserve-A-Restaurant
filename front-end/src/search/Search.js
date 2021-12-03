import { useState, useEffect } from "react";

import { listTables, searchRes } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsData from "../renderedData/ReservationsData";

function Search({ setTables }) {
  const [phoneSearch, setPhoneSearch] = useState({ mobile_phone: "" });
  const [firstSearch, setFirstSeach] = useState(true);
  const [matchSearch, setMatchSearch] = useState(null);
  const [currentError, setCurrentError] = useState(null);

  useEffect(loadTable, [setTables, setCurrentError]);

  function loadTable() {
    const abortController = new AbortController();
    setCurrentError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch((err) => setCurrentError(err));
    return () => abortController.abort();
  }

  function searchReservations() {
    const abortController = new AbortController();
    setCurrentError(null);
    searchRes(phoneSearch.mobile_phone, abortController.signal)
      .then(setMatchSearch)
      .catch((err) => setCurrentError(err));
    return () => abortController.abort();
  }

  const changeHandler = (event) => {
    setPhoneSearch({ mobile_phone: event.target.value });
  };

  const find = () => {
    setFirstSeach(false);
    searchReservations();
  };

  if (matchSearch) {
    matchSearch.forEach((res) => res.mobile_number.split());
  }

  return (
    <main className="text-center">
      <h1>New Search</h1>
      <ErrorAlert className="alert alert-danger" error={currentError} />
      <div className="d-flex justify-content-center">
        <div className="formlikediv col-1 text-center">
          <div>
            <h4 className="pb-4">Search a Reservation Phone Number Here!</h4>
            <label htmlFor="mobile_number">
              Search
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
          <button className="mt-3" onClick={find}>
            Find
          </button>
        </div>
      </div>
      {!firstSearch ? (
        matchSearch ? (
          <ReservationsData
            setCurrentError={setCurrentError}
            setTables={setTables}
            loadResults={searchReservations}
            reservationsList={matchSearch}
          />
        ) : (
          <h3>No reservations found</h3>
        )
      ) : null}
    </main>
  );
}

export default Search;
