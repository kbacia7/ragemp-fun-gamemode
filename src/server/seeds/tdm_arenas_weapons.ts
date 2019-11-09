import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    // tslint:disable: object-literal-sort-keys
    return knex("tdm_arenas_weapons").del()
        .then(() => {
            // Inserts seed entries
            return knex("tdm_arenas_weapons").insert([
                {
                    id: 1,
                    weaponId: 0xBFE256D4,
                    ammo: 0,
                    arenaId: 1,
                },
                {
                    id: 2,
                    weaponId: 0x78A97CD0,
                    ammo: 0,
                    arenaId: 1,
                },
                {
                    id: 3,
                    weaponId: 0x4DD2DC56,
                    ammo: 10,
                    arenaId: 1,
                },
            ])
        })
}
