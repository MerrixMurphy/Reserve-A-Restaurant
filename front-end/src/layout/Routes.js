import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import { today } from "../utils/date-time";
import Dashboard from "../dashboard/Dashboard";
import Tables from "../tables/Tables";
import Reservations from "../reservations/Reservations";
import Seat from "../seat/Seat";
import Search from "../search/Search";
import NotFound from "./NotFound";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const url = useLocation().pathname;
  let specificDate = query.get("date");

  const [selectedDate, setSelectedDate] = useState(today());
  const [whichList, setWhichList] = useState("reservations");
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (specificDate) {
      setSelectedDate(specificDate);
    }
  }, [specificDate]);

  useEffect(() => {
    if (url.includes("/dashboard")) {
      if (selectedDate !== today()) {
        history.push(`/dashboard?date=${selectedDate}`);
      } else {
        history.push("/dashboard");
      }
    }
  }, [selectedDate, history, url]);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <Reservations
          setWhichList={setWhichList}
          setReservations={setReservations}
          selectedDate={selectedDate}
        />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <Reservations
          setWhichList={setWhichList}
          setReservations={setReservations}
          selectedDate={selectedDate}
        />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <Seat setReservations={setReservations} selectedDate={selectedDate} />
      </Route>
      <Route exact={true} path="/tables/new">
        <Tables setWhichList={setWhichList} setTables={setTables} />
      </Route>
      <Route path="/search">
        <Search setTables={setTables} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={selectedDate}
          setSelectedDate={setSelectedDate}
          whichList={whichList}
          setWhichList={setWhichList}
          tables={tables}
          setTables={setTables}
          reservations={reservations}
          setReservations={setReservations}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
