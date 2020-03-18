import { NotificationEvent } from "core/Notification/NotificationEvent"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IChatSpecialTabSender } from "server/modules/Chat/Senders/IChatSpecialTabSender"
import { INotificationSender } from "./INotificationSender"
import { INotificationSenderFactory } from "./INotificationSenderFactory"
import { NotificationSender } from "./NotificationSender"

export class NotificationSenderFactory implements INotificationSenderFactory {
    private _notificationTabSender: IChatSpecialTabSender = null
    constructor(notificationTabSender: IChatSpecialTabSender) {
        this._notificationTabSender = notificationTabSender
    }
    public create() {
        return new NotificationSender(this._notificationTabSender)
    }
}
