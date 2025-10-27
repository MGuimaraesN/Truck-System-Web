/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('usuarios', function(table) {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('email').notNullable().unique();
    table.string('senha_hash').notNullable();
    table.string('role').notNullable().checkIn(['admin', 'user']).defaultTo('user');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('usuarios');
};
