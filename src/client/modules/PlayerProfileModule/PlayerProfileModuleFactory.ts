import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { Module } from "../Module"
import { IPlayerProfileModuleFactory } from "./IPlayerProfileModuleFactory"
import { PlayerProfileModule } from "./PlayerProfileModule"

export class PlayerProfileModuleFactory implements IPlayerProfileModuleFactory {
    private _promiseFactory: IPromiseFactory<boolean> = null
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        this._promiseFactory = promiseFactory
    }
    public create() {
        return new PlayerProfileModule(this._promiseFactory)
    }
}
