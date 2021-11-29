/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function allFields(req, res, next) {
  if (!req.body.data) {
    next({
      status: 400,
      message: "No data present in request.",
    });
  }

  if (Object.keys(req.body.data).length > 1) {
    let error = "";

    const {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      status,
    } = req.body.data;

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
          message: `Please put a future reservation_date in the request.`,
        });
      case new Date(reservation_date).getDay() === 1:
        next({
          status: 400,
          message: `We are closed on this reservation_date.`,
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
          message: `We are closed on this reservation_date.`,
        });
      default:
        res.locals.first_name = first_name;
        res.locals.last_name = last_name;
        res.locals.mobile_number = mobile_number;
        res.locals.reservation_date = reservation_date;
        res.locals.reservation_time = reservation_time;
        res.locals.people = people;
        return next();
    }
  }
  const status = req.body.data.status;
  if (
    status !== "finished" &&
    status !== "seated" &&
    status !== "cancelled" &&
    status !== "booked"
  ) {
    next({
      status: 400,
      message: `Reservation with status: ${req.body.data.status} is not a valid status for creating.`,
    });
  }
  return next();
}

async function correctId(req, res, next) {
  const id = await service.read(req.params.reservation_id);
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

async function list(req, res) {
  if (req.query.date) {
    const data = await service.list(req.query.date);
    res.json({ data });
  } else if (req.query.mobile_number) {
    const data = await service.search(req.query.mobile_number);
    res.json({ data });
  }
}

async function read(req, res) {
  const data = await service.read(req.params.reservation_id);
  if (data) {
    res.status(200).json({ data });
  }
}

async function create(req, res) {
  const data = req.body.data;
  await service.create(data);
  res.status(201).json({ data });
}

async function update(req, res) {
  let data = null;
  if (req.body.data.reservation_id) {
    data = await service.updateAll(req.body.data);
  } else {
    data = await service.update(
      req.params.reservation_id,
      req.body.data.status
    );
  }
  res.status(200).json({ data });
}

module.exports = {
  read: [asyncErrorBoundary(correctId), asyncErrorBoundary(read)],
  list: [asyncErrorBoundary(list)],
  create: [allFields, asyncErrorBoundary(create)],
  update: [
    asyncErrorBoundary(correctId),
    allFields,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(correctId),
    isFinished,
    allFields,
    asyncErrorBoundary(update),
  ],
};
