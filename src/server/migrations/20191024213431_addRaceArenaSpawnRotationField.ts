import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    return knex.schema.alterTable("races_arenas_spawns", (table: Knex.CreateTableBuilder) => {
        table.float("rotation").notNullable().defaultTo(0)
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.table("races_arenas_spawns", (table: Knex.AlterTableBuilder) => {
        knex.schema.hasColumn("races_arenas_spawns", "rotation").then((exists) => {
            if (exists) {
                table.dropColumn("races_arenas_spawns")
            }
        })
    })

}
