import { ChangePlayerPedModuleEvents } from "client/modules/ChangePlayerPedModule/ChangePlayerPedModuleEvents"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataStatus } from "core/PlayerDataProps/PlayerDataStatus"
import Knex from "knex"
import random from "random"
import { Dimension } from "server/core/Dimension/Dimension"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { PlayerSpawn } from "server/entity/PlayerSpawn"
import { PlayerSpawnManagerEvents } from "./PlayerSpawnManagerEvents"

export class PlayerSpawnManager {
    private _spawns: PlayerSpawn[] = []
    constructor(knex: Knex, vector3Factory: IVector3Factory, playerDataFactory: IPlayerDataFactory) {
        PlayerSpawn.query()
            .select()
            .then((spawns: PlayerSpawn[]) =>  {
                this._spawns = spawns
            })

        mp.events.add("playerDeath", (playerMp: PlayerMp) => {
            const playerData = playerDataFactory.create().load(playerMp)
            if (playerData.status === PlayerDataStatus.ACTIVE) {
                mp.events.call(PlayerSpawnManagerEvents.FORCE_RESPAWN, playerMp)
            }
        })

        mp.events.add(PlayerSpawnManagerEvents.FORCE_RESPAWN, (playerMp: PlayerMp) => {
            const playerData = playerDataFactory.create().load(playerMp)
            const spawnId = random.int(0, this._spawns.length - 1)
            playerMp.dimension = Dimension.NORMAL
            playerMp.spawn(
                vector3Factory.create(
                    this._spawns[spawnId].x,
                    this._spawns[spawnId].y,
                    this._spawns[spawnId].z,
                ),
            )
            playerMp.call(ChangePlayerPedModuleEvents.CHANGE_PED, [playerData.ped])
        })
    }
}
