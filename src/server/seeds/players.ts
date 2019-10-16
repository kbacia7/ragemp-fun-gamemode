import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
    return knex("players").del()
        .then(() => {
            return knex("players").insert([
                { id: 1, login: "testPlayer1", password: "123", rank: "Player", deaths: 0, kills: 0},
                { id: 2, login: "testPlayer2", password: "123", rank: "Player", deaths: 20, kills: 30},
                { id: 3, login: "testPlayer3", password: "123", rank: "AdminOrSomething", deaths: 10, kills: 10},

            ])
        })
}
