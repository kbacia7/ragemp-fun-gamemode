import { ArenaType } from "./ArenaType"

export interface IArenaData {
    actualPlayers: number
    maxPlayers: number
    name: string
    displayName: string
    type: ArenaType
}
