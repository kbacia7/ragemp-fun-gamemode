import { notDeepEqual } from "assert"
import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { Keys } from "client/core/KeyboardManager/Keys"
import { INotificationData } from "core/Notification/INotificationData"
import { NotificationEvent } from "core/Notification/NotificationEvent"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerLoginData } from "core/PlayerRegister/IPlayerLoginData"
import { IPlayerRegiserData } from "core/PlayerRegister/IPlayerRegisterData"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import _ from "lodash"
import { ActionsMenuModuleEvents } from "../ActionsMenuModule/ActionsMenuModuleEvents"
import { ChatModuleEvent } from "../Chat/ChatModuleEvent"
import { Module } from "./../Module"
import { PlayerRegisterAndLoginModuleEvent } from "./PlayerRegisterAndLoginModuleEvent"

export class PlayerRegisterAndLoginModule extends Module {
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        super(promiseFactory)
        this._name = "player-register-and-login"
        mp.events.add(PlayerRegisterAndLoginModuleEvent.TRY_CREATE_ACCOUNT,
            (login: string, email: string, password: string) => {
                const playerRegisterData: IPlayerRegiserData = {
                    email,  login, password,
                }
                mp.events.callRemote(PlayerRegisterEvent.REGISTER, JSON.stringify(playerRegisterData))
            },
        )

        mp.events.add(PlayerRegisterAndLoginModuleEvent.TRY_LOGIN,
            (login: string, password: string) => {
                const playerLoginData: IPlayerLoginData = {
                    login,
                    password,
                }
                mp.events.callRemote(PlayerRegisterEvent.LOGIN, JSON.stringify(playerLoginData))
            },
        )

        mp.events.add(PlayerRegisterEvent.EMAIL_TAKEN, () => {
            if (this._currentWindow) {
                this._currentWindow.execute(`emailIsTaken()`)
            }
        })

        mp.events.add(PlayerRegisterEvent.LOGIN_TAKEN, () => {
            if (this._currentWindow) {
                this._currentWindow.execute(`loginIsTaken()`)
            }
        })

        mp.events.add(PlayerRegisterEvent.CREATED, () => {
            const notificationDataAccountCreate: INotificationData = {
                extraParams: [],
                label: "ACCOUNT_CREATED",
                timeout: NotificationTimeout.LONG,
                type: NotificationType.SUCCESS,
            }
            const notificationDataEmailSended: INotificationData = {
                extraParams: [],
                label: "EMAIL_SENDED",
                timeout: NotificationTimeout.LONG,
                type: NotificationType.SUCCESS,
            }
            mp.events.callRemote(NotificationEvent.CALL_FROM_CLIENT,
                JSON.stringify(notificationDataAccountCreate),
            )
            mp.events.callRemote(NotificationEvent.CALL_FROM_CLIENT,
                JSON.stringify(notificationDataEmailSended),
            )
            mp.events.call(PlayerRegisterEvent.LOGGED_INTO_ACCOUNT)
        })

        mp.events.add(PlayerRegisterEvent.LOGGED_INTO_ACCOUNT, () => {
            const notificationData: INotificationData = {
                extraParams: [],
                label: "SUCCESS_LOGIN",
                timeout: NotificationTimeout.LONG,
                type: NotificationType.SUCCESS,
            }

            mp.events.callRemote(NotificationEvent.CALL_FROM_CLIENT,
                JSON.stringify(notificationData),
            )

            if (this._currentWindow) {
                this._currentWindow.execute(`removeModal()`)
                mp.gui.cursor.show(false, false)
                this.destroyUI()
            }
        })

        mp.events.add(PlayerRegisterEvent.LOGIN_INCORRECT_DATA, () => {
            if (this._currentWindow) {
                this._currentWindow.execute(`loginIncorrectData()`)
            }
        })

        mp.events.add(PlayerRegisterEvent.DISPLAY_GUI, () => {
            this.loadUI()
        })

    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            super.loadUI().then((loaded) => {
                mp.events.call(ActionsMenuModuleEvents.DISABLE_MENU)
                mp.events.call(ChatModuleEvent.DISABLE_CHAT)
                setTimeout(() => {
                    mp.gui.cursor.show(true, true)
                }, 2000)
                resolve(loaded)
            })
        })

    }

    public destroyUI() {
        return this._promiseFactory.create((resolve) => {
            super.destroyUI().then((result) => {
                resolve(result)
            })
            mp.events.call(ActionsMenuModuleEvents.ENABLE_MENU)
            mp.events.call(ChatModuleEvent.ENABLE_CHAT)
        })
    }
}
