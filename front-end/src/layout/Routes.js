import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Reservations from "../reservations/Reservations";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  const [selectedDate, setSelectedDate] = useState(today());
  const query = new URLSearchParams(useLocation().search);
  const specificDate = query.get("date");

  useEffect(() => {
    if (specificDate) {
      setSelectedDate(specificDate);
    }
  }, [specificDate]);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations">
        <Reservations setSelectedDate={setSelectedDate} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={selectedDate} setSelectedDate={setSelectedDate} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
