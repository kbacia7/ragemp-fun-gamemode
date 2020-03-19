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

export class NotificationSender implements INotificationSender {
    private _notificationTabSender: IChatSpecialTabSender = null
    constructor(notificationTabSender: IChatSpecialTabSender) {
        this._notificationTabSender = notificationTabSender
    }

    public send(
        toPlayer: PlayerMp,
        label: string,
        type: NotificationType,
        timeout: NotificationTimeout,
        extraParams: string[] = [],
    ) {
        const messageId = random.int(1000000, 10000000).toString() +
                            luxon.DateTime.local().toMillis().toString()

        const typesToColors = {
            [NotificationType.ERROR]: "#E34428",
            [NotificationType.INFO]: "#17CACF",
            [NotificationType.SUCCESS]: "#62B693",
            [NotificationType.WARNING]: "#F5C45B",
        }
        const time: string = luxon.DateTime.local().toLocaleString(luxon.DateTime.DATETIME_SHORT_WITH_SECONDS)
        if (type in typesToColors) {
            const message: string = label
            const messageData: IChatMessageData = {
                color: typesToColors[type],
                extraParams:  JSON.stringify(extraParams),
                id: messageId,
                message, playerData: null,
                sendDateTime:  time,
                tab: ChatSpecialTabs.NOTIFICATIONS,
            }
            this._notificationTabSender.send(toPlayer, messageData)
        }

        const notificationData: INotificationData = {
            extraParams,
            label, timeout, type,
        }
        toPlayer.call(NotificationEvent.SEND, [JSON.stringify(notificationData)])
    }
}
