import { ArenaType } from "./ArenaType"

export interface IArenaData {
    minPlayers: number
    actualPlayers: number
    maxPlayers: number
    name: string
    displayName: string
    type: ArenaType
}
