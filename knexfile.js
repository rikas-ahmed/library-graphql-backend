module.exports = {
  development: {
    client: 'pg', // Specifies PostgreSQL as the database client
    connection: {
      host: 'localhost', // or your database host
      user: 'postgres',
      password: '5862',
      database: 'library_db'
    },
    migrations: {
      directory: './migrations' // Knex will look for migration files in this folder
    }
  }
};