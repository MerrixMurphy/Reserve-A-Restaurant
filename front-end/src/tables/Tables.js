import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Tables({ setWhichList, setTables }) {
  const history = useHistory();
  const [currentError, setCurrentError] = useState(null);

  const defaultTable = {
    table_name: "",
    capacity: 1,
  };

  const [table, setTable] = useState({ ...defaultTable });

  const changeHandler = ({ target }) => {
    if (Number(target.value)) {
      setTable({
        ...table,
        [target.name]: Number(target.value),
      });
    } else {
      setTable({
        ...table,
        [target.name]: target.value,
      });
    }
  };

  function saveTable() {
    const abortController = new AbortController();
    setCurrentError(null);
    createTable(table, abortController.signal).catch(setCurrentError);
    return () => abortController.abort();
  }

  const submitHandler = (event) => {
    event.preventDefault();
    saveTable();
    setTable({ ...defaultTable });
    setWhichList("tables");
    const abortController = new AbortController();
    setCurrentError(null);
    listTables(abortController.signal).then(setTables).catch(setCurrentError);
    if (currentError === null) {
      history.push(`/dashboard`);
    }
    return () => abortController.abort();
  };

  return (
    <main>
      <h1>New Table</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Create A New Table Here!</h4>
        <ErrorAlert className="alert alert-danger" error={currentError} />
      </div>
      <form onSubmit={submitHandler}>
        <div className="col-1">
          <label htmlFor="table_name">
            Table name:{" "}
            <input
              name="table_name"
              id="table_name"
              type="text"
              placeholder="Table Name"
              onChange={changeHandler}
              value={table.table_name}
              pattern="[a-zA-Z\s]+"
              minLength="2"
              required
            />
          </label>
          <label htmlFor="capacity">
            Max Capacity for Table:{" "}
            <input
              name="capacity"
              id="capacity"
              type="number"
              min="1"
              onChange={changeHandler}
              value={table.capacity}
              required
            />
          </label>
        </div>
        <button type="submit">Submit</button>
        <button onClick={() => history.goBack()}>Cancel</button>
      </form>
    </main>
  );
}

export default Tables;
