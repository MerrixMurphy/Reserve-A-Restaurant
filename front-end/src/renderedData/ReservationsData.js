import { useHistory } from "react-router";
import { listTables, updateRes } from "../utils/api";

function ReservationsData({
  setCurrentError,
  setTables,
  loadResults,
  reservationsList,
}) {
  const history = useHistory();

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
        .then(() => loadResults())
        .catch((err) => setCurrentError(err));
      return () => abortController.abort();
    }
  };

  return Object.keys(reservationsList).length !== 0 ? (
    reservationsList.map((res, index) => {
      return (
        <div key={index} className="container">
          <table className="table border mt-3">
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
            <tbody
              className={
                res.status === "booked"
                  ? "table-success"
                  : res.status === "seated"
                  ? "table-warning"
                  : "table-danger"
              }
            >
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
                <td
                  className="border"
                  data-reservation-id-status={res.reservation_id}
                >
                  {res.status}
                </td>
              </tr>
            </tbody>
          </table>
          <button
            className="w-25 mr-2 bg-primary"
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
              className="w-25 ml-2 mr-2 bg-success"
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
            className="w-25 ml-2 bg-danger"
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
  );
}

export default ReservationsData;
