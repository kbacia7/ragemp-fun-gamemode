import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { Keys } from "client/core/KeyboardManager/Keys"
import { CommandListenerEvent } from "core/CommandListener/CommandListenerEvent"
import { NotificationEvent } from "core/Notification/NotificationEvent"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { ActionsMenu } from "server/core/ActionsMenu/ActionsMenu"
import { IActivePlayersTableModuleFactory } from "../ActivePlayersTableModule/IActivePlayersTableModuleFactory"
import { Module } from "../Module"
import { ActionsMenuModuleEvents } from "./ActionsMenuModuleEvents"

export class ActionsMenuModule extends Module {
    constructor(
        promiseFactory: IPromiseFactory<boolean>,
    ) {
        super(promiseFactory)
        this._name = "actions-menu"
        mp.events.add(ActionsMenuModuleEvents.TRIGGER_EVENT, (eventName: string) => {
            mp.events.callRemote(ActionsMenu.PREFIX + eventName)
        })
    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            mp.gui.cursor.show(true, true)
            super.loadUI().then((loaded) => {
                this._currentWindow.execute(
                    `setListPosition(${mp.gui.cursor.position[0]}, ${mp.gui.cursor.position[1]})`,
                )
                resolve(loaded)
            })
        })
    }

    public destroyUI() {
        return this._promiseFactory.create((resolve) => {
            mp.gui.cursor.show(false, false)
            super.destroyUI().then((loaded) => {
                resolve(loaded)
            })
        })
    }
}
