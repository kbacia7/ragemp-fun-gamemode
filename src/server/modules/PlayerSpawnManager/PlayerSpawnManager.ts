import { ChangePlayerPedModuleEvents } from "client/modules/ChangePlayerPedModule/ChangePlayerPedModuleEvents"
import { ItemsSectionsNames } from "core/ItemsSectionsNames/ItemsSectionsNames"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataStatus } from "core/PlayerDataProps/PlayerDataStatus"
import random from "random"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { IBlipFactory } from "server/core/BlipFactory/IBlipFactory"
import { Dimension } from "server/core/Dimension/Dimension"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { PlayerItem } from "server/entity/PlayerItem"
import { PlayerSpawn } from "server/entity/PlayerSpawn"
import { PlayerSpawnManagerEvents } from "./PlayerSpawnManagerEvents"

export class PlayerSpawnManager {
    private _spawns: PlayerSpawn[] = []
    constructor(
        apiManager: IAPIManager<PlayerSpawn>,
        vector3Factory: IVector3Factory,
        playerDataFactory: IPlayerDataFactory,
    ) {
        apiManager.query(APIRequests.PLAYER_SPAWN).then((spawns: PlayerSpawn[]) => {
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
            playerMp.removeAllWeapons()

            const spawnId = random.int(0, this._spawns.length - 1)
            playerMp.dimension = Dimension.NORMAL
            playerMp.spawn(
                vector3Factory.create(
                    this._spawns[spawnId].x,
                    this._spawns[spawnId].y,
                    this._spawns[spawnId].z,
                ),
            )
            const weaponsOnSpawn: number[] = playerData.items.filter(
                (playerItem: PlayerItem) =>
                    playerItem.item.section.name === ItemsSectionsNames.WEAPON && playerItem.equipped,
            ).map((playerItem) => playerItem.item.ragemp_item_id)

            const skinOnSpawn: number[] = playerData.items.filter(
                (playerItem: PlayerItem) =>
                    playerItem.item.section.name === ItemsSectionsNames.SKIN && playerItem.equipped,
            ).map((playerItem) => playerItem.item.ragemp_item_id)

            let ped = 0x0DE9A30A
            if (skinOnSpawn.length > 0) {
                ped = skinOnSpawn[0]
            }
            playerMp.call(ChangePlayerPedModuleEvents.CHANGE_PED, [ped])
            weaponsOnSpawn.forEach((weaponId) => {
                playerMp.giveWeapon(weaponId, 99999999)
            })
        })
    }
}
