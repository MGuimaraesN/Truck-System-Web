module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database/fleet.db3' // Aponta para o volume que criámos
    },
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations'
    }
  }
};
