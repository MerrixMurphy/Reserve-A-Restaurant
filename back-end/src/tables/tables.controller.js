const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { as } = require("../db/connection");

function allFields(req, res, next) {
  if (!req.body.data) {
    next({
      status: 400,
      message: "No data present in request.",
    });
  }

  let error = "";

  const { table_name, capacity } = req.body.data;

  const toCompare = ["table_name", "capacity"];

  switch (true) {
    case capacity === 0:
      error = "capacity";
      next({
        status: 400,
        message: `Error: No valid ${error} in the request.`,
      });
    case !capacity || !table_name:
      error = toCompare.filter((compare) => {
        const checkData = Object.keys(req.body.data);
        for (var each in req.body.data) {
          if (req.body.data[each] === "") {
            return each;
          }
        }
        return !checkData.includes(compare);
      });
      next({
        status: 400,
        message: `Error: No valid ${error} in the request.`,
      });
    case table_name.length <= 1:
      error = "table_name";
      next({
        status: 400,
        message: `Error: No valid ${error} in the request.`,
      });
    case typeof capacity != "number":
      error = "capacity";
      next({
        status: 400,
        message: `Error: No valid ${error} in the request.`,
      });
    default:
      res.locals.table_name = table_name;
      res.locals.capacity = capacity;
      return next();
  }
}

async function beforeUpdate(req, res, next) {
  if (!req.body.data || !req.body.data.reservation_id) {
    next({
      status: 400,
      message:
        "No valid data present in request. Please include valid reservation_id.",
    });
  }

  const reservationData = await reservationService.read(
    req.body.data.reservation_id
  );
  res.locals.reservationData = reservationData;

  const tableData = await service.read(Number(req.params.table_id));
  res.locals.tableData = tableData;

  let error = "";

  if (!reservationData) {
    error = req.body.data.reservation_id;
    next({
      status: 404,
      message: `Error: Reservation ID - ${error} does not exist.`,
    });
  }

  if (reservationData.status === "seated") {
    next({
      status: 400,
      message: `Error: Reservation is currently seated.`,
    });
  }

  if (tableData.capacity < reservationData.people) {
    error = "capacity";
    next({
      status: 400,
      message: `Error: No valid ${error} in the request.`,
    });
  }

  if (tableData.reservation_id) {
    return next({
      status: 400,
      message: `Error: Table is currently occupied.`,
    });
  }

  return next();
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function create(req, res) {
  const data = req.body.data;
  await service.create(data);
  res.status(201).json({ data });
}

async function toUpdate(req, res) {
  await reservationService.update(
    res.locals.reservationData.reservation_id,
    "seated"
  );
  await service.update(
    res.locals.tableData.table_id,
    res.locals.reservationData.reservation_id
  );
  res
    .status(200)
    .json({ data: { reservation_id: req.body.data.reservation_id } });
}

async function beforeDestroy(req, res, next) {
  const params = req.params.table_id;
  res.locals.params = params;
  const table = await service.read(params);
  if (table) {
    res.locals.table = table;
  } else {
    next({
      status: 404,
      message: `No Table ID - ${params} found.`,
    });
  }

  if (!table.reservation_id) {
    next({
      status: 400,
      message: `Table is not occupied currently.`,
    });
  }

  return next();
}

async function destroy(req, res) {
  await reservationService.update(res.locals.table.reservation_id, "finished");
  const data = await service.update(res.locals.params, null);
  res.status(200).json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [allFields, asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(beforeUpdate), asyncErrorBoundary(toUpdate)],
  delete: [asyncErrorBoundary(beforeDestroy), asyncErrorBoundary(destroy)],
};
