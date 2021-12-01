const tableService = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {
  beforeCreate,
  beforeDestroy,
  beforeUpdate,
} = require("../validation/controllerValidations");

async function list(req, res) {
  const data = await tableService.list();
  res.json({ data });
}

async function create(req, res) {
  const data = req.body.data;
  await tableService.create(data);
  res.status(201).json({ data });
}

function toUpdate(req, res) {
  reservationService.update(
    res.locals.reservationData.reservation_id,
    "seated"
  );
  tableService.update(
    res.locals.tableData.table_id,
    res.locals.reservationData.reservation_id
  );
  res
    .status(200)
    .json({ data: { reservation_id: res.locals.fieldValTab.reservation_id } });
}

function destroy(req, res) {
  reservationService.update(res.locals.table.reservation_id, "finished");
  const data = tableService.update(res.locals.params, null);
  res.status(200).json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [beforeCreate, asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(beforeUpdate), toUpdate],
  delete: [asyncErrorBoundary(beforeDestroy), destroy],
};
