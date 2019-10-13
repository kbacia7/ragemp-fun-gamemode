import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { Module } from "../Module"
import { ActivePlayersTableModule } from "./ActivePlayersTableModule"

export class ActivePlayersTableModuleFactory {
    private _activePlayersLoader: IActivePlayersLoader = null
    private _promiseFactory: IPromiseFactory<boolean> = null
    constructor(promiseFactory: IPromiseFactory<boolean>, activePlayersLoader: IActivePlayersLoader) {
        this._activePlayersLoader = activePlayersLoader
        this._promiseFactory = promiseFactory
    }
    public create() {
        return new ActivePlayersTableModule(this._promiseFactory, this._activePlayersLoader)
    }
}
