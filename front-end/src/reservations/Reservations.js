import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import {
  createReservation,
  listOne,
  editRes,
  listReservations,
} from "../utils/api";

function Reservations({ setWhichList, setReservations, selectedDate }) {
  const history = useHistory();
  const params = useParams();
  const [year, month, day] = today().split("-");
  const maxDate = `${Number(year) + 50}-${month}-${day}`;

  const defaultReservation = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "1",
  };
  const [reservation, setReservation] = useState({ ...defaultReservation });
  const [currentError, setCurrentError] = useState(null);

  useEffect(editReservation, [params]);

  function listRes() {
    const abortController = new AbortController();
    listReservations(selectedDate, abortController.signal)
      .then(setReservations)
      .catch((err) => setCurrentError(err));
    return () => abortController.abort();
  }

  function editReservation() {
    if (params.reservation_id) {
      const abortController = new AbortController();
      listOne(params.reservation_id, abortController.signal)
        .then(setReservation)
        .catch((err) => setCurrentError(err));
      return () => abortController.abort();
    }
  }

  const changeHandler = ({ target }) => {
    setReservation({
      ...reservation,
      [target.name]: target.value,
    });
  };

  function saveReservation() {
    const abortController = new AbortController();
    reservation.people = Number(reservation.people);
    if (params.reservation_id) {
      editRes(reservation, abortController.signal)
        .then(() =>
          history.push(`/dashboard?date=${reservation.reservation_date}`)
        )
        .catch((err) => {
          setCurrentError(err);
          editReservation();
        });
      listRes();
    } else {
      createReservation(reservation, abortController.signal)
        .then(() => history.goBack())
        .catch((err) => setCurrentError(err));
    }
    return () => abortController.abort();
  }

  const submitHandler = (event) => {
    event.preventDefault();
    setWhichList("reservations");
    setReservation({ ...defaultReservation });
    saveReservation();
  };

  return (
    <main>
      {!params.reservation_id ? (
        <h1>New Reservation</h1>
      ) : (
        <h1>Edit Reservation</h1>
      )}
      <ErrorAlert className="alert alert-danger" error={currentError} />
      <div className="d-flex justify-content-center">
        <form className="col-1 text-center" onSubmit={submitHandler}>
          <div>
            {!params.reservation_id ? (
              <h4 className="pb-4">Create A New Reservation Here!</h4>
            ) : (
              <h4 className="pb-4">Edit A Reservation Here!</h4>
            )}
            <label htmlFor="first_name">
              First name
              <input
                name="first_name"
                id="first_name"
                type="text"
                placeholder="First Name"
                onChange={changeHandler}
                value={reservation.first_name}
                pattern="[a-zA-Z]+"
                required
              />
            </label>
            <label htmlFor="last_name">
              Last name
              <input
                name="last_name"
                id="last_name"
                type="text"
                placeholder="Last Name"
                onChange={changeHandler}
                value={reservation.last_name}
                pattern="[a-zA-Z]+"
                required
              />
            </label>
            <label htmlFor="mobile_number">
              Mobile number
              <input
                name="mobile_number"
                id="mobile_number"
                type="tel"
                placeholder="888-888-8888"
                onChange={changeHandler}
                value={reservation.mobile_number}
                maxLength="10"
                minLength="10"
                required
              />
            </label>
            <label htmlFor="reservation_date">
              Date of reservation
              <input
                name="reservation_date"
                id="reservation_date"
                type="date"
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                onChange={changeHandler}
                value={reservation.reservation_date}
                max={maxDate}
                required
              />
            </label>
            <label htmlFor="reservation_time">
              Time of reservation
              <input
                name="reservation_time"
                id="reservation_time"
                type="time"
                placeholder="HH:MM"
                pattern="[0-9]{2}:[0-9]{2}"
                onChange={changeHandler}
                value={reservation.reservation_time}
                required
              />
            </label>
            <label htmlFor="people">
              Number of people in the party
              <input
                name="people"
                id="people"
                type="number"
                min="1"
                onChange={changeHandler}
                value={reservation.people}
                required
              />
            </label>
          </div>
          <button className="mr-2 mt-3" type="submit">
            Submit
          </button>
          <button
            className="ml-2"
            type="button"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
}

export default Reservations;
