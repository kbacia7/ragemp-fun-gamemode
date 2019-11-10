import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
    return knex("players").del()
        .then(() => {
            // tslint:disable: object-literal-sort-keys
            return knex("players").insert([
                {
                    email: "t@mail.com",
                    id: 1,
                    login: "testPlayer1",
                    password: "123",
                    rank: "Player",
                    deaths: 0,
                    kills: 0,
                },

            ])
        })
}
