import { ChangePlayerPedModuleEvents } from "client/modules/ChangePlayerPedModule/ChangePlayerPedModuleEvents"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { IncomingMessage } from "http"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { IVehicleFactory } from "server/core/VehicleFactory/IVehicleFactory"
import { Player } from "server/entity/Player"
import { PlayerItem } from "server/entity/PlayerItem"
import { IBuyAction } from "./IBuyAction"
export class WeaponItemBuyAction implements IBuyAction {
    private _apiManager: IAPIManager<Player> = null
    private _playerDataFactory: IPlayerDataFactory = null
    constructor(apiManager: IAPIManager<Player>, playerDataFactory: IPlayerDataFactory) {
        this._apiManager = apiManager
        this._playerDataFactory = playerDataFactory
    }

    public buy(buyer: PlayerMp, value: number) {
        const playerData: IPlayerData = this._playerDataFactory.create().load(buyer)
        this._apiManager.send(APIRequests.PLAYER_GIVE_ITEM, {
            item_id: value,
            player_id: playerData.databaseId,
        }).then((response: IncomingMessage) => {
            let responseInJson = ""
            response.on("data", (chunk) => {
                responseInJson += chunk
            })
            response.on("end", () => {
                const newItems: PlayerItem[] = JSON.parse(responseInJson)
                if (newItems.length > 0) {
                    buyer.setVariable(PlayerDataProps.ITEMS, newItems)
                }
            })
        })
    }
}
