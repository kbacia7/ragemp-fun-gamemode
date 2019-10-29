import {
    AutomaticEventLoadArenaNotImplemented,
} from "core/exception/AutomaticEvent/AutomaticEventLoadArenaNotImplemented"
import { Dimension } from "server/core/Dimension/Dimension"
import { Player } from "server/entity/Player"
import { AutomaticEventType } from "./AutomaticEventType"
import { IAutomaticEventData } from "./IAutomaticEventData"

export class AutomaticEventData implements IAutomaticEventData {
    public get name() {
        return this._name
    }
    public get displayName() {
        return this._displayName
    }
    public get type() {
        return this._type
    }
    public get minPlayers() {
        return this._minPlayers
    }
    public get maxPlayers() {
        return this._maxPlayers
    }
    public get minExp() {
        return this._minExp
    }
    public get maxExp() {
        return this._maxExp
    }
    public get minMoney() {
        return this._minMoney
    }
    public get maxMoney() {
        return this._maxMoney
    }

    public actualPlayers: number

    private _name: string

    private _displayName: string

    private _type: AutomaticEventType

    private _minPlayers: number

    private _maxPlayers: number

    private _minExp: number

    private _maxExp: number

    private _minMoney: number

    private _maxMoney: number

    constructor(
        name: string,
        displayName: string,
        type: AutomaticEventType,
        minPlayers: number,
        actualPlayers: number,
        maxPlayers: number,
        minExp: number,
        maxExp: number,
        minMoney: number,
        maxMoney: number,
    ) {
        this._name = name
        this._displayName = displayName
        this._type = type
        this._minPlayers = minPlayers
        this._maxPlayers = maxPlayers
        this._minExp = minExp
        this._maxExp = maxExp
        this._minMoney  = minMoney
        this._maxMoney = maxMoney
        this.actualPlayers = actualPlayers
    }

    public toJSON() {
        const obj: any = {}
        obj.name = this._name
        obj.displayName = this._displayName
        obj.type = this._type
        obj.minPlayers = this._minPlayers
        obj.actualPlayers = this.actualPlayers
        obj.maxPlayers = this._maxPlayers
        obj.minExp = this._minExp
        obj.maxExp = this._maxExp
        obj.minMoney = this._minMoney
        obj.maxMoney = this._maxMoney
        return obj
    }
}
