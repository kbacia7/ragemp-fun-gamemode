import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerData } from "core/PlayerDataProps/PlayerData"
import { ActivePlayersEvents } from "./ActivePlayersEvents"
import { IActivePlayers } from "./IActivePlayers"

export class ActivePlayers implements IActivePlayers {
    private _playerDataFactory: IPlayerDataFactory = null
    constructor(playerDataFactory: IPlayerDataFactory) {
        this._playerDataFactory = playerDataFactory
        mp.events.add(ActivePlayersEvents.GET_ACTIVE_PLAYERS, (player: PlayerMp) => {
            this.sendPlayers(player)
        })
    }

    public sendPlayers(player: PlayerMp) {
        const playersData: IPlayerData[] = []
        mp.players.forEach((_player) => {
            const playerData: IPlayerData = this._playerDataFactory.create().load(_player)
            if (playerData.isLogged) {
                playersData.push(playerData)
            }
        })
        player.call(ActivePlayersEvents.LOAD_PLAYERS_TO_TABLE, [JSON.stringify(playersData)])
    }
}
