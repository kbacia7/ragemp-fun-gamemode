import { ChatSpecialTabs } from "core/Chat/ChatSpecialTabs"
import { IChatMessageData } from "core/Chat/MessageData/IChatMessageData"
import { INotificationData } from "core/Notification/INotificationData"
import { NotificationEvent } from "core/Notification/NotificationEvent"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import * as luxon from "luxon"
import random from "random"
import { IChatSpecialTabSender } from "server/modules/Chat/Senders/IChatSpecialTabSender"
import { INotificationSender } from "./INotificationSender"
import { INotificationSenderFactory } from "./INotificationSenderFactory"

export class NotificationSenderFromClient implements INotificationSender {
    private _notificationSender: INotificationSender = null
    constructor(notificationSenderFactory: INotificationSenderFactory) {
        this._notificationSender = notificationSenderFactory.create()

        mp.events.add(NotificationEvent.CALL_FROM_CLIENT, (playerMp: PlayerMp, notificationDataAsJson: string) => {
            const notificationData: INotificationData = JSON.parse(notificationDataAsJson)
            this.send(
                playerMp, notificationData.label, notificationData.type, notificationData.timeout,
                notificationData.extraParams,
            )
        })
    }

    public send(
        toPlayer: PlayerMp,
        label: string,
        type: NotificationType,
        timeout: NotificationTimeout,
        extraParams: string[] = [],
    ) {
        this._notificationSender.send(toPlayer, label, type, timeout, extraParams)
    }
}
