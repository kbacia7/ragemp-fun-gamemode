import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { IBlipFactory } from "server/core/BlipFactory/IBlipFactory"
import { ICheckpointFactory } from "server/core/Checkpoint/ICheckpointFactory"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { IVehicleFactory } from "server/core/VehicleFactory/IVehicleFactory"
import { IArenaData } from "../../IArenaData"
import { IArenaFactory } from "../../IArenaFactory"
import { DeathmatchArena } from "./DeathmatchArena"

export class DeathmatchArenaFactory implements IArenaFactory {
    private _vector3Factory: IVector3Factory = null
    private _playerDataFactory: IPlayerDataFactory = null
    private _notificationSenderFactory: INotificationSenderFactory = null
    constructor(
        vector3Factory: IVector3Factory,
        notificationSenderFactory: INotificationSenderFactory,
        playerDataFactory: IPlayerDataFactory,
    ) {
        this._vector3Factory = vector3Factory
        this._notificationSenderFactory = notificationSenderFactory
        this._playerDataFactory = playerDataFactory
    }

    public create(arenaData: IArenaData) {
        return new DeathmatchArena(
            arenaData,
            this._vector3Factory,
            this._notificationSenderFactory,
            this._playerDataFactory,
        )
    }
}
