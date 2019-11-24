import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    const createDMArenas = knex.schema.createTable("dm_arenas", (table) => {
        table.increments("id").primary()
        table.string("name").notNullable()
        table.string("author").notNullable()
        table.boolean("active").notNullable()
    })

    const createDMArenasSpawns = knex.schema.createTable("dm_arenas_spawns", (table) => {
        table.increments("id").primary()
        table.integer("arenaId").unsigned().notNullable()
        table.decimal("x", 35, 25).notNullable()
        table.decimal("y", 35, 25).notNullable()
        table.decimal("z", 35, 25).notNullable()
        table.foreign("arenaId").references("id").inTable("dm_arenas")
    })

    const createDMArenasWeapons = knex.schema.createTable("dm_arenas_weapons", (table) => {
        table.increments("id").primary()
        table.integer("arenaId").unsigned().notNullable()
        table.integer("weaponId").unsigned().notNullable()
        table.integer("ammo").unsigned().notNullable()
        table.foreign("arenaId").references("id").inTable("dm_arenas")
    })
    return Promise.all([createDMArenas, createDMArenasSpawns, createDMArenasWeapons])
}

export async function down(knex: Knex): Promise<any> {
    return Promise.all([
        knex.schema.dropTableIfExists("dm_arenas"),
        knex.schema.dropTableIfExists("dm_arenas_spawns"),
        knex.schema.dropTableIfExists("dm_arenas_weapons"),
    ])
}
