import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    return (knex.schema.table("players", (table) => {
        table.renameColumn("name", "login")
    }))
}

export async function down(knex: Knex): Promise<any> {
    return (knex.schema.table("players", (table) => {
        table.renameColumn("login", "name")
    }))
}
