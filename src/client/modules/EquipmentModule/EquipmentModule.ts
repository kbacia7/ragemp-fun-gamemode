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
import { ShopTabData } from "server/entity/ShopTabData"
import { PlayerEquipManagerEvents } from "server/modules/PlayerEquipManager/PlayerEquipManagerEvents"
import { Currency } from "server/modules/ShopManager/Currency"
import { ShopManagerEvents } from "server/modules/ShopManager/ShopManagerEvents"
import { ActionsMenuModuleEvents } from "../ActionsMenuModule/ActionsMenuModuleEvents"
import { ChatModuleEvent } from "../Chat/ChatModuleEvent"
import { Module } from "./../Module"
import { EquipmentModuleEvent } from "./EquipmentModuleEvent"

export class EquipmentModule extends Module {
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        super(promiseFactory)
        this._name = "eq"

        mp.events.add(EquipmentModuleEvent.SHOW_EQ, (playerItemsAsJson: string) => {
            this.loadUI().then(() => {
                this._providePlayerItems(playerItemsAsJson)
            })
        })

        mp.events.add(EquipmentModuleEvent.HIDE_EQ, () => {
            this.destroyUI()
        })

        mp.events.add(EquipmentModuleEvent.TRY_EQUIP_ITEM, (itemId: number) => {
            mp.events.callRemote(PlayerEquipManagerEvents.EQUIP_ITEM, itemId)
        })

        mp.events.add(EquipmentModuleEvent.RELOAD_ITEMS, (playerItemsAsJson: string) => {
            this._providePlayerItems(playerItemsAsJson)
        })
    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            super.loadUI().then((loaded) => {
                resolve(loaded)
            })
            mp.events.call(ActionsMenuModuleEvents.HIDE_MENU)
            mp.events.call(ActionsMenuModuleEvents.DISABLE_MENU)
            mp.events.call(ChatModuleEvent.DISABLE_CHAT)
            mp.gui.cursor.show(true, true)
        })

    }

    public destroyUI() {
        return this._promiseFactory.create((resolve) => {
            super.destroyUI().then((result) => {
                resolve(result)
            })
            mp.events.call(ActionsMenuModuleEvents.ENABLE_MENU)
            mp.events.call(ChatModuleEvent.ENABLE_CHAT)
            mp.gui.cursor.show(false, false)
        })
    }

    private _providePlayerItems(playerItemsAsJson: string) {
        this._currentWindow.execute(`loadPlayerItems('${playerItemsAsJson}')`)
    }
}
