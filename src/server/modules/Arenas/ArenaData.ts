import { ArenaType } from "./ArenaType"
import { IArenaData } from "./IArenaData"

export class ArenaData implements IArenaData {
    public get name() {
        return this._name
    }
    public get displayName() {
        return this._displayName
    }
    public get type() {
        return this._type
    }
    public get maxPlayers() {
        return this._maxPlayers
    }

    public actualPlayers: number

    private _name: string

    private _displayName: string

    private _type: ArenaType

    private _maxPlayers: number

    constructor(
        name: string,
        displayName: string,
        type: ArenaType,
        actualPlayers: number,
        maxPlayers: number,
    ) {
        this._name = name
        this._displayName = displayName
        this._type = type
        this._maxPlayers = maxPlayers
        this.actualPlayers = actualPlayers
    }

    public toJSON() {
        const obj: any = {}
        obj.name = this._name
        obj.displayName = this._displayName
        obj.type = this._type
        obj.actualPlayers = this.actualPlayers
        obj.maxPlayers = this._maxPlayers
        return obj
    }
}
