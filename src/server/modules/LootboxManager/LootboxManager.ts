import { ChangePlayerPedModuleEvents } from "client/modules/ChangePlayerPedModule/ChangePlayerPedModuleEvents"
import { EquipmentModuleEvent } from "client/modules/EquipmentModule/EquipmentModuleEvent"
import { LootboxPlayerModuleEvents } from "client/modules/LootboxPlayerModule/LootboxPlayerModuleEvents"
import { ItemsSectionsNames } from "core/ItemsSectionsNames/ItemsSectionsNames"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerData } from "core/PlayerDataProps/PlayerData"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { PlayerDataStatus } from "core/PlayerDataProps/PlayerDataStatus"
import random from "random"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { Dimension } from "server/core/Dimension/Dimension"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { Item } from "server/entity/Item"
import { Lootbox } from "server/entity/Lootbox"
import { LootboxItem } from "server/entity/LootboxItem"
import { PlayerItem } from "server/entity/PlayerItem"
import { PlayerSpawn } from "server/entity/PlayerSpawn"
import { LootboxManagerEvents } from "./LootboxManagerEvents"

export class LootboxManager {
    constructor(
        apiManagerLootbox: IAPIManager<Lootbox>,
        apiManagerItem: IAPIManager<Item>,
        playerDataFactory: IPlayerDataFactory,
    ) {

        mp.events.add(LootboxManagerEvents.LIST_ITEMS, (playerMp: PlayerMp, itemId: number) => {
            const playerData: IPlayerData = playerDataFactory.create().load(playerMp)
            apiManagerLootbox.query(`${APIRequests.LOOTBOX_LIST_ITEMS}/${playerData.databaseId}/${itemId}/`)
            .then((lootbox: Lootbox[]) => {
                playerMp.call(LootboxPlayerModuleEvents.OPEN_LOOTBOX_SHOW_ITEMS, [JSON.stringify(lootbox[0])])
            })
        })

        mp.events.add(LootboxManagerEvents.OPEN, (playerMp: PlayerMp, itemId: number) => {
            const playerData: IPlayerData = playerDataFactory.create().load(playerMp)
            apiManagerItem.query(`${APIRequests.LOOTBOX_OPEN}/${playerData.databaseId}/${itemId}/`)
            .then((item: Item[]) => {

                const newItems: PlayerItem[] = playerData.items.filter((playerItem) => playerItem.item.id !== itemId)
                playerMp.setVariable(PlayerDataProps.ITEMS, newItems)
                playerMp.call(EquipmentModuleEvent.RELOAD_ITEMS, [
                    JSON.stringify(newItems),
                ])
                playerMp.call(LootboxPlayerModuleEvents.SHOW_ITEM, [item[0].id])
            })
        })
    }
}
