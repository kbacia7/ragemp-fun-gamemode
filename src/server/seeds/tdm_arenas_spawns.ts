import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    // tslint:disable: object-literal-sort-keys
    return knex("tdm_arenas_spawns").del()
        .then(() => {
            // Inserts seed entries
            return knex("tdm_arenas_spawns").insert([
                {
                    id: 1,
                    x:  49.87059020996094,
                    y: -176.3221893310547,
                    z:  55.01280975341797,
                    team: 1,
                    arenaId: 1,
                },
                {
                    id: 2,
                    x: 42.10279846191406,
                    y:  -171.94216918945312,
                    z:  55.2349967956543,
                    team: 1,
                    arenaId: 1,
                },
                {
                    id: 3,
                    x: 32.87093734741211,
                    y: -219.02822875976562,
                    z: 51.249977111816406,
                    team: 1,
                    arenaId: 1,
                },
                {
                    id: 4,
                    x: 38.51408767700195,
                    y: -221.5759735107422,
                    z: 51.0904541015625,
                    team: 1,
                    arenaId: 1,
                },
            ])
        })
}
