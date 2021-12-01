const reservationService = require("../reservations/reservations.service");
const tableService = require("../tables/tables.service");

function resFields(req, res, next) {
  res.locals.fieldValRes = req.body.data;
  if (!res.locals.fieldValRes) {
    next({
      status: 400,
      message: "No data present in request.",
    });
  }

  if (Object.keys(res.locals.fieldValRes).length > 1) {
    let error = "";

    const {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      status,
    } = res.locals.fieldValRes;

    const toCompare = [
      "first_name",
      "last_name",
      "mobile_number",
      "reservation_date",
      "reservation_time",
      "people",
    ];

    const date = new Date();
    let stringDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    let [hour, minute] = "";

    if (reservation_time) {
      [hour, minute] = reservation_time.split(":");
    }

    switch (true) {
      case people === 0:
        error = "people";
        next({
          status: 400,
          message: `No valid ${error} in the request.`,
        });
      case !first_name ||
        !last_name ||
        !mobile_number ||
        !reservation_date ||
        !reservation_time ||
        !people:
        error = toCompare.filter((compare) => {
          const checkData = Object.keys(res.locals.fieldValRes);
          for (var each in res.locals.fieldValRes) {
            if (res.locals.fieldValRes[each] === "") {
              return each;
            }
          }
          return !checkData.includes(compare);
        });
        next({
          status: 400,
          message: `No valid ${error} in the request.`,
        });
      case typeof people != "number":
        error = "people";
        next({
          status: 400,
          message: `No valid ${error} in the request.`,
        });
      case !Date.parse(reservation_date):
        error = "reservation_date";
        next({
          status: 400,
          message: `No valid ${error} in the request.`,
        });
      case !reservation_time.match("[0-9]{2}:[0-9]{2}"):
        error = "reservation_time";
        next({
          status: 400,
          message: `No valid ${error} in the request.`,
        });
      case Date.parse(reservation_date) < Date.parse(stringDate) ||
        (stringDate === reservation_date &&
          (Number(hour) < date.getHours() ||
            (Number(hour) === date.getHours() &&
              Number(minute) < date.getMinutes()))):
        next({
          status: 400,
          message: `Please put a future reservation date in the request.`,
        });
      case new Date(reservation_date).getDay() === 1:
        next({
          status: 400,
          message: `We are closed on this reservation date.`,
        });
      case status === "finished" ||
        status === "cancelled" ||
        status === "seated":
        next({
          status: 400,
          message: `Reservation with status: ${status} is not a valid status for creating.`,
        });
      case Number(hour) < 10 ||
        (Number(hour) === 10 && Number(minute) <= 30) ||
        Number(hour) > 21 ||
        (Number(hour) === 21 && Number(minute) >= 30):
        next({
          status: 400,
          message: `We are closed during this reservation time.`,
        });
      default:
        return next();
    }
  }
  const status = res.locals.fieldValRes.status;
  if (
    status !== "finished" &&
    status !== "seated" &&
    status !== "cancelled" &&
    status !== "booked"
  ) {
    next({
      status: 400,
      message: `Reservation with status: ${res.locals.fieldValRes.status} is not a valid status for creating.`,
    });
  }
  res.locals.status = status;
  return next();
}

async function correctId(req, res, next) {
  res.locals.paramsId = req.params.reservation_id;
  const id = await reservationService.read(res.locals.paramsId);
  if (id) {
    res.locals.currentRes = id;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ID: ${req.params.reservation_id} cannot be found.`,
  });
}

function isFinished(req, res, next) {
  if (res.locals.currentRes.status === "finished") {
    next({
      status: 400,
      message: `Reservation's with status: ${res.locals.currentRes.status} cannot be edited.`,
    });
  }
  return next();
}

function beforeCreate(req, res, next) {
  res.locals.fieldValTab = req.body.data;
  if (!res.locals.fieldValTab) {
    next({
      status: 400,
      message: "No data present in request.",
    });
  }

  let error = "";

  const { table_name, capacity } = res.locals.fieldValTab;

  const toCompare = ["table_name", "capacity"];

  switch (true) {
    case capacity === 0:
      error = "capacity";
      next({
        status: 400,
        message: `No valid ${error} in the request.`,
      });
    case !capacity || !table_name:
      error = toCompare.filter((compare) => {
        const checkData = Object.keys(res.locals.fieldValTab);
        for (var each in res.locals.fieldValTab) {
          if (res.locals.fieldValTab[each] === "") {
            return each;
          }
        }
        return !checkData.includes(compare);
      });
      next({
        status: 400,
        message: `No valid ${error} in the request.`,
      });
    case table_name.length <= 1:
      error = "table_name";
      next({
        status: 400,
        message: `No valid ${error} in the request.`,
      });
    case typeof capacity != "number":
      error = "capacity";
      next({
        status: 400,
        message: `No valid ${error} in the request.`,
      });
    default:
      res.locals.table_name = table_name;
      res.locals.capacity = capacity;
      return next();
  }
}

async function beforeUpdate(req, res, next) {
  res.locals.fieldValTab = req.body.data;
  if (!res.locals.fieldValTab || !res.locals.fieldValTab.reservation_id) {
    next({
      status: 400,
      message:
        "No valid data present in request. Please include valid reservation_id.",
    });
  }

  const reservationData = await reservationService.read(
    res.locals.fieldValTab.reservation_id
  );
  res.locals.reservationData = reservationData;
  const tableData = await tableService.read(Number(req.params.table_id));
  res.locals.tableData = tableData;

  let error = "";

  if (!reservationData) {
    error = res.locals.fieldValTab.reservation_id;
    next({
      status: 404,
      message: `Reservation ID - ${error} does not exist.`,
    });
  }

  if (reservationData.status === "seated") {
    next({
      status: 400,
      message: `Reservation is currently seated.`,
    });
  }

  if (tableData.capacity < reservationData.people) {
    error = "capacity";
    next({
      status: 400,
      message: `No valid ${error} in the request.`,
    });
  }

  if (tableData.reservation_id) {
    return next({
      status: 400,
      message: `Table is currently occupied.`,
    });
  }

  return next();
}

async function beforeDestroy(req, res, next) {
  res.locals.params = req.params.table_id;
  const table = await tableService.read(res.locals.params);
  if (table) {
    res.locals.table = table;
  } else {
    next({
      status: 404,
      message: `No Table ID - ${res.locals.params} found.`,
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

module.exports = {
  resFields,
  correctId,
  isFinished,
  beforeCreate,
  beforeDestroy,
  beforeUpdate,
};
