import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    const createOneShootArenas = knex.schema.createTable("one_shoot_arenas", (table) => {
        table.increments("id").primary()
        table.string("name").notNullable()
        table.string("author").notNullable()
        table.boolean("active").notNullable()
    })

    const createOneShootArenasSpawns = knex.schema.createTable("one_shoot_arenas_spawns", (table) => {
        table.increments("id").primary()
        table.integer("arenaId").unsigned().notNullable()
        table.decimal("x", 35, 25).notNullable()
        table.decimal("y", 35, 25).notNullable()
        table.decimal("z", 35, 25).notNullable()
        table.foreign("arenaId").references("id").inTable("one_shoot_arenas")
    })

    const createOneShootArenasWeapons = knex.schema.createTable("one_shoot_arenas_weapons", (table) => {
        table.increments("id").primary()
        table.integer("arenaId").unsigned().notNullable()
        table.integer("weaponId").unsigned().notNullable()
        table.integer("ammo").unsigned().notNullable()
        table.foreign("arenaId").references("id").inTable("one_shoot_arenas")
    })
    return Promise.all([createOneShootArenas, createOneShootArenasSpawns, createOneShootArenasWeapons])
}

export async function down(knex: Knex): Promise<any> {
    return Promise.all([
        knex.schema.dropTableIfExists("one_shoot_arenas"),
        knex.schema.dropTableIfExists("one_shoot_arenas_spawns"),
        knex.schema.dropTableIfExists("one_shoot_arenas_weapons"),
    ])
}
