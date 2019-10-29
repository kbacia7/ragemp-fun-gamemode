import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { Module } from "../Module"
import { FreezePlayerModule } from "./FreezePlayerModule"
import { IFreezePlayerModuleFactory } from "./IFreezePlayerModuleFactory"

export class FreezePlayerModuleFactory implements IFreezePlayerModuleFactory {
    private _promiseFactory: IPromiseFactory<boolean> = null
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        this._promiseFactory = promiseFactory
    }
    public create() {
        return new FreezePlayerModule(this._promiseFactory)
    }
}
