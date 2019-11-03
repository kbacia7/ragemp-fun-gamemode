import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"

export interface INotificationSender {
    send: (
        toPlayer: PlayerMp,
        label: string,
        type: NotificationType,
        timeout: NotificationTimeout,
        extraParams?: string[],
    ) => void
}
