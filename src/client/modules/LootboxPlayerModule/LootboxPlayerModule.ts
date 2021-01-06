import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { Keys } from "client/core/KeyboardManager/Keys"
import { CommandListenerEvent } from "core/CommandListener/CommandListenerEvent"
import { NotificationEvent } from "core/Notification/NotificationEvent"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { ActionsMenu } from "server/core/ActionsMenu/ActionsMenu"
import { LootboxManagerEvents } from "server/modules/LootboxManager/LootboxManagerEvents"
import { IActivePlayersTableModuleFactory } from "../ActivePlayersTableModule/IActivePlayersTableModuleFactory"
import { EquipmentModuleEvent } from "../EquipmentModule/EquipmentModuleEvent"
import { Module } from "../Module"
import { LootboxPlayerModuleEvents } from "./LootboxPlayerModuleEvents"

export class LootboxPlayerModule extends Module {
    private _enableMenu: boolean = true
    private _openedLootboxItemId: number = null
    constructor(
        promiseFactory: IPromiseFactory<boolean>,
    ) {
        super(promiseFactory)
        this._name = "lootbox"
        this._openedLootboxItemId = null
        mp.events.add(LootboxPlayerModuleEvents.OPEN_LOOTBOX_LIST_ITEMS, (itemId: number) => {
            this._openedLootboxItemId = itemId
            mp.events.callRemote(LootboxManagerEvents.LIST_ITEMS, itemId)
        })

        mp.events.add(LootboxPlayerModuleEvents.OPEN_LOOTBOX_SHOW_ITEMS, (lootboxAsJsonStr: string) => {
            this.loadUI().then(() => {
                this._loadItems(lootboxAsJsonStr)
            })
        })

        mp.events.add(LootboxPlayerModuleEvents.OPEN_LOOTBOX, () => {
            mp.events.callRemote(LootboxManagerEvents.OPEN, this._openedLootboxItemId)
        })

        mp.events.add(LootboxPlayerModuleEvents.CLOSE_LOOTBOX, () => {
            mp.events.call(EquipmentModuleEvent.RELOAD_ITEMS)
            this.destroyUI()
        })

        mp.events.add(LootboxPlayerModuleEvents.SHOW_ITEM, (itemId: number) => {
            this._showItemFromLootbox(itemId)
        })

    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            if (this._enableMenu) {
                mp.gui.cursor.show(true, true)
                super.loadUI().then((loaded) => {
                    resolve(loaded)
                })
            }
        })
    }

    public destroyUI() {
        return this._promiseFactory.create((resolve) => {
            if (this._enableMenu) {
            super.destroyUI().then((loaded) => {
                resolve(loaded)
            })
            }
        })
    }

    private _loadItems(lootboxAsJsonStr: string) {
        this._currentWindow.execute(`displayItemsForLootbox('${lootboxAsJsonStr}')`)
    }

    private _showItemFromLootbox(itemId: number) {
        this._currentWindow.execute(`showItemFromLootbox(${itemId})`)
    }
}
