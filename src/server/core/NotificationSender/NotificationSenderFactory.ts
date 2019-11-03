import { NotificationEvent } from "core/Notification/NotificationEvent"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { INotificationSender } from "./INotificationSender"
import { INotificationSenderFactory } from "./INotificationSenderFactory"
import { NotificationSender } from "./NotificationSender"

export class NotificationSenderFactory implements INotificationSenderFactory {
    public create() {
        return new NotificationSender()
    }
}
