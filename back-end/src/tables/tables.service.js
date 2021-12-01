const knex = require("../db/connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(id) {
  return knex("tables").select("*").where({ table_id: id }).first();
}

function create(table) {
  return knex("tables").insert(table);
}

async function update(id, resId) {
  const tab = await knex("tables")
    .select("*")
    .where({ table_id: id })
    .update("reservation_id", resId)
    .returning("*");
  return tab[0];
}

module.exports = {
  list,
  create,
  update: asyncErrorBoundary(update),
  read,
};
