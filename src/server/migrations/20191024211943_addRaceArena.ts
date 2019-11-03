import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable("races_arenas", (table) => {
        table.increments("id").primary()
        table.string("name").notNullable()
        table.string("author").notNullable()
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("races_arenas")
}
