import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import TablesForm from "../forms/TablesForm";

function Tables({ setWhichList, setTables }) {
  const defaultTable = {
    table_name: "",
    capacity: 1,
  };

  const [table, setTable] = useState({ ...defaultTable });
  const [currentError, setCurrentError] = useState(null);

  return (
    <main>
      <h1>New Table</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Create A New Table Here!</h4>
        <ErrorAlert className="alert alert-danger" error={currentError} />
      </div>
      <TablesForm
        setWhichList={setWhichList}
        setTables={setTables}
        setCurrentError={setCurrentError}
        setTable={setTable}
        table={table}
        defaultTable={defaultTable}
      />
    </main>
  );
}

export default Tables;
