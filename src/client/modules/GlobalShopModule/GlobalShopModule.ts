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
import { ActionsMenuModuleEvents } from "../ActionsMenuModule/ActionsMenuModuleEvents"
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
    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            super.loadUI().then((loaded) => {
                resolve(loaded)
            })
            mp.events.call(ActionsMenuModuleEvents.DISABLE_MENU)
        })

    }

    public destroyUI() {
        return this._promiseFactory.create((resolve) => {
            super.destroyUI().then((result) => {
                resolve(result)
            })
            mp.events.call(ActionsMenuModuleEvents.ENABLE_MENU)
        })
    }

    private _provideTabData(tabData: ShopTabData) {
        this._currentWindow.execute(`provideTabData('${JSON.stringify(tabData)}')`)
    }

    private _provideTabs(tabs: ShopTabData[]) {
        this._currentWindow.execute(`provideTabs('${JSON.stringify(tabs)}')`)
    }
}
