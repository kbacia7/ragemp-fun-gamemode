import { HTMLValidator } from "core/DataValidator/HTML/HTMLValidator"
import { IHTMLValidatorFactory } from "core/DataValidator/HTML/IHTMLValidatorFactory"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import emojiEssential from "emoji-essential"
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import twemoji from "twemoji"
import { IRegExpFactory } from "core/RegExpFactory/IRegExpFactory"
export class Chat {
    constructor(
        playerDataFactory: IPlayerDataFactory, notificationSenderFactory: INotificationSenderFactory,
        htmlValidator: HTMLValidator, regexpFactory: IRegExpFactory
    ) {
        mp.events.add("playerChat", (player: PlayerMp, message: string) => {
            const playerData: IPlayerData = playerDataFactory.create().load(player)
            if (playerData.isLogged) {
                const senderColor: string = playerData.nameColor
                const senderName: string = playerData.name
                if (!message.includes("!{") && !htmlValidator.validate(message)) {
                    const name2emoji = {}
                    const regexToRemoveEmojis = regexpFactory.create([
                        "([\\u2700-\\u27BF]|[\\uE000-\\uF8FF]|\\uD83C[\\uDC00-\\uDFFF]|\\uD83D[\\uDC00-\\uDFFF]",
                        "|[\\u2011-\\u26FF]|\\uD83E[\\uDD10-\\uDDFF])"
                    ].join(), "g")
                    Object.keys(emojiEssential).forEach((group) => {
                        Object.keys(emojiEssential[group]).forEach((sub) => {
                            Object.keys(emojiEssential[group][sub]).forEach((emoji) => {
                                let key = emojiEssential[group][sub][emoji].replace(regexToRemoveEmojis, '').trimStart().replace(/[ :]+/g, "_")
                                key = `:${key}:`
                                name2emoji[key] = emoji
                                name2emoji[emoji] = key
                            })
                        })
                    })
                    const matches = message.match(/:[A-Z_a-z]+:/gm)
                    if (matches && matches.length > 0) {
                        matches.forEach((toReplace: string) => {
                            if (name2emoji[toReplace]) {
                                message = message.replace(toReplace, name2emoji[toReplace])
                            }
                        })
                    }
                    const newMessage = twemoji.parse(message, {
                        size: 72,
                    })
                    if (newMessage.length !== message.length) {
                        message = newMessage
                        message = message.replace(/\"/g, "'")
                        message = message.replace("draggable", "style='width:16px;height:16px' draggable")
                    }
                    message = message.replace(regexToRemoveEmojis, '').trim()
                    if(message.length > 0) {
                        mp.players.forEach((sendMessageTo: PlayerMp) => {
                            console.log(message)
                            sendMessageTo.outputChatBox(`!{${senderColor}}${senderName}!{#FFFFFF}: ${message}`)
                        })
                    }
                } else {
                    notificationSenderFactory.create().send(
                        player, "NOTIFICATION_CHAT_INCORRECT_VALUE",
                        NotificationType.ERROR, NotificationTimeout.NORMAL,
                    )
                }
            }
        })
    }
}
