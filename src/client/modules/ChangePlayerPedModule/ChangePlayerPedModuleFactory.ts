import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { ChangePlayerPedModule } from "./ChangePlayerPedModule"
import { IChangePlayerPedModuleFactory } from "./IChangePlayerPedModuleFactory"

export class ChangePlayerPedModuleFactory implements IChangePlayerPedModuleFactory {
    private _promiseFactory: IPromiseFactory<boolean> = null
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        this._promiseFactory = promiseFactory
    }
    public create() {
        return new ChangePlayerPedModule(this._promiseFactory)
    }
}
