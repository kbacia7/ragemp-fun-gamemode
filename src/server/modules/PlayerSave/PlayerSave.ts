import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { PlayerDataStatus } from "core/PlayerDataProps/PlayerDataStatus"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { Player } from "server/entity/Player"
import { PlayerQuitEvents } from "./PlayerQuitEvents"

export class PlayerSave {
    constructor(apiManager: IAPIManager<Player>, playerDataFactory: IPlayerDataFactory) {
        mp.events.add("playerQuit", (player: PlayerMp) => {
            const playerData: IPlayerData = playerDataFactory.create().load(player)
            if (playerData.isLogged) {
                apiManager.send(APIRequests.PLAYER_SAVE, {
                    deaths: playerData.deaths,
                    exp: playerData.exp,
                    id: playerData.databaseId,
                    kills: playerData.kills,
                    level_id: playerData.level.level,
                    money: playerData.money,
                })
            }
            if (playerData.status === PlayerDataStatus.ON_EVENT) {
                mp.events.call(PlayerQuitEvents.PLAYER_QUIT_ON_EVENT, playerData)
            } else if (playerData.savedOnEvents.length > 0) {
                mp.events.call(PlayerQuitEvents.PLAYER_QUIT_SAVED_ON_EVENT, playerData)
            }
            if (playerData.status === PlayerDataStatus.ON_ARENA) {
                mp.events.call(PlayerQuitEvents.PLAYER_QUIT_ON_ARENA, playerData)
            }
        })
    }
}
