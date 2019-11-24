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

                {
                    description: "Minimalna liczba graczy do startu zabawy Derby",
                    id: 15,
                    name: "derby_min_players",
                    value: "1",
                },
                {
                    description: "Maksymalna liczba graczy jaka może się zapisać na Derby",
                    id: 16,
                    name: "derby_max_players",
                    value: "30",
                },
                {
                    description: "Minimalna kwota jaką może otrzymać gracz za wygraną na Derby",
                    id: 17,
                    name: "derby_min_money",
                    value: "1000",
                },
                {
                    description: "Maksymalna kwota jaką może otrzymać gracz za wygraną na Derby",
                    id: 18,
                    name: "derby_max_money",
                    value: "3000",
                },
                {
                    description: "Minimalna liczba expa jaką może otrzymać gracz za wygraną na Derby",
                    id: 19,
                    name: "derby_min_exp",
                    value: "3",
                },
                {
                    description: "Maksymalna liczba expa jaką może otrzymać gracz za wygraną na Derby",
                    id: 20,
                    name: "derby_max_exp",
                    value: "10",
                },
                {
                    description: "Nazwa wyświetlana dla Derby w tabeli",
                    id: 21,
                    name: "derby_display_name",
                    value: "Derby",
                },
                {
                    description: "Minimalna liczba graczy do startu zabawy Hide&Seek",
                    id: 22,
                    name: "hideandseek_min_players",
                    value: "1",
                },
                {
                    description: "Maksymalna liczba graczy jaka może się zapisać na Hide&Seek",
                    id: 23,
                    name: "hideandseek_max_players",
                    value: "30",
                },
                {
                    description: "Minimalna kwota jaką może otrzymać gracz za wygraną na Hide&Seek",
                    id: 24,
                    name: "hideandseek_min_money",
                    value: "1000",
                },
                {
                    description: "Maksymalna kwota jaką może otrzymać gracz za wygraną na Hide&Seek",
                    id: 25,
                    name: "hideandseek_max_money",
                    value: "3000",
                },
                {
                    description: "Minimalna liczba expa jaką może otrzymać gracz za wygraną na Hide&Seek",
                    id: 26,
                    name: "hideandseek_min_exp",
                    value: "3",
                },
                {
                    description: "Maksymalna liczba expa jaką może otrzymać gracz za wygraną na Hide&Seek",
                    id: 27,
                    name: "hideandseek_max_exp",
                    value: "10",
                },
                {
                    description: "Nazwa wyświetlana dla Hide&Seek w tabeli",
                    id: 28,
                    name: "hideandseek_display_name",
                    value: "Hide&Seek",
                },
                {
                    description: "Pozycja X w którą zostanie przeniesiony szukający podczas gdy gracze będą się chować",
                    id: 29,
                    name: "hideandseek_looking_wait_room_x",
                    value: "0",
                },
                {
                    description: "Pozycja Y w którą zostanie przeniesiony szukający podczas gdy gracze będą się chować",
                    id: 30,
                    name: "hideandseek_looking_wait_room_x",
                    value: "0",
                },
                {
                    description: "Pozycja Z w którą zostanie przeniesiony szukający podczas gdy gracze będą się chować",
                    id: 31,
                    name: "hideandseek_looking_wait_room_z",
                    value: "0",
                },
                {
                    description: "Nazwa wyświetlana dla dm w tabeli",
                    id: 32,
                    name: "dm_display_name",
                    value: "DM",
                },
                {
                    description: "Maksymalna liczba graczy jaka może się zapisać na DM",
                    id: 33,
                    name: "dm_max_players",
                    value: "30",
                },
                {
                    description: "Nazwa wyświetlana dla heavydm w tabeli",
                    id: 34,
                    name: "heavydm_display_name",
                    value: "HeavyDM",
                },
                {
                    description: "Maksymalna liczba graczy jaka może się zapisać na HeavyDM",
                    id: 35,
                    name: "heavydm_max_players",
                    value: "30",
                },
                {
                    description: "Nazwa wyświetlana dla sniper w tabeli",
                    id: 36,
                    name: "sniper_display_name",
                    value: "Sniper",
                },
                {
                    description: "Maksymalna liczba graczy jaka może się zapisać na Sniper",
                    id: 37,
                    name: "sniper_max_players",
                    value: "30",
                },
                {
                    description: "Nazwa wyświetlana dla oneshoot w tabeli",
                    id: 38,
                    name: "oneshoot_display_name",
                    value: "OneShoot",
                },
                {
                    description: "Maksymalna liczba graczy jaka może się zapisać na OneShoot",
                    id: 39,
                    name: "oneshoot_max_players",
                    value: "30",
                },
            ])
        })
}
