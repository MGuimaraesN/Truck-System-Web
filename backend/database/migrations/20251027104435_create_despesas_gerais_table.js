/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('despesas_gerais', function(table) {
    table.increments('id').primary();
    table.date('data').notNullable();
    table.string('descricao').notNullable();
    table.decimal('valor', 10, 2).notNullable();
    table.string('categoria').notNullable();
    table.string('forma_pagamento').notNullable();
    table.string('tipo_pagamento').notNullable().checkIn(['À Vista', 'Parcelado']);
    table.string('comprovante_url');
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
  return knex.schema.dropTable('despesas_gerais');
};
