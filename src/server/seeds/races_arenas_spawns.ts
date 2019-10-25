import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    // tslint:disable: object-literal-sort-keys
    return knex("races_arenas_spawns").del()
        .then(() => {
            // Inserts seed entries
            return knex("races_arenas_spawns").insert([
                {
                    id: 1,
                    x: -0.9374609589576721,
                    y: -55.100364685058594,
                    z:  63.28532028198242,
                    rotation: 248.40576171875,
                    vehicleModel: 0x7B54A9D3,
                    arenaId: 1,
                },
                {
                    id: 2,
                    x: -0.12532657384872437,
                    y: -57.71890640258789,
                    z:  63.28529739379883,
                    rotation:  252.85140991210938,
                    vehicleModel: 0x7B54A9D3,
                    arenaId: 1,
                },
            ])
        })
}
