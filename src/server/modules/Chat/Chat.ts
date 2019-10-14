import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"

export class Chat {
    constructor(notificationSender: INotificationSender) {
        mp.events.add("playerChat", (player: PlayerMp, message: string) => {
            const senderColor: string = player.getVariable(PlayerDataProps.NAMECOLOR)
            const senderName: string = player.getVariable(PlayerDataProps.NAME)
            if (!message.includes("!{")) {
                mp.players.forEach((sendMessageTo: PlayerMp) => {
                    sendMessageTo.outputChatBox(`!{${senderColor}}${senderName}!{#FFFFFF}: ${message}`)
                })
            } else {
                notificationSender.send(
                    player, "NOTIFICATION_CHAT_INCORRECT_VALUE",
                    NotificationType.ERROR, NotificationTimeout.NORMAL,
                )
            }
        })
    }
}
