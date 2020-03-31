import { ChangePlayerPedModuleEvents } from "client/modules/ChangePlayerPedModule/ChangePlayerPedModuleEvents"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { IVehicleFactory } from "server/core/VehicleFactory/IVehicleFactory"
import { IBuyAction } from "./IBuyAction"
export class WeaponOnceSpawnBuyAction implements IBuyAction {
    public buy(buyer: PlayerMp, value: number) {
        buyer.giveWeapon(value, 99999999)
    }
}
