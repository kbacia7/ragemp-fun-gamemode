import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable("races_arenas_spawns", (table) => {
        table.increments("id").primary()
        table.integer("arenaId").unsigned().notNullable()
        table.float("x").notNullable()
        table.float("y").notNullable()
        table.float("z").notNullable()
        table.integer("vehicleModel").notNullable()
        table.foreign("arenaId").references("id").inTable("races_arenas")
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("races_arenas_checkpoints")
}
