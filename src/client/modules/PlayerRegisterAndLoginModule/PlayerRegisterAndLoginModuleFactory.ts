import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { Module } from "../Module"
import { IPlayerRegisterAndLoginModuleFactory } from "./IPlayerRegisterAndLoginModuleFactory"
import { PlayerRegisterAndLoginModule } from "./PlayerRegisterAndLoginModule"

export class PlayerRegisterAndLoginModuleFactory implements IPlayerRegisterAndLoginModuleFactory {
    private _promiseFactory: IPromiseFactory<boolean> = null
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        this._promiseFactory = promiseFactory
    }

    public create() {
        return new PlayerRegisterAndLoginModule(this._promiseFactory)
    }
}
