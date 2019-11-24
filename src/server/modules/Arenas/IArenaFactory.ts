import { Arena } from "./Arena"
import { IArenaData } from "./IArenaData"

export interface IArenaFactory {
    create: (arenaData: IArenaData) => Arena
}
