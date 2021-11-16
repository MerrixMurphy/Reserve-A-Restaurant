import React, { useState } from "react";
// useEffect,
import { useHistory } from "react-router";
import { today } from "../utils/date-time";
import { createReservation } from "../utils/api";
// import ErrorAlert from "../layout/ErrorAlert";

function Reservations({ setSelectedDate }) {
  const history = useHistory();

  const defaultReservation = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "1",
  };

  const [reservation, setReservation] = useState({ ...defaultReservation });
  // const [reservationsError, setReservationsError] = useState(null);

  const changeHandler = ({ target }) => {
    setReservation({
      ...reservation,
      [target.name]: target.value,
    });
  };

  // useEffect(() => {
  //   saveReservation()
  // }, [reservationsError]);

  function saveReservation() {
    const abortController = new AbortController();
    // setReservationsError(null);
    createReservation(reservation, abortController.signal);
    // .catch(
    //   setReservationsError
    // );
    // console.log(reservationsError);
    return () => abortController.abort();
  }

  const submitHandler = (event) => {
    event.preventDefault();
    setReservation({ ...defaultReservation });
    setSelectedDate(reservation.reservation_date);
    saveReservation();
    // console.log(reservationsError);
    // if (reservationsError === null) {
    history.push(`/dashboard?date=${reservation.reservation_date}`);
    // }
  };
  const [year, month, day] = today().split("-");
  const maxDate = `${Number(year) + 50}-${month}-${day}`;

  return (
    <main>
      <h1>New Reservation</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Create A New Reservation Here!</h4>
      </div>
      <form onSubmit={submitHandler}>
        <div className="col-1">
          <label htmlFor="first_name">
            First name:{" "}
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
            Last name:{" "}
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
            Mobile number:{" "}
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
            Date of reservation:{" "}
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
            Time of reservation:{" "}
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
            Number of people in the party:{" "}
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
        <button type="submit">Submit</button>
        <button onClick={() => history.goBack()}>Cancel</button>
      </form>
      {/* <ErrorAlert error={reservationsError} /> */}
    </main>
  );
}

export default Reservations;
