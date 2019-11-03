import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex("players_spawns").del()
        .then(() => {
            // Inserts seed entries
            return knex("players_spawns").insert([
                { id: 1, x: -0.9374609589576721, y: -55.100364685058594, z:  63.28532028198242 },

            ])
        })
}
