import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { Keys } from "client/core/KeyboardManager/Keys"
import { CommandListenerEvent } from "core/CommandListener/CommandListenerEvent"
import { NotificationEvent } from "core/Notification/NotificationEvent"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { IActivePlayersTableModuleFactory } from "../ActivePlayersTableModule/IActivePlayersTableModuleFactory"
import { Module } from "./../Module"

export class CommandListenerModule extends Module {
    constructor(
        promiseFactory: IPromiseFactory<boolean>,
        activePlayersTableModuleFactory: IActivePlayersTableModuleFactory,
    ) {
        super(promiseFactory)
        const mappedCommandsToModules = {
            players: () => {
                activePlayersTableModuleFactory.create().loadUI()
            },
        }

        mp.events.add(CommandListenerEvent.SEND, (commandName: string, args: string[]) => {
            if (Object.keys(mappedCommandsToModules).includes(commandName)) {
                mappedCommandsToModules[commandName](args)
            }
        })
    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            resolve(false)
        })

    }

    public destroyUI() {
        return this._promiseFactory.create((resolve) => {
            resolve(false)
        })
    }
}
