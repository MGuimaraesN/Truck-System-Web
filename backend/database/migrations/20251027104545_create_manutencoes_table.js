/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('manutencoes', function(table) {
    table.increments('id').primary();
    table.date('data').notNullable();
    table.float('km_manutencao').notNullable();
    table.float('km_proxima_troca');
    table.string('descricao').notNullable();
    table.integer('veiculo_id').unsigned().notNullable();
    table.foreign('veiculo_id').references('id').inTable('veiculos').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('manutencoes');
};
