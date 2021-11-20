import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";

function Tables({ setWhichList }) {
  const history = useHistory();

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
    createTable(table, abortController.signal);
    return () => abortController.abort();
  }

  const submitHandler = (event) => {
    event.preventDefault();
    saveTable();
    setTable({ ...defaultTable });
    setWhichList("tables");
    history.push(`/dashboard`);
  };

  return (
    <main>
      <h1>New Table</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Create A New Table Here!</h4>
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
