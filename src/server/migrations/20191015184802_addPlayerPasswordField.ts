import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    return knex.schema.alterTable("players", (table: Knex.CreateTableBuilder) => {
        table.string("password").notNullable()
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.table("players", (table: Knex.AlterTableBuilder) => {
        knex.schema.hasColumn("players", "password").then((exists) => {
            if (exists) {
                table.dropColumn("password")
            }
        })
    })

}
