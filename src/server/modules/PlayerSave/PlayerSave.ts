import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { PlayerDataStatus } from "core/PlayerDataProps/PlayerDataStatus"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import { IAPIManager } from "server/core/API/IAPIManager"
import { PlayerQuitEvents } from "./PlayerQuitEvents"

export class PlayerSave {
    constructor(apiManager: IAPIManager<object>, playerDataFactory: IPlayerDataFactory) {
        mp.events.add("playerQuit", (player: PlayerMp) => {
            const playerData: IPlayerData = playerDataFactory.create().load(player)
            if (playerData.isLogged && !playerData.playAsGuest) {
               /* Player.query()
                .patch({
                    deaths: playerData.deaths,
                    kills: playerData.kills,
                    ped: playerData.ped,
                })
                .where("login", "LIKE", playerData.name)
                .execute()*/
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
