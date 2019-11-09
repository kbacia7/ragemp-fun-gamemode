import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable("tdm_arenas_weapons", (table) => {
        table.increments("id").primary()
        table.integer("arenaId").unsigned().notNullable()
        table.integer("weaponId").unsigned().notNullable()
        table.integer("ammo").unsigned().notNullable()
        table.foreign("arenaId").references("id").inTable("tdm_arenas")
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("tdm_arenas_weapons")
}
