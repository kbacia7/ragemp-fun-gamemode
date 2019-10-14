import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { Module } from "../Module"
import { INotificationModuleFactory } from "./INotificationModuleFactory"
import { NotificationModule } from "./NotificationModule"

export class NotificationModuleFactory implements INotificationModuleFactory {
    private _promiseFactory: IPromiseFactory<boolean> = null
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        this._promiseFactory = promiseFactory
    }

    public create() {
        return new NotificationModule(this._promiseFactory)
    }
}
