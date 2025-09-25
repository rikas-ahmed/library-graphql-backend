module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '5862',
      database: 'library_db'
    },
    migrations: {
      directory: './migrations' 
    }
  }
};