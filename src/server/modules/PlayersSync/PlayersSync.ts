import { PlayerDataLoaderEvents } from "core/PlayerDataLoader/PlayerDataLoaderEvents"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import * as luxon from "luxon"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { Level } from "server/entity/Level"

export class PlayersSync {
    constructor(apiManager: IAPIManager<Level>, playerDataFactory: IPlayerDataFactory) {
        apiManager.query(APIRequests.LEVELS).then((levels: Level[]) => {
            setInterval(() => {
                mp.players.forEach((p: PlayerMp) => {
                    p.setVariable(PlayerDataProps.ONLINE_TIME,
                        luxon.DateTime.local().toMillis() - p.getVariable(PlayerDataProps.START_PLAY_TIME),
                    )
                    p.setVariable(PlayerDataProps.PING, p.ping)
                    let playerData: IPlayerData =  playerDataFactory.create().load(p)
                    if (playerData.level.required_exp !== null && playerData.exp >= playerData.level.required_exp) {
                        p.setVariable(PlayerDataProps.EXP, playerData.exp - playerData.level.required_exp)
                        // bo indeksy są od 0 w tablicy, takie przypomnienie, dlatego jest level ale nie ma +1
                        p.setVariable(PlayerDataProps.LEVEL, levels[playerData.level.level])
                        playerData =  playerDataFactory.create().load(p)
                    }
                    p.call(PlayerDataLoaderEvents.PROVIDE_PLAYER_DATA, [JSON.stringify(playerData)])
                })
            }, 1000)
        })

    }
}
