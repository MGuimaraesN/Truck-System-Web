const knex = require('knex');
const knexfile = require('../../knexfile');

// Em um ambiente de produção real, você pode querer selecionar a configuração
// com base em process.env.NODE_ENV (ex: 'production', 'staging')
const db = knex(knexfile.development);

module.exports = db;
