import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    return knex.schema.alterTable("players", (table: Knex.CreateTableBuilder) => {
        table.integer("ped").notNullable().defaultTo(0x5244247D)
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.table("players", (table: Knex.AlterTableBuilder) => {
        knex.schema.hasColumn("players", "ped").then((exists) => {
            if (exists) {
                table.dropColumn("ped")
            }
        })
    })
}
