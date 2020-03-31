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
import { Currency } from "server/modules/ShopManager/Currency"
import { ShopManagerEvents } from "server/modules/ShopManager/ShopManagerEvents"
import { ActionsMenuModuleEvents } from "../ActionsMenuModule/ActionsMenuModuleEvents"
import { ChatModuleEvent } from "../Chat/ChatModuleEvent"
import { Module } from "./../Module"
import { GlobalShopModuleEvent } from "./GlobalShopModuleEvent"

export class GlobalShopModule extends Module {
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        super(promiseFactory)
        this._name = "global-shop"

        mp.events.add(GlobalShopModuleEvent.SHOW_SHOP, (shopTabDataAsJson: string, tabs: string) => {
            const shopData: ShopTabData = JSON.parse(shopTabDataAsJson)
            const allTabs: ShopTabData[] = JSON.parse(tabs)
            this.loadUI().then((success: boolean) => {
                if (success) {
                    this._provideTabs(allTabs)
                    this._provideTabData(shopData)
                }
            })
        })

        mp.events.add(GlobalShopModuleEvent.BUY, (itemId: number, currency: Currency) => {
            mp.events.callRemote(ShopManagerEvents.BUY, itemId, currency)
        })

        mp.events.add(GlobalShopModuleEvent.NEED_DATA_FOR_TAB, (tabName: string) => {
            mp.events.callRemote(ShopManagerEvents.NEED_DATA_FOR_TAB, tabName)
        })

        mp.events.add(GlobalShopModuleEvent.PROVIDE_DATA_FOR_TAB, (tabDataAsJson: string) => {
            const shopData: ShopTabData = JSON.parse(tabDataAsJson)
            this._provideTabData(shopData)
        })

        mp.events.add(GlobalShopModuleEvent.CLOSE, () => {
            this.destroyUI()
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

    private _provideTabData(tabData: ShopTabData) {
        this._currentWindow.execute(`provideTabData('${JSON.stringify(tabData)}')`)
    }

    private _provideTabs(tabs: ShopTabData[]) {
        this._currentWindow.execute(`provideTabs('${JSON.stringify(tabs)}')`)
    }
}
