import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import { IAPIManager } from "server/core/API/IAPIManager"
import { Player } from "server/entity/Player"
import { PlayerSpawnManagerEvents } from "../PlayerSpawnManager/PlayerSpawnManagerEvents"

export class PlayerLoader {
    constructor(apiManager: IAPIManager<Player>, playerDataFactory: IPlayerDataFactory) {
        mp.events.add("playerJoin", (player: PlayerMp) => {
            playerDataFactory.create().initialize(player)
            player.call(PlayerRegisterEvent.DISPLAY_GUI)
        })

        mp.events.add("playerStartPlay", (playerMp: PlayerMp, login: string, data: Player) => {
            console.log(data)
            if (data) {
                playerMp.setVariable(PlayerDataProps.KILLS, data.kills)
                playerMp.setVariable(PlayerDataProps.DEATHS, data.deaths)
                playerMp.setVariable(PlayerDataProps.RANK, data.rank)
                playerMp.setVariable(PlayerDataProps.RANK_NAME, data.rank.name)
                playerMp.setVariable(PlayerDataProps.MONEY, data.money)
                playerMp.setVariable(PlayerDataProps.DIAMONDS, data.diamonds)
                playerMp.setVariable(PlayerDataProps.ITEMS, data.player_items)
                playerMp.setVariable(PlayerDataProps.DATABASE_ID, data.id)
            } else {
                playerMp.setVariable(PlayerDataProps.PLAY_AS_GUEST, true)
                playerMp.setVariable(PlayerDataProps.RANK_NAME, "Gość")
                playerMp.setVariable(PlayerDataProps.MONEY, 0)
                playerMp.setVariable(PlayerDataProps.DIAMONDS, 0)
                playerMp.setVariable(PlayerDataProps.DATABASE_ID, 0)
            }
            playerMp.setVariable(PlayerDataProps.NAME, login)
            playerMp.setVariable(PlayerDataProps.ISLOGGED, true)
            const playerData: IPlayerData = playerDataFactory.create().load(playerMp)
            console.log("p")
            console.log(playerData)
            playerMp.call("playerStartPlay", [JSON.stringify(playerData)])
            mp.events.call(PlayerSpawnManagerEvents.FORCE_RESPAWN, playerMp)
        })
    }
}
