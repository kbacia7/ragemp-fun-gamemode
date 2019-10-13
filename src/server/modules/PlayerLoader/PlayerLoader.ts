import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"

export class PlayerLoader {
    constructor(playerDataFactory: IPlayerDataFactory) {
        mp.events.add("playerJoin", (player: PlayerMp) => {
            playerDataFactory.create().initialize(player)
        })
    }
}
