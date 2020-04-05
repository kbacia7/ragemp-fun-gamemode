import { Item } from "server/entity/Item"
import { PlayerItem } from "server/entity/PlayerItem"
import { Rank } from "server/entity/Rank"
import { ArenaType } from "server/modules/Arenas/ArenaType"
import { AutomaticEventType } from "server/modules/AutomaticEvents/AutomaticEventType"
import { PlayerDataStatus } from "./PlayerDataStatus"

export interface IPlayerData {
    id: number,
    databaseId: number,
    rank: Rank,
    rankName: string,
    kills: number,
    deaths: number,
    diamonds: number,
    money: number,
    status: PlayerDataStatus,
    ping: number,
    name: string,
    isLogged: boolean,
    playAsGuest: boolean,
    nameColor: string,
    savedOnEvents: AutomaticEventType[],
    onEvent: AutomaticEventType,
    onArena: ArenaType,
    items: PlayerItem[],
    ped: number,
    initialize: (player: PlayerMp) => void
    load: (player: PlayerMp) => IPlayerData
    sync: (player: PlayerMp) => void
}
