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
                {
                    description: "Minimalna kwota jaką może otrzymać gracz za wygraną na Race",
                    id: 3,
                    name: "race_min_money",
                    value: "1000",
                },
                {
                    description: "Maksymalna kwota jaką może otrzymać gracz za wygraną na Race",
                    id: 4,
                    name: "race_max_money",
                    value: "3000",
                },
                {
                    description: "Minimalna liczba expa jaką może otrzymać gracz za wygraną na Race",
                    id: 5,
                    name: "race_min_exp",
                    value: "3",
                },
                {
                    description: "Maksymalna liczba expa jaką może otrzymać gracz za wygraną na Race",
                    id: 6,
                    name: "race_max_exp",
                    value: "10",
                },
                {
                    description: "Nazwa wyświetlana dla Race w tabeli",
                    id: 7,
                    name: "race_display_name",
                    value: "Race",
                },

                {
                    description: "Minimalna liczba graczy do startu zabawy TDM",
                    id: 8,
                    name: "tdm_min_players",
                    value: "1",
                },
                {
                    description: "Maksymalna liczba graczy jaka może się zapisać na TDM",
                    id: 9,
                    name: "tdm_max_players",
                    value: "30",
                },
                {
                    description: "Minimalna kwota jaką może otrzymać gracz za wygraną na TDM",
                    id: 10,
                    name: "tdm_min_money",
                    value: "1000",
                },
                {
                    description: "Maksymalna kwota jaką może otrzymać gracz za wygraną na TDM",
                    id: 11,
                    name: "tdm_max_money",
                    value: "3000",
                },
                {
                    description: "Minimalna liczba expa jaką może otrzymać gracz za wygraną na TDM",
                    id: 12,
                    name: "tdm_min_exp",
                    value: "3",
                },
                {
                    description: "Maksymalna liczba expa jaką może otrzymać gracz za wygraną na TDM",
                    id: 13,
                    name: "tdm_max_exp",
                    value: "10",
                },
                {
                    description: "Nazwa wyświetlana dla tdm w tabeli",
                    id: 14,
                    name: "tdm_display_name",
                    value: "TDM",
                },

            ])
        })
}
