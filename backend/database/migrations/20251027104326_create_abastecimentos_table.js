/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('abastecimentos', function(table) {
    table.increments('id').primary();
    table.date('data').notNullable();
    table.float('km_atual').notNullable();
    table.float('litros').notNullable();
    table.decimal('valor_total', 10, 2).notNullable();
    table.string('posto');
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
  return knex.schema.dropTable('abastecimentos');
};
