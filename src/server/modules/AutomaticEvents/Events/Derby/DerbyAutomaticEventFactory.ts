import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { IBlipFactory } from "server/core/BlipFactory/IBlipFactory"
import { ICheckpointFactory } from "server/core/Checkpoint/ICheckpointFactory"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { IVehicleFactory } from "server/core/VehicleFactory/IVehicleFactory"
import { AutomaticEventFactory } from "../../AutomaticEventFactory"
import { IAutomaticEventData } from "../../IAutomaticEventData"
import { IAutomaticEventFactory } from "../../IAutomaticEventFactory"
import { DerbyAutomaticEvent } from "./DerbyAutomaticEvent"
import { IAPIManager } from "server/core/API/IAPIManager"
import { DerbyArena } from "server/entity/DerbyArena"

export class DerbyAutomaticEventFactory implements AutomaticEventFactory {
    private _apiManager: IAPIManager<DerbyArena> = null
    private _vehicleFactory: IVehicleFactory = null
    private _vector3Factory: IVector3Factory = null
    private _notificationSenderFactory: INotificationSenderFactory = null
    private _playerDataFactory: IPlayerDataFactory = null

    constructor(
        apiManager: IAPIManager<DerbyArena>,
        vehicleFactory: IVehicleFactory,
        vector3Factory: IVector3Factory,
        notificationSenderFactory: INotificationSenderFactory,
        playerDataFactory: IPlayerDataFactory,
    ) {
        this._apiManager = apiManager
        this._vehicleFactory = vehicleFactory
        this._vector3Factory = vector3Factory
        this._notificationSenderFactory = notificationSenderFactory
        this._playerDataFactory = playerDataFactory
    }

    public create(automaticEventData: IAutomaticEventData) {
        return new DerbyAutomaticEvent(
            automaticEventData,
            this._apiManager,
            this._vehicleFactory,
            this._vector3Factory,
            this._notificationSenderFactory,
            this._playerDataFactory,
        )
    }
}
