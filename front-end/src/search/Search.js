import { useState } from "react";
import { listReservations } from "../utils/api";

function Search() {
  const [phoneSearch, setPhoneSearch] = useState({ mobile_phone: "" });
  const [firstSearch, setFirstSeach] = useState(true);
  const [matchSearch, setMatchSearch] = useState(null);

  const changeHandler = (event) => {
    setPhoneSearch({ mobile_phone: event.target.value });
  };

  function searchReservations() {
    const abortController = new AbortController();
    console.log(phoneSearch);
    listReservations(phoneSearch, abortController.signal).then(setMatchSearch);
    return () => abortController.abort();
  }

  const find = () => {
    setFirstSeach(false);
    searchReservations();
  };

  const reservationsList = JSON.parse(JSON.stringify(matchSearch));

  return (
    <main>
      <h1>New Search</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Search a Reservation Phone Number Here!</h4>
      </div>
      <div className="col-1">
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
            return (
              <div>
                <table key={index} className="table border mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="border">Reservation ID</th>
                      <th className="border">Reservation Name</th>
                      <th className="border">Reservation Headcount</th>
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
