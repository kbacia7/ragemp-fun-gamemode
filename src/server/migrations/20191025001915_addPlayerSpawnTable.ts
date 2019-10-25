import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable("players_spawns", (table) => {
        table.increments("id").primary()
        table.decimal("x", 35, 25).notNullable()
        table.decimal("y", 35, 25).notNullable()
        table.decimal("z", 35, 25).notNullable()
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("players_spawns")
}
