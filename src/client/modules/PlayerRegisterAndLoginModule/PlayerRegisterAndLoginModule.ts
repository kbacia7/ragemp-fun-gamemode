import { notDeepEqual } from "assert"
import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { Keys } from "client/core/KeyboardManager/Keys"
import { NotificationEvent } from "core/Notification/NotificationEvent"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerLoginData } from "core/PlayerRegister/IPlayerLoginData"
import { IPlayerRegiserData } from "core/PlayerRegister/IPlayerRegisterData"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import _ from "lodash"
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

        mp.events.add(PlayerRegisterAndLoginModuleEvent.TRY_PLAY_AS_GUEST,
            (login: string) => {
                mp.events.callRemote(PlayerRegisterEvent.PLAY_AS_GUEST, login)
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

        mp.events.add(PlayerRegisterEvent.LOGIN_TAKEN_FOR_GUEST, () => {
            if (this._currentWindow) {
                this._currentWindow.execute(`loginIsTakenForGuest()`)
            }
        })

        mp.events.add(PlayerRegisterEvent.CREATED, () => {
            mp.events.call(NotificationEvent.SEND,
                "ACCOUNT_CREATED", NotificationType.SUCCESS, NotificationTimeout.LONG,
            )
            mp.events.call(NotificationEvent.SEND,
                "EMAIL_SENDED", NotificationType.SUCCESS, NotificationTimeout.LONG,
            )
            mp.events.call(PlayerRegisterEvent.LOGGED_INTO_ACCOUNT)
        })

        mp.events.add(PlayerRegisterEvent.LOGGED_INTO_ACCOUNT, () => {
            mp.events.call(NotificationEvent.SEND,
                "SUCCESS_LOGIN", NotificationType.SUCCESS, NotificationTimeout.LONG,
            )
            this._currentWindow.execute(`removeModal()`)
            mp.gui.cursor.show(false, false)
            this.destroyUI()
        })

        mp.events.add(PlayerRegisterEvent.PLAY_AS_GUEST_SUCCESS, () => {
            mp.events.call(NotificationEvent.SEND,
                "PLAY_AS_GUEST", NotificationType.WARNING, NotificationTimeout.LONG,
            )
            this._currentWindow.execute(`removeModal()`)
            mp.gui.cursor.show(false, false)
            this.destroyUI()
        })

        mp.events.add(PlayerRegisterEvent.LOGIN_INCORRECT_DATA, () => {
            if (this._currentWindow) {
                this._currentWindow.execute(`loginIncorrectData()`)
            }
        })

        mp.events.add(PlayerRegisterEvent.DISPLAY_GUI, () => {
            mp.gui.cursor.show(true, true)
            this.loadUI()
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
}
