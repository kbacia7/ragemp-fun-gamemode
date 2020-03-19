import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { Keys } from "client/core/KeyboardManager/Keys"
import { INotificationData } from "core/Notification/INotificationData"
import { NotificationEvent } from "core/Notification/NotificationEvent"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { Module } from "./../Module"

export class NotificationModule extends Module {
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        super(promiseFactory)
        this._name = "notifications"
        mp.events.add(NotificationEvent.SEND, (
            notificationDataAsJson: string,
        ) => {
            const notificationData: INotificationData = JSON.parse(notificationDataAsJson)
            this._sendNotification(
                notificationData.label, notificationData.type, notificationData.timeout, notificationData.extraParams,
            )
        })
    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            super.loadUI().then((loaded) => {
                resolve(loaded)
            })
        })

    }

    public destroyUI() {
        return this._promiseFactory.create((resolve) => {
            super.destroyUI().then((result) => {
                resolve(result)
            })
        })
    }

    private _sendNotification(label: string, type: NotificationType, timeout: NotificationTimeout, args: string[]) {
        this._currentWindow.execute(`sendNotification('${label}', '${type}', ${timeout}, '${JSON.stringify(args)}')`)
    }
}
