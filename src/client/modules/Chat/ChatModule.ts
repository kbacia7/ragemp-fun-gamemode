import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { Keys } from "client/core/KeyboardManager/Keys"
import { ChatModuleServerEvent } from "core/Chat/ChatModuleServerEvent"
import { IEscapeCharacters } from "core/Chat/Escape/IEscapeCharacters"
import { IChatMessageData } from "core/Chat/MessageData/IChatMessageData"
import { IChatMessageDataClient } from "core/Chat/MessageData/IChatMessageDataClient"
import { HTMLValidator } from "core/DataValidator/HTML/HTMLValidator"
import { IDataValidator } from "core/DataValidator/IDataValidator"
import { NotificationEvent } from "core/Notification/NotificationEvent"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { Module } from "./../Module"
import { ChatModuleEvent } from "./ChatModuleEvent"

export class ChatModule extends Module {
    constructor(promiseFactory: IPromiseFactory<boolean>,
                htmlValidator: IDataValidator,
                chatMessageValidator: IDataValidator,
                htmlEscapeCharacters: IEscapeCharacters) {
        super(promiseFactory)
        this._name = "chat"

        mp.events.add(ChatModuleEvent.FAILED_SHOW_INPUT, () => {
            mp.gui.cursor.show(false, false)
        })

        mp.events.add(ChatModuleEvent.TRY_SEND_MESSAGE,
            (message: string, tab: string) => {
                message = htmlEscapeCharacters.escape(message)
                if (htmlValidator.validate(message)) {
                    mp.events.call(NotificationEvent.SEND,
                        "CHAT_MESSAGE_INVALID", NotificationType.ERROR, NotificationTimeout.LONG, [],
                    )
                } else if (!chatMessageValidator.validate(message)) {
                    mp.events.call(NotificationEvent.SEND,
                        "CHAT_MESSAGE_TOO_LONG", NotificationType.ERROR, NotificationTimeout.LONG, [],
                    )
                } else {
                    const chatMessageLocal: IChatMessageDataClient = {tab, message}
                    mp.events.callRemote(ChatModuleServerEvent.SEND, JSON.stringify(chatMessageLocal))
                    mp.gui.cursor.show(false, false)
                }
            },
        )

        mp.events.add(ChatModuleServerEvent.ADD_MESSAGE, (messageDataAsJson: string) => {
            const messageData: IChatMessageData = JSON.parse(messageDataAsJson)
            if (messageData.playerData) {
                this._addMessage(
                    messageData.playerData.name,
                    messageData.playerData.nameColor,
                    messageData.message, messageData.tab, messageData.id,
                )
            } else {
                this._addMessage(
                    "",
                    messageData.color,
                    messageData.message, messageData.tab, messageData.id,
                )
            }

        })

    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            super.loadUI().then((loaded) => {
                resolve(loaded)
            })
        })

    }

    public destroyUI() {
        return this._promiseFactory.create((resolve) => {
            super.destroyUI().then((result) => {
                resolve(result)
            })
        })
    }

    public toggleChatInput() {
        mp.gui.cursor.show(true, true)
        this._currentWindow.execute(`toggleInput()`)
    }

    private _addMessage(author: string, color: string, message: string, tab: string, id: string) {
        this._currentWindow.execute(`addMesageToTab('${tab}', '${author}', '${color}', "${message}", '${id}') `)
    }
}
