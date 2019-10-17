import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"

export class Chat {
    constructor(playerDataFactory: IPlayerDataFactory, notificationSender: INotificationSender) {
        mp.events.add("playerChat", (player: PlayerMp, message: string) => {
            const playerData: IPlayerData = playerDataFactory.create().load(player)
            if (playerData.isLogged) {
                const senderColor: string = playerData.nameColor
                const senderName: string = playerData.name
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
            }
        })
    }
}
