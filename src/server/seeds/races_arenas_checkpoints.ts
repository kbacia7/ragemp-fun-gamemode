import * as Knex from "knex"

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    return knex("races_arenas_checkpoints").del()
        .then(() => {
            // Inserts seed entries
            return knex("races_arenas_checkpoints").insert([
                { id: 1, x: 21.245765686035156, y: -60.930843353271484, z: 63.44302368164062, arenaId: 1 },
                { id: 2, x: 49.187255859375, y: -52.544837951660156, z: 69.13114929199219, arenaId: 1 },
                { id: 3, x: 69.56294250488281, y: -65.63902282714844, z: 68.90031433105469, arenaId: 1 },
                { id: 4, x: 53.06062316894531, y: -79.34321594238281, z: 63.44511032104492, arenaId: 1 },
                { id: 5, x: 16.871932983398438, y: -74.70108032226562, z: 60.914710998535156, arenaId: 1 },
                { id: 6, x: 8.030353546142578, y: -134.08493041992188, z: 56.314964294433594, arenaId: 1 },
                { id: 7, x: 214.17367553710938, y: -215.62742614746094, z: 54.03910446166992, arenaId: 1 },
            ])
        })
}
