import { ChangePlayerPedModuleEvents } from "client/modules/ChangePlayerPedModule/ChangePlayerPedModuleEvents"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import random from "random"
import { IVehicleFactory } from "server/core/VehicleFactory/IVehicleFactory"
import { IBuyAction } from "./IBuyAction"
export class VehicleSpawnBuyAction implements IBuyAction {
    private _vehicleFactory: IVehicleFactory = null
    constructor(vehicleFactory: IVehicleFactory) {
        this._vehicleFactory = vehicleFactory
    }

    public buy(buyer: PlayerMp, value: number) {
        const v: VehicleMp = this._vehicleFactory.create(value, buyer.position, buyer.heading, "", 255, [
            [random.int(0, 255), random.int(0, 255), random.int(0, 255)],
            [random.int(0, 255), random.int(0, 255), random.int(0, 255)],
        ], false, true, buyer.dimension)
        buyer.putIntoVehicle(v, -1)
    }
}
