import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { IActivePlayersTableModuleFactory } from "../ActivePlayersTableModule/IActivePlayersTableModuleFactory"
import { Module } from "../Module"
import { CommandListenerModule } from "./CommandListenerModule"
import { ICommandListenerModuleFactory } from "./ICommandListenerModuleFactory"

export class CommandListenerModuleFactory implements ICommandListenerModuleFactory {
    private _promiseFactory: IPromiseFactory<boolean> = null
    private _activePlayersTableModuleFactory: IActivePlayersTableModuleFactory = null
    constructor(
        promiseFactory: IPromiseFactory<boolean>,
        activePlayersTableModuleFactory: IActivePlayersTableModuleFactory,
    ) {
        this._promiseFactory = promiseFactory
        this._activePlayersTableModuleFactory = activePlayersTableModuleFactory
    }

    public create() {
        return new CommandListenerModule(this._promiseFactory, this._activePlayersTableModuleFactory)
    }
}
