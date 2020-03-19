import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { Keys } from "client/core/KeyboardManager/Keys"
import { ChatModuleServerEvent } from "core/Chat/ChatModuleServerEvent"
import { IEscapeCharacters } from "core/Chat/Escape/IEscapeCharacters"
import { IChatMessageData } from "core/Chat/MessageData/IChatMessageData"
import { IChatMessageDataClient } from "core/Chat/MessageData/IChatMessageDataClient"
import { HTMLValidator } from "core/DataValidator/HTML/HTMLValidator"
import { IDataValidator } from "core/DataValidator/IDataValidator"
import { INotificationData } from "core/Notification/INotificationData"
import { NotificationEvent } from "core/Notification/NotificationEvent"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { ActionsMenuModuleEvents } from "../ActionsMenuModule/ActionsMenuModuleEvents"
import { Module } from "./../Module"
import { ChatModuleEvent } from "./ChatModuleEvent"

export class ChatModule extends Module {
    private _enabledChat: boolean = false
    private _mainUiLoaded: boolean = false
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
                    const notificationData: INotificationData = {
                        extraParams: [],
                        label: "CHAT_MESSAGE_INVALID",
                        timeout: NotificationTimeout.LONG,
                        type: NotificationType.ERROR,

                    }
                    mp.events.callRemote(NotificationEvent.CALL_FROM_CLIENT,
                        JSON.stringify(notificationData),
                    )
                } else if (!chatMessageValidator.validate(message)) {
                    const notificationData: INotificationData = {
                        extraParams: [],
                        label: "CHAT_MESSAGE_TOO_LONG",
                        timeout: NotificationTimeout.LONG,
                        type: NotificationType.ERROR,

                    }
                    mp.events.callRemote(NotificationEvent.CALL_FROM_CLIENT,
                        JSON.stringify(notificationData),
                    )
                } else {
                    const chatMessageLocal: IChatMessageDataClient = {tab, message}
                    mp.events.callRemote(ChatModuleServerEvent.SEND, JSON.stringify(chatMessageLocal))
                    mp.gui.cursor.show(false, false)
                }
            },
        )

        mp.events.add(ChatModuleEvent.DISABLE_ACTION_MENU , () => {
            mp.events.call(ActionsMenuModuleEvents.DISABLE_MENU)
        })

        mp.events.add(ChatModuleEvent.ENABLE_ACTION_MENU , () => {
            mp.events.call(ActionsMenuModuleEvents.ENABLE_MENU)
            this.loadUI()
        })

        mp.events.add(ChatModuleEvent.ENABLE_CHAT, () => {
            this._enabledChat = true
            if (!this._mainUiLoaded) {
                this.loadUI()
            }
        })

        mp.events.add(ChatModuleEvent.DISABLE_CHAT, () => {
            this._enabledChat = false
        })

        mp.events.add(ChatModuleServerEvent.ADD_MESSAGE, (messageDataAsJson: string) => {
            const messageData: IChatMessageData = JSON.parse(messageDataAsJson)
            if (messageData.playerData) {
                this._addMessage(
                    messageData.playerData.name,
                    messageData.playerData.nameColor,
                    messageData.message,
                    messageData.sendDateTime, messageData.tab, messageData.id, false,
                    "",
                )
            } else {
                this._addMessage(
                    "",
                    messageData.color,
                    messageData.message,
                    messageData.sendDateTime, messageData.tab, messageData.id, true,
                    messageData.extraParams,
                )
            }

        })

    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            if (this._enabledChat) {
                super.loadUI().then((loaded) => {
                    resolve(loaded)
                })
                this._mainUiLoaded = true
            }

        })

    }

    public destroyUI() {
        return this._promiseFactory.create((resolve) => {
            if (this._enabledChat) {
                super.destroyUI().then((result) => {
                    resolve(result)
                })
                this._mainUiLoaded = false
            }
        })
    }

    public showChatInput() {
        if (this._enabledChat) {
            mp.gui.cursor.show(true, true)
            this._currentWindow.execute(`showInput()`)
        }

    }

    private _addMessage(
        author: string, color: string, message: string, dateTime: string,
        tab: string, id: string, serverMessage: boolean, args: string,
    ) {
        this._currentWindow.execute(
            `addMesageToTab('${tab}', '${author}', '${color}', "${message}", '${dateTime}', '${id}', ${serverMessage}, '${args}')`,
        )
    }
}
