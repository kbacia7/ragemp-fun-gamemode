import { IArenaData } from "./IArenaData"

export interface IArena {
    data: IArenaData,
    spawnPlayer: (playerMp) => void
}
