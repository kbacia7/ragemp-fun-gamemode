import { IArenaData } from "./IArenaData"

export interface IArena {
    data: IArenaData,
    loadArena: () => void,
    spawnPlayer: (playerMp: PlayerMp, firstSpawn: boolean) => void
}
