import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    const createHeavyDMArenas = knex.schema.createTable("heavy_dm_arenas", (table) => {
        table.increments("id").primary()
        table.string("name").notNullable()
        table.string("author").notNullable()
        table.boolean("active").notNullable()
    })

    const createHeavyDMArenasSpawns = knex.schema.createTable("heavy_dm_arenas_spawns", (table) => {
        table.increments("id").primary()
        table.integer("arenaId").unsigned().notNullable()
        table.decimal("x", 35, 25).notNullable()
        table.decimal("y", 35, 25).notNullable()
        table.decimal("z", 35, 25).notNullable()
        table.foreign("arenaId").references("id").inTable("heavy_dm_arenas")
    })

    const createHeavyDMArenasWeapons = knex.schema.createTable("heavy_dm_arenas_weapons", (table) => {
        table.increments("id").primary()
        table.integer("arenaId").unsigned().notNullable()
        table.integer("weaponId").unsigned().notNullable()
        table.integer("ammo").unsigned().notNullable()
        table.foreign("arenaId").references("id").inTable("heavy_dm_arenas")
    })
    return Promise.all([createHeavyDMArenas, createHeavyDMArenasSpawns, createHeavyDMArenasWeapons])
}

export async function down(knex: Knex): Promise<any> {
    return Promise.all([
        knex.schema.dropTableIfExists("heavy_dm_arenas"),
        knex.schema.dropTableIfExists("heavy_dm_arenas_spawns"),
        knex.schema.dropTableIfExists("heavy_dm_arenas_weapons"),
    ])
}
