/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('veiculos', function(table) {
    table.increments('id').primary();
    table.string('placa').notNullable().unique();
    table.string('apelido');
    table.string('modelo').notNullable();
    table.integer('ano').notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('usuarios').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('veiculos');
};
