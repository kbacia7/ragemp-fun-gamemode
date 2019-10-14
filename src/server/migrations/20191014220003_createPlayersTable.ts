import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable("players", (table) => {
        table.increments("id").primary()
        table.string("name")
        table.string("rank")
        table.integer("deaths")
        table.integer("kills")
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("players")
}
