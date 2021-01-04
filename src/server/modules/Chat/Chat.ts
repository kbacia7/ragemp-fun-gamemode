import { ChatModuleServerEvent } from "core/Chat/ChatModuleServerEvent"
import { ChatSpecialTabs } from "core/Chat/ChatSpecialTabs"
import { IEmojiList } from "core/Chat/EmojiList/IEmojiList"
import { IEscapeCharacters } from "core/Chat/Escape/IEscapeCharacters"
import { IChatMessageData } from "core/Chat/MessageData/IChatMessageData"
import { IChatMessageDataClient } from "core/Chat/MessageData/IChatMessageDataClient"
import { HTMLValidator } from "core/DataValidator/HTML/HTMLValidator"
import { IHTMLValidatorFactory } from "core/DataValidator/HTML/IHTMLValidatorFactory"
import { IDataValidator } from "core/DataValidator/IDataValidator"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { IRegExpFactory } from "core/RegExpFactory/IRegExpFactory"
import * as luxon from "luxon"
import random from "random"
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { CommandExecutor } from "../Commands/CommandExecutor"
import { IChatSpecialTabSender } from "./Senders/IChatSpecialTabSender"

export class Chat {
    constructor(
        playerDataFactory: IPlayerDataFactory, notificationSenderFactory: INotificationSenderFactory,
        htmlValidator: IDataValidator, chatMessageValidator: IDataValidator,
        htmlEscapeCharacters: IEscapeCharacters, emojiList: IEmojiList,
        commandExecutor: CommandExecutor,
        injectedSenders: {[tab: string]: IChatSpecialTabSender},
    ) {

        mp.events.add(ChatModuleServerEvent.SEND, (player: PlayerMp, messageClientDataAsJson: string) => {
            const messageClientData: IChatMessageDataClient = JSON.parse(messageClientDataAsJson)
            const playerData: IPlayerData = playerDataFactory.create().load(player)
            if (playerData.isLogged) {
                let message = messageClientData.message
                if (message.startsWith("!")) {
                    const commandArgs = message.split(" ")
                    const commandName = commandArgs[0].replace("!", "")
                    commandArgs.shift()
                    commandExecutor.executeCommand(player, commandName, commandArgs)
                    return
                }
                message = htmlEscapeCharacters.escape(message)
                if (!message.includes("!{") && !htmlValidator.validate(message) &&
                chatMessageValidator.validate(message)) {
                    message = emojiList.replaceEmoji(message)
                    if (message.length > 0) {
                        const messageId = random.int(1000000, 10000000).toString() +
                            luxon.DateTime.local().toMillis().toString()
                        const messageData: IChatMessageData = {
                            id: messageId, message, playerData,
                            sendDateTime:  luxon.DateTime.local().toLocaleString(
                                luxon.DateTime.DATETIME_SHORT_WITH_SECONDS,
                            ),
                            tab: messageClientData.tab,
                        }
                        if (messageClientData.tab in injectedSenders) {
                            injectedSenders[messageClientData.tab].send(player, messageData)
                        }
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
