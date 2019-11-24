import { ArenaType } from "./ArenaType"
import { IArenaData } from "./IArenaData"

export interface IArenaDataFactory {
    create: (
        name: string,
        displayName: string,
        type: ArenaType,
        minPlayers: number,
        actualPlayers: number,
        maxPlayers: number,
    ) => IArenaData
}
