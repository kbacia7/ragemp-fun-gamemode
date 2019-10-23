import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { INotificationSender } from "./INotificationSender"

export interface INotificationSenderFactory {
    create: () => INotificationSender
}
