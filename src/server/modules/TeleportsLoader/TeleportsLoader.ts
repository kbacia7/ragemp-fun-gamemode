import { ActionsMenuModuleEvents } from "client/modules/ActionsMenuModule/ActionsMenuModuleEvents"
import { ChangePlayerPedModuleEvents } from "client/modules/ChangePlayerPedModule/ChangePlayerPedModuleEvents"
import { EquipmentModuleEvent } from "client/modules/EquipmentModule/EquipmentModuleEvent"
import { LootboxPlayerModuleEvents } from "client/modules/LootboxPlayerModule/LootboxPlayerModuleEvents"
import { ItemsSectionsNames } from "core/ItemsSectionsNames/ItemsSectionsNames"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerData } from "core/PlayerDataProps/PlayerData"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { PlayerDataStatus } from "core/PlayerDataProps/PlayerDataStatus"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
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
import { Teleport } from "server/entity/Teleport"
import { Vehicle } from "server/entity/Vehicle"
import { CommandExecutor } from "../Commands/CommandExecutor"
import { ICommand } from "../Commands/ICommand"
import { ITeleportCommandFactory } from "../Commands/TeleportsCommand/ITeleportCommandFactory"
import { TeleportsLoaderEvents } from "./TeleportsLoaderEvents"

export class TeleportsLoader {
    private _apiManager: IAPIManager<Teleport> = null
    private _teleportsCommandFactoryteleportsCommandFactory: ITeleportCommandFactory = null
    private _promiseFactory: IPromiseFactory<ICommand[]> = null
    private _allTeleports: Teleport[] = []

    constructor(
        apiManager: IAPIManager<Teleport>,
        teleportsCommandFactory: ITeleportCommandFactory,
        promiseFactory: IPromiseFactory<ICommand[]>,
    ) {
        this._apiManager = apiManager
        this._teleportsCommandFactoryteleportsCommandFactory = teleportsCommandFactory
        this._promiseFactory = promiseFactory

        mp.events.add(TeleportsLoaderEvents.PROVIDE_TELEPORTS, (p: PlayerMp) => {
            p.call(ActionsMenuModuleEvents.LOAD_TELEPORTS, [JSON.stringify(this._allTeleports)])
        })
    }

    public createTeleportsCommands(): Promise<ICommand[]> {
        return this._promiseFactory.create((resolve) => {

        this._apiManager.query(APIRequests.LOAD_TELEPORTS)
        .then((teleports: Teleport[]) => {
            this._allTeleports = teleports
            console.log(`Loaded ${this._allTeleports.length} teleports`)

            const tpCommands: ICommand[] = []
            this._allTeleports.forEach((teleport: Teleport) => {
                tpCommands.push(
                    this._teleportsCommandFactoryteleportsCommandFactory.create(
                        teleport.alias, teleport.x, teleport.y, teleport.z, teleport.heading,
                    ),
                )
            })
            resolve(tpCommands)
        })

        })

    }
}
