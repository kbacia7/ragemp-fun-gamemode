import { GlobalShopModuleEvent } from "client/modules/GlobalShopModule/GlobalShopModuleEvent"
import { CommandListenerEvent } from "core/CommandListener/CommandListenerEvent"
import { ActionsMenu } from "server/core/ActionsMenu/ActionsMenu"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { Setting } from "server/entity/Setting"
import { ShopTabData } from "server/entity/ShopTabData"
import { IShopManager } from "server/modules/ShopManager/IShopManager"
import { ICommand } from "../ICommand"

export class ShopCommand implements ICommand {
    private _alias: string[] = null
    private _apiManager: IAPIManager<ShopTabData> = null
    private _shopManager: IShopManager = null
    public get alias() {
        return this._alias
    }

    constructor(apiManager: IAPIManager<ShopTabData>, shopManager: IShopManager) {
        this._alias = ["shop"]
        this._apiManager = apiManager
        this._shopManager = shopManager
        mp.events.add(ActionsMenu.PREFIX + ActionsMenu.SHOW_SHOP, (player: PlayerMp) => {
            this.execute(player, [])
        })
    }

    public execute(player: PlayerMp, args: string[]) {

        if (args.length <= 0) {
            args = ["skins-spawns"]
        }

        this._shopManager.initialize(args[0]).then((data: [ShopTabData, ShopTabData[]]) => {
            player.call(GlobalShopModuleEvent.SHOW_SHOP, [
                JSON.stringify(data[0]),
                JSON.stringify(data[1]),
            ])
        })
    }
}
