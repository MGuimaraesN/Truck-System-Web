/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('receitas_fretes', function(table) {
    table.increments('id').primary();
    table.date('data').notNullable();
    table.string('nota_fiscal');
    table.string('origem').notNullable();
    table.string('destino').notNullable();
    table.decimal('valor', 10, 2).notNullable();
    table.string('status_pagamento').notNullable().checkIn(['A Receber', 'Recebido']);
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
  return knex.schema.dropTable('receitas_fretes');
};
