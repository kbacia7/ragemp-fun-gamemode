import { PlayerDataLoaderEvents } from "core/PlayerDataLoader/PlayerDataLoaderEvents"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"

export class PlayerDataLoader {
    constructor(playerDataFactory: IPlayerDataFactory) {
        mp.events.add(PlayerDataLoaderEvents.GET_PLAYER_DATA, (player: PlayerMp) => {
            const playerData: IPlayerData =  playerDataFactory.create().load(player)
            player.call(PlayerDataLoaderEvents.PROVIDE_PLAYER_DATA, [JSON.stringify(playerData)])
        })
    }
}
