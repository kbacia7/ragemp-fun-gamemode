import { GlobalShopModuleEvent } from "client/modules/GlobalShopModule/GlobalShopModuleEvent"
import { CommandListenerEvent } from "core/CommandListener/CommandListenerEvent"
import { ActionsMenu } from "server/core/ActionsMenu/ActionsMenu"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { Setting } from "server/entity/Setting"
import { ShopTabData } from "server/entity/ShopTabData"
import { ICommand } from "../ICommand"

export class ShopCommand implements ICommand {
    private _alias: string[] = null
    private _apiManager: IAPIManager<ShopTabData> = null
    public get alias() {
        return this._alias
    }

    constructor(apiManager: IAPIManager<ShopTabData>) {
        this._alias = ["shop"]
        this._apiManager = apiManager
        mp.events.add(ActionsMenu.PREFIX + ActionsMenu.SHOW_SHOP, (player: PlayerMp) => {
            this.execute(player, [])
        })
    }

    public execute(player: PlayerMp, args: string[]) {

        if (args.length <= 0) {
            args = ["skins"]
        }

        this._apiManager.query(`${APIRequests.SHOP_DATA_PREFIX}/${args[0]}/`)
        .then((shopData: ShopTabData[]) => {
            if (shopData.length > 0) {
                this._apiManager.query(`${APIRequests.SHOP_DATA_PREFIX}/all/`).then((allTabs: ShopTabData[]) => {
                    player.call(GlobalShopModuleEvent.SHOW_SHOP, [
                        JSON.stringify(shopData[0]),
                        JSON.stringify(allTabs),
                    ])

                })
            }
        })
    }
}
