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
import { IVehicleFactory } from "server/core/VehicleFactory/IVehicleFactory"
import { Item } from "server/entity/Item"
import { Lootbox } from "server/entity/Lootbox"
import { LootboxItem } from "server/entity/LootboxItem"
import { ServerObject } from "server/entity/Object"
import { PlayerItem } from "server/entity/PlayerItem"
import { PlayerSpawn } from "server/entity/PlayerSpawn"
import { Vehicle } from "server/entity/Vehicle"

export class VehiclesLoader {
    constructor(
        apiManager: IAPIManager<Vehicle>,
        vehicleFatory: IVehicleFactory,
        vector3Factory: IVector3Factory,
    ) {

        apiManager.query(APIRequests.LOAD_VEHICLES)
        .then((vehicles: Vehicle[]) => {
            let num = 0
            vehicles.forEach((vehicle: Vehicle) => {
                const randomColor: [number, number, number] = [
                    random.int(1, 255),
                    random.int(1, 255),
                    random.int(1, 255),
                ]
                const v = vehicleFatory.create(
                    vehicle.ragemp_vehicle_id,
                    vector3Factory.create(vehicle.x, vehicle.y, vehicle.z),
                    vehicle.rot_x,
                    undefined, undefined, [randomColor, randomColor],
                    false, true, 0,
                )
                v.rotation = vector3Factory.create(vehicle.rot_x, vehicle.rot_y, vehicle.rot_z)
                num++
            })
            console.log(`Loaded ${num} vehicles`)

        })
    }
}
