/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('config_categorias_despesa', function(table) {
    table.increments('id').primary();
    table.string('nome').notNullable();
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
  return knex.schema.dropTable('config_categorias_despesa');
};
