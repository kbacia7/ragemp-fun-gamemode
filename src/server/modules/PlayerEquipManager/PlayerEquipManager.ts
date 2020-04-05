import { EquipmentModuleEvent } from "client/modules/EquipmentModule/EquipmentModuleEvent"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { IncomingMessage } from "http"
import { APIManager } from "server/core/API/APIManager"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { Player } from "server/entity/Player"
import { PlayerItem } from "server/entity/PlayerItem"
import { PlayerEquipManagerEvents } from "./PlayerEquipManagerEvents"

export class PlayerEquipManager {
    constructor(apiManager: IAPIManager<Player>, playerDataFactory: IPlayerDataFactory) {
        mp.events.add(PlayerEquipManagerEvents.EQUIP_ITEM, (playerMp: PlayerMp, itemId: number) => {

            apiManager.send(APIRequests.PLAYER_EQUIP_ITEM, {
                item_id: itemId,
                player_id: playerDataFactory.create().load(playerMp).databaseId,
            }).then((response: IncomingMessage) => {
                let responseInJson = ""
                response.on("data", (chunk) => {
                    responseInJson += chunk
                })
                response.on("end", () => {
                    console.log("response read!")
                    console.log(responseInJson)
                    const newItems: PlayerItem[] = JSON.parse(responseInJson)
                    if (newItems.length > 0) {
                        playerMp.setVariable(PlayerDataProps.ITEMS, newItems)
                        playerMp.call(EquipmentModuleEvent.RELOAD_ITEMS, [
                            JSON.stringify(playerDataFactory.create().load(playerMp).items),
                        ])
                    }
                })

            })
        })
    }
}
