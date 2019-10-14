import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
    return knex("players").del()
        .then(() => {
            return knex("players").insert([
                { id: 1, name: "testPlayer1", rank: "Player", deaths: 0, kills: 0},
                { id: 2, name: "testPlayer2", rank: "Player", deaths: 20, kills: 30},
                { id: 3, name: "testPlayer3", rank: "AdminOrSomething", deaths: 10, kills: 10},

            ])
        })
}
