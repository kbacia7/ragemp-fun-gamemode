import { NotificationTimeout } from "./NotificationTimeout"
import { NotificationType } from "./NotificationType"

export interface INotificationData {
    label: string,
    type: NotificationType,
    timeout: NotificationTimeout,
    extraParams: string[]
}
