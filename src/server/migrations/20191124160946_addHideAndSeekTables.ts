import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    const createHideAndSeekArenas = knex.schema.createTable("hideandseek_arenas", (table) => {
        table.increments("id").primary()
        table.string("name").notNullable()
        table.string("author").notNullable()
        table.decimal("lookingX", 35, 25).notNullable()
        table.decimal("lookingY", 35, 25).notNullable()
        table.decimal("lookingZ", 35, 25).notNullable()
    })

    const createHideAndSeekArenasSpawns = knex.schema.createTable("hideandseek_arenas_spawns", (table) => {
        table.increments("id").primary()
        table.integer("arenaId").unsigned().notNullable()
        table.decimal("x", 35, 25).notNullable()
        table.decimal("y", 35, 25).notNullable()
        table.decimal("z", 35, 25).notNullable()
        table.foreign("arenaId").references("id").inTable("hideandseek_arenas")
    })
    return Promise.all([createHideAndSeekArenas, createHideAndSeekArenasSpawns])
}

export async function down(knex: Knex): Promise<any> {
    return Promise.all([
        knex.schema.dropTableIfExists("hideandseek_arenas_spawns"),
        knex.schema.dropTableIfExists("hideandseek_arenas"),
    ])
}
