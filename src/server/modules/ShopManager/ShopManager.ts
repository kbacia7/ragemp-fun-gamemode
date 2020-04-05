import { GlobalShopModuleEvent } from "client/modules/GlobalShopModule/GlobalShopModuleEvent"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { IncomingMessage } from "http"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { ShopResponses } from "server/core/API/ShopResponses"
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { ShopTabData } from "server/entity/ShopTabData"
import { IBuyAction } from "./BuyActions/IBuyAction"
import { Currency } from "./Currency"
import { IShopBuyResponse } from "./IShopBuyResponse"
import { IShopManager } from "./IShopManager"
import { IShopManagerBuyData } from "./IShopManagerBuyData"
import { ShopManagerEvents } from "./ShopManagerEvents"

export class ShopManager implements IShopManager {
    private _apiManager: IAPIManager<ShopTabData> = null
    private _promiseFactoryForInitialize: IPromiseFactory<[ShopTabData, ShopTabData[]]> = null
    private _promiseFactoryForTab: IPromiseFactory<ShopTabData> = null
    constructor(
        apiManager: IAPIManager<ShopTabData>,
        promiseFactoryForInitialize: IPromiseFactory<[ShopTabData, ShopTabData[]]>,
        promiseFactoryForTab: IPromiseFactory<ShopTabData>,
        playerDataFactory: IPlayerDataFactory,
        notificationSenderFactory: INotificationSenderFactory,
        buyActionsForTabs: {[index: string]: IBuyAction},
    ) {
        this._apiManager = apiManager
        this._promiseFactoryForTab = promiseFactoryForTab
        this._promiseFactoryForInitialize = promiseFactoryForInitialize

        mp.events.add(ShopManagerEvents.BUY, (playerMp: PlayerMp, itemId: number, currency: Currency) => {
            const playerData: IPlayerData = playerDataFactory.create().load(playerMp)
            const buyItemData: IShopManagerBuyData = {
                buy_in: `shop`,
                currency,
                item_id: itemId,
                player_id: playerData.databaseId,
            }
            apiManager.send(APIRequests.BUY_ITEM, buyItemData).then((response: IncomingMessage) => {
                let responseInJson = ""
                response.on("data", (chunk) => {
                        responseInJson += chunk
                    })
                response.on("end", () => {
                       const notificationSender: INotificationSender = notificationSenderFactory.create()
                       const shopResponse: IShopBuyResponse = JSON.parse(responseInJson)
                       const allOkCallback = () => {
                        const label = `SHOP_ITEM_BUYED_${shopResponse.tab_name.replace("-", "_").toUpperCase()}_IN_${currency}`
                        notificationSender.send(
                            playerMp, label, NotificationType.SUCCESS, NotificationTimeout.LONG,
                            [shopResponse.cost.toString()],
                        )
                        const playerDataNow = playerDataFactory.create().load(playerMp)
                        if (currency === Currency.MONEY) {
                            playerMp.setVariable(PlayerDataProps.MONEY, playerDataNow.money - shopResponse.cost)
                        } else {
                             playerMp.setVariable(
                                 PlayerDataProps.DIAMONDS, playerDataNow.diamonds - shopResponse.cost,
                             )
                        }
                        if (Object.keys(buyActionsForTabs).includes(shopResponse.tab_name)) {
                            buyActionsForTabs[shopResponse.tab_name].buy(playerMp, shopResponse.ragemp_item_id ?
                                shopResponse.ragemp_item_id : shopResponse.item_id)
                        }
                       }

                       const alreadyHaveItemCallback = () => {
                        notificationSender.send(
                            playerMp, `SHOP_ALREADY_HAVE_ITEM`,
                            NotificationType.ERROR, NotificationTimeout.LONG,
                        )
                       }

                       const notEnoughCurrencyCallback = () => {
                        notificationSender.send(
                            playerMp, `SHOP_NOT_ENOUGH_${currency}`,
                            NotificationType.ERROR, NotificationTimeout.LONG,
                        )
                       }
                       switch (shopResponse.code) {
                           case ShopResponses.ALL_OK: {
                                allOkCallback()
                                break
                           }
                           case ShopResponses.IS_A_GUEST: {
                            const playerDataNow = playerDataFactory.create().load(playerMp)
                            if (currency === Currency.MONEY) {
                                if (playerDataNow.money >= shopResponse.cost) {
                                    allOkCallback()
                                } else {
                                    notEnoughCurrencyCallback()
                                }
                            } else {
                                if (playerDataNow.diamonds >= shopResponse.cost) {
                                    allOkCallback()
                                } else {
                                    notEnoughCurrencyCallback()
                                }
                            }
                            break
                           }
                           case ShopResponses.ALREADY_HAVE: {
                            alreadyHaveItemCallback()
                            break
                           }
                           case ShopResponses.NOT_ENOUGH_CURRENCY: {
                            notEnoughCurrencyCallback()
                            break
                           }
                       }
                    })

            })
        })

        mp.events.add(ShopManagerEvents.NEED_DATA_FOR_TAB, (playerMp: PlayerMp, tabName: string) => {
            this._loadTabData(tabName).then((tabData: ShopTabData) => {
                playerMp.call(GlobalShopModuleEvent.PROVIDE_DATA_FOR_TAB, [JSON.stringify(tabData)])
            })
        })
    }

    public initialize(firstTab: string) {
       return this._promiseFactoryForInitialize.create((resolve) => {
        this._loadTabData(firstTab).then((tabData: ShopTabData) => {
            this._apiManager.query(`${APIRequests.SHOP_DATA_PREFIX}/all/`).then((allTabs: ShopTabData[]) => {
                resolve([tabData, allTabs])

            })
        })
       })
    }

    private _loadTabData(tabName: string) {
        return this._promiseFactoryForTab.create((resolve) => {
            this._apiManager.query(`${APIRequests.SHOP_DATA_PREFIX}/${tabName}/`)
            .then((shopData: ShopTabData[]) => {
                resolve(shopData[0])
            })
        })

    }
}
