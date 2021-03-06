/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {
  resFields,
  correctId,
  isFinished,
} = require("../validation/controllerValidations");

async function list(req, res) {
  res.locals.date = req.query.date;
  res.locals.phone = req.query.mobile_number;
  if (res.locals.date) {
    const data = await service.list(res.locals.date);
    res.json({ data });
  } else if (res.locals.phone) {
    const data = await service.search(res.locals.phone);
    res.json({ data });
  }
}

function read(req, res) {
  const data = res.locals.currentRes;
  res.status(200).json({ data });
}

async function create(req, res) {
  const data = res.locals.fieldValRes;
  await service.create(data);
  res.status(201).json({ data });
}

async function update(req, res) {
  let data = null;
  if (res.locals.fieldValRes.reservation_id) {
    data = await service.updateAll(req.body.data);
  } else {
    data = await service.update(res.locals.paramsId, res.locals.status);
  }
  res.status(200).json({ data });
}

module.exports = {
  read: [asyncErrorBoundary(correctId), read],
  list: [asyncErrorBoundary(list)],
  create: [resFields, asyncErrorBoundary(create)],
  update: [
    asyncErrorBoundary(correctId),
    resFields,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(correctId),
    isFinished,
    resFields,
    asyncErrorBoundary(update),
  ],
};
