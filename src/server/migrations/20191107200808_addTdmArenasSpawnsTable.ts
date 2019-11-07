import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable("tdm_arenas_spawns", (table) => {
        table.increments("id").primary()
        table.integer("arenaId").unsigned().notNullable()
        table.decimal("x", 35, 25).notNullable()
        table.decimal("y", 35, 25).notNullable()
        table.decimal("z", 35, 25).notNullable()
        table.integer("team").unsigned().notNullable()
        table.foreign("arenaId").references("id").inTable("tdm_arenas")
    })
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("tdm_arenas_spawns")

}

