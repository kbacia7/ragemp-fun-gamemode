import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    const createDerbyArenas = knex.schema.createTable("derby_arenas", (table) => {
        table.increments("id").primary()
        table.string("name").notNullable()
        table.string("author").notNullable()
        table.integer("vehicleModel").notNullable()
        table.decimal("heightLimit", 35, 25).notNullable()
    })
    const createDerbyArenasSpawns = knex.schema.createTable("derby_arenas_spawns", (table) => {
        table.increments("id").primary()
        table.integer("arenaId").unsigned().notNullable()
        table.decimal("x", 35, 25).notNullable()
        table.decimal("y", 35, 25).notNullable()
        table.decimal("z", 35, 25).notNullable()
        table.decimal("rotation", 35, 25).notNullable().defaultTo(0)
        table.foreign("arenaId").references("id").inTable("tdm_arenas")
    })
    return Promise.all([createDerbyArenas, createDerbyArenasSpawns])
}


export async function down(knex: Knex): Promise<any> {
    return Promise.all([
        knex.schema.dropTableIfExists("derby_arenas_spawns"),
        knex.schema.dropTableIfExists("derby_arenas"),
    ])
}

