const knex = require("../db/connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function read(id) {
  return knex("reservations").select("*").where({ reservation_id: id }).first();
}

async function create(reservation) {
  const res = await knex("reservations").insert(reservation).returning("*");
  return res[0];
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy(["reservation_date", "reservation_time"]);
}

async function update(id, status) {
  const res = await knex("reservations")
    .select("*")
    .where({ reservation_id: id })
    .update("status", status)
    .returning("*");
  return res[0];
}

async function updateAll(res) {
  const res_1 = await knex("reservations")
    .select("*")
    .where({ reservation_id: res.reservation_id })
    .update(res, "*")
    .returning("*");
  return res_1[0];
}

module.exports = {
  read,
  list,
  create: asyncErrorBoundary(create),
  search,
  update: asyncErrorBoundary(update),
  updateAll: asyncErrorBoundary(updateAll),
};
