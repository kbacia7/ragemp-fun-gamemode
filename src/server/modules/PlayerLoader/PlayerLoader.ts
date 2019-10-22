import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import Knex from "knex"
import { Player } from "server/entity/Player"

export class PlayerLoader {
    constructor(knex: Knex, playerDataFactory: IPlayerDataFactory) {
        mp.events.add("playerJoin", (player: PlayerMp) => {
            playerDataFactory.create().initialize(player)
            player.call(PlayerRegisterEvent.DISPLAY_GUI)
        })

        mp.events.add("playerStartPlay", (playerMp: PlayerMp, login: string) => {
            Player.query()
                 .select("*")
                 .where("login", "LIKE", login)
                 .then((players: Player[]) => {
                     const player: Player = players[0]
                     if (players.length > 0) {
                        playerMp.setVariable(PlayerDataProps.KILLS, player.kills)
                        playerMp.setVariable(PlayerDataProps.DEATHS, player.deaths)
                        playerMp.setVariable(PlayerDataProps.RANK, player.rank)
                        playerMp.setVariable(PlayerDataProps.PED, player.ped)
                    } else {
                        playerMp.setVariable(PlayerDataProps.PLAY_AS_GUEST, true)
                        playerMp.setVariable(PlayerDataProps.RANK, "Gość")
                        playerMp.setVariable(PlayerDataProps.PED, 0x7E0961B8)
                    }
                     playerMp.setVariable(PlayerDataProps.NAME, login)
                     playerMp.setVariable(PlayerDataProps.ISLOGGED, true)
                     const playerData: IPlayerData = playerDataFactory.create().load(playerMp)
                     playerMp.call("playerStartPlay", [JSON.stringify(playerData)])
                 })
        })
    }
}
