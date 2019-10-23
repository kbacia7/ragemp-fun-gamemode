import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex("settings").del()
        .then(() => {
            // Inserts seed entries
            return knex("settings").insert([
                {
                    description: "Minimalna liczba graczy do startu zabawy Race",
                    id: 1,
                    name: "race_min_players",
                    value: "1",
                },
                {
                    description: "Maksymalna liczba graczy jaka może się zapisać na Race",
                    id: 2,
                    name: "race_max_players",
                    value: "30",
                },

            ])
        })
}
