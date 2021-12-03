import { listTables, removeTable } from "../utils/api";

function TablesData({ setCurrentError, setTables, tables }) {
  const finish = (event) => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      setCurrentError(null);
      removeTable(event.target.id, abortController.signal)
        .then(() => listTables(abortController.signal))
        .then(setTables)
        .catch((err) => setCurrentError(err));
      return () => abortController.abort();
    }
  };

  return Object.keys(tables).length !== 0 ? (
    tables.map((tab, index) => {
      return (
        <div key={index} className="container">
          <table className="table border mt-3 text-center">
            <thead>
              <tr>
                <th className="border">Table Name</th>
                <th className="border">Table Capacity</th>
                <th className="border">Table Status</th>
              </tr>
            </thead>
            <tbody
              className={tab.reservation_id ? "table-danger" : "table-success"}
            >
              <tr>
                <td className="border">{tab.table_name}</td>
                <td className="border">{tab.capacity}</td>
                <td className="border" data-table-id-status={tab.table_id}>
                  {tab.reservation_id ? "Occupied" : "Free"}
                </td>
              </tr>
            </tbody>
          </table>
          <button
            data-table-id-finish={tab.table_id}
            id={tab.table_id}
            onClick={finish}
            disabled={tab.reservation_id ? false : true}
            className="w-25 bg-danger"
          >
            Finish
          </button>
        </div>
      );
    })
  ) : (
    <h3>No Tables Listed.</h3>
  );
}

export default TablesData;
