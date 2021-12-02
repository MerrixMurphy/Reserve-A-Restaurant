const knex = require("../db/connection");

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

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((res) => res[0]);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy(["reservation_date", "reservation_time"]);
}

function update(id, status) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: id })
    .update("status", status)
    .returning("*")
    .then((res) => res[0]);
}

function updateAll(res) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: res.reservation_id })
    .update(res, "*")
    .returning("*")
    .then((res) => res[0]);
}

module.exports = {
  read,
  list,
  create,
  search,
  update,
  updateAll,
};
