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
import { IObjectFactory } from "server/core/ObjectFactory/IObjectFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { Item } from "server/entity/Item"
import { Lootbox } from "server/entity/Lootbox"
import { LootboxItem } from "server/entity/LootboxItem"
import { ServerObject } from "server/entity/Object"
import { PlayerItem } from "server/entity/PlayerItem"
import { PlayerSpawn } from "server/entity/PlayerSpawn"

export class ObjectsLoader {
    constructor(
        apiManager: IAPIManager<ServerObject>,
        objectFactory: IObjectFactory,
        vector3Factory: IVector3Factory,
    ) {

        apiManager.query(APIRequests.LOAD_OBJECTS)
        .then((objects: ServerObject[]) => {
            let num = 0
            objects.forEach((serverObject: ServerObject) => {
                objectFactory.create(serverObject.ragemp_object_id,
                    vector3Factory.create(serverObject.x, serverObject.y, serverObject.z),
                    vector3Factory.create(serverObject.rot_x, serverObject.rot_y, serverObject.rot_z),
                    255, 0,
                )
                num++
            })
            console.log(`Loaded ${num} objects`)

        })
    }
}
