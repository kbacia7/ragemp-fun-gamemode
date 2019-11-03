import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
    return knex.schema.alterTable("races_arenas_checkpoints", (table: Knex.CreateTableBuilder) => {
        table.decimal("x", 35, 25).alter()
        table.decimal("y", 35, 25).alter()
        table.decimal("z", 35, 25).alter()

    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.table("races_arenas_checkpoints", (table: Knex.AlterTableBuilder) => {
        table.float("x").alter()
        table.float("y").alter()
        table.float("z").alter()
    })

}
