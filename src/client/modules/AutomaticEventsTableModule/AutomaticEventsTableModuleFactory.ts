import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { Module } from "../Module"
import { AutomaticEventsTableModule } from "./AutomaticEventsTableModule"
import { IAutomaticEventsTableModuleFactory } from "./IAutomaticEventsTableModuleFactory"

export class AutomaticEventsTableModuleFactory implements IAutomaticEventsTableModuleFactory {
    private _promiseFactory: IPromiseFactory<boolean> = null
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        this._promiseFactory = promiseFactory
    }
    public create() {
        return new AutomaticEventsTableModule(this._promiseFactory)
    }
}
