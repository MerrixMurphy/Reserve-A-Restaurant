/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { min } = require("../db/connection");

function allFields(req, res, next) {
  if (!req.body.data) {
    next({
      status: 400,
      message: "No data present in request.",
    });
  }

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

  const [hour, minute] = reservation_time.split(":");

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
      Number(hour) < new Date().getHours() ||
      (Number(hour) === new Date().getHours() &&
        Number(minute) < new Date().getMinutes()):
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

async function list(req, res) {
  const data = await service.list(req.query.date);
  res.json({ data });
}

async function create(req, res) {
  const data = req.body.data;
  await service.create(data);
  res.status(201).json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [allFields, asyncErrorBoundary(create)],
};
