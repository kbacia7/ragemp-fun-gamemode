import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable("settings", (table) => {
        table.increments("id").primary()
        table.string("name")
        table.string("value")
        table.string("description")

    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("settings")
}
