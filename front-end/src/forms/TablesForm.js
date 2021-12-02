import { useHistory } from "react-router";
import { createTable, listTables } from "../utils/api";

function TablesForm({
  setWhichList,
  setTables,
  setCurrentError,
  table,
  setTable,
  defaultTable,
}) {
  const history = useHistory();

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
    createTable(table, abortController.signal)
      .then(() => history.push(`/dashboard`))
      .catch((err) => setCurrentError(err));
    return () => abortController.abort();
  }

  const submitHandler = (event) => {
    event.preventDefault();
    setTable({ ...defaultTable });
    setWhichList("tables");
    const abortController = new AbortController();
    setCurrentError(null);
    saveTable();
    listTables(abortController.signal)
      .then(setTables)
      .catch((err) => setCurrentError(err));
    return () => abortController.abort();
  };

  return (
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
  );
}

export default TablesForm;
