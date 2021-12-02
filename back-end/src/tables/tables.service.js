const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(id) {
  return knex("tables").select("*").where({ table_id: id }).first();
}

function create(table) {
  return knex("tables").insert(table);
}

function update(id, resId) {
  return knex("tables")
    .select("*")
    .where({ table_id: id })
    .update("reservation_id", resId)
    .returning("*")
    .then((tab) => tab[0]);
}

module.exports = {
  list,
  create,
  update,
  read,
};
