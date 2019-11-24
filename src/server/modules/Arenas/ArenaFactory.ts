import { Arena } from "./Arena"
import { IArenaData } from "./IArenaData"
import { IArenaFactory } from "./IArenaFactory"

export class ArenaFactory implements IArenaFactory {
    public create(data: IArenaData) {
        return new Arena(data)
    }
}
