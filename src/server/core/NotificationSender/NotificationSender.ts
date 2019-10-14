import { NotificationEvent } from "core/Notification/NotificationEvent"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { INotificationSender } from "./INotificationSender"

export class NotificationSender implements INotificationSender {
    public send(toPlayer: PlayerMp, label: string, type: NotificationType, timeout: NotificationTimeout) {
        toPlayer.call(NotificationEvent.SEND, [label, type, timeout])
    }
}
