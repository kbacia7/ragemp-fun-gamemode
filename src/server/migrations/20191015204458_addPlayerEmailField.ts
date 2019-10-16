import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    return knex.schema.alterTable("players", (table: Knex.CreateTableBuilder) => {
        table.string("email").notNullable()
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.table("players", (table: Knex.AlterTableBuilder) => {
        knex.schema.hasColumn("players", "email").then((exists) => {
            if (exists) {
                table.dropColumn("email")
            }
        })
    })

}
