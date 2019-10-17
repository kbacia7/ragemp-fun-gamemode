import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import Knex from "knex"
import { Player } from "server/entity/Player"

export class PlayerSave {
    constructor(knex: Knex, playerDataFactory: IPlayerDataFactory) {
        mp.events.add("playerQuit", (player: PlayerMp) => {
            const playerData: IPlayerData = playerDataFactory.create().load(player)
            if (playerData.isLogged && !playerData.playAsGuest) {
                Player.query()
                .patch({
                    deaths: playerData.deaths,
                    kills: playerData.kills,
                })
                .where("login", "LIKE", playerData.name)
                .execute()
            }
        })
    }
}
