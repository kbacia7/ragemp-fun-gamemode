import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { IActivePlayersTableModuleFactory } from "../ActivePlayersTableModule/IActivePlayersTableModuleFactory"
import { Module } from "../Module"
import { ActionsMenuModule } from "./ActionsMenuModule"
import { IActionsMenuModuleFactory } from "./IActionsMenuModuleFactory"

export class ActionsMenuModuleFactory implements IActionsMenuModuleFactory {
    private _promiseFactory: IPromiseFactory<boolean> = null
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        this._promiseFactory = promiseFactory
    }

    public create() {
        return new ActionsMenuModule(this._promiseFactory)
    }
}
