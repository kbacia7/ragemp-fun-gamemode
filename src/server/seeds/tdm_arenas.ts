import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex("tdm_arenas").del()
        .then(() => {
            // Inserts seed entries
            return knex("tdm_arenas").insert([
                { id: 1, name: "Testowa mapa", author: "Nikt" },
            ])
        })
}
