import { ArenaSpawnPlayerNotImplemented } from "core/exception/Arena/ArenaSpawnPlayerNotImplemented"
import { Dimension } from "server/core/Dimension/Dimension"
import { IArena } from "./IArena"
import { IArenaData } from "./IArenaData"

export class Arena implements IArena {
    protected _data: IArenaData
    protected _dimension: number = 0
    public get data() {
        return this._data
    }

    constructor(data: IArenaData) {
        this._data = data
        this._dimension = Dimension.ARENAS + this._data.type
    }

    public spawnPlayer(playerMp) {
        throw new ArenaSpawnPlayerNotImplemented()
    }
}
