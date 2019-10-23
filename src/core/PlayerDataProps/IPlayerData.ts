import { AutomaticEventType } from "server/modules/AutomaticEvents/AutomaticEventType"
import { PlayerDataStatus } from "./PlayerDataStatus"

export interface IPlayerData {
    id: number,
    rank: string,
    kills: number,
    deaths: number,
    status: PlayerDataStatus,
    ping: number,
    name: string,
    isLogged: boolean,
    playAsGuest: boolean,
    nameColor: string,
    savedOnEvents: AutomaticEventType[]
    ped: number,
    initialize: (player: PlayerMp) => void
    load: (player: PlayerMp) => IPlayerData
    sync: (player: PlayerMp) => void
}
