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

  if (req.body.data.first_name) {
    let error = "";

    const {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    } = req.body.data;

    const toCompare = [
      "first_name",
      "last_name",
      "mobile_number",
      "reservation_date",
      "reservation_time",
      "people",
    ];

    let [hour, minute] = "";

    if (reservation_time) {
      [hour, minute] = reservation_time.split(":");
    }

    switch (true) {
      case people === 0:
        error = "people";
        next({
          status: 400,
          message: `Error: No valid ${error} in the request.`,
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
          message: `Error: No valid ${error} in the request.`,
        });
      case typeof people != "number":
        error = "people";
        next({
          status: 400,
          message: `Error: No valid ${error} in the request.`,
        });
      case !Date.parse(reservation_date):
        error = "reservation_date";
        next({
          status: 400,
          message: `Error: No valid ${error} in the request.`,
        });
      case !reservation_time.match("[0-9]{2}:[0-9]{2}"):
        error = "reservation_time";
        next({
          status: 400,
          message: `Error: No valid ${error} in the request.`,
        });
      case Date.parse(reservation_date) < Date.parse(new Date()):
        next({
          status: 400,
          message: `Error: Please put a future reservation_date in the request.`,
        });
      case new Date(reservation_date).getDay() === 1:
        next({
          status: 400,
          message: `Error: We are closed on this reservation_date.`,
        });
      case Number(hour) < 10 ||
        (Number(hour) === 10 && Number(minute) <= 30) ||
        Number(hour) > 21 ||
        (Number(hour) === 21 && Number(minute) >= 30) ||
        (new Date() === reservation_date &&
          (Number(hour) < new Date().getHours() ||
            (Number(hour) === new Date().getHours() &&
              Number(minute) < new Date().getMinutes()))):
        next({
          status: 400,
          message: `Error: We are closed on this reservation_date.`,
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
  return next();
}

async function correctId(req, res, next) {
  const id = await service.read(req.params.reservation_id);
  if (id) {
    return next();
  }
  next({
    status: 404,
    message: `Reservation $${req.params.reservation_id} cannot be found.`,
  });
}

async function list(req, res) {
  if (req.query.date) {
    const data = await service.list(req.query.date);
    res.json({ data });
  } else if (req.query.mobile_phone) {
    const data = await service.search(req.query.mobile_phone);
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
  update: [allFields, asyncErrorBoundary(update)],
};
