// Update with your config settings.

export default module.exports = {

  development: {
    client: "mysql",
    connection: {
      database: "DB",
      host: "HOST",
      password: "PASSWORD",
      user: "USER",
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
}
