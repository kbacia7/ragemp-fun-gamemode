import { EquipmentModuleEvent } from "client/modules/EquipmentModule/EquipmentModuleEvent"
import { GlobalShopModuleEvent } from "client/modules/GlobalShopModule/GlobalShopModuleEvent"
import { CommandListenerEvent } from "core/CommandListener/CommandListenerEvent"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerData } from "core/PlayerDataProps/PlayerData"
import { ActionsMenu } from "server/core/ActionsMenu/ActionsMenu"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { Setting } from "server/entity/Setting"
import { ShopTabData } from "server/entity/ShopTabData"
import { IShopManager } from "server/modules/ShopManager/IShopManager"
import { ICommand } from "../ICommand"
import { ITeleportCommandFactory } from "./ITeleportCommandFactory"
import { TeleportCommand } from "./TeleportCommand"

export class TeleportCommandFactory implements ITeleportCommandFactory {
    private _vector3Factory: IVector3Factory = null

    constructor(vector3Factory: IVector3Factory) {
        this._vector3Factory = vector3Factory
    }

    public create(alias: string, x: number, y: number, z: number, heading: number) {
        return new TeleportCommand(this._vector3Factory, alias, x, y, z, heading)
    }
}
