import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { ICheckpointFactory } from "server/core/Checkpoint/ICheckpointFactory"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { IVehicleFactory } from "server/core/VehicleFactory/IVehicleFactory"
import { IAutomaticEventData } from "../IAutomaticEventData"
import { IAutomaticEventFactory } from "../IAutomaticEventFactory"
import { RaceAutomaticEvent } from "./RaceAutomaticEvent"

export class RaceAutomaticEventFactory implements IAutomaticEventFactory {
    private _vehicleFactory: IVehicleFactory = null
    private _vector3Factory: IVector3Factory = null
    private _checkpointFactory: ICheckpointFactory = null
    private _notificationSenderFactory: INotificationSenderFactory = null
    private _playerDataFactory: IPlayerDataFactory = null

    constructor(
        vehicleFactory: IVehicleFactory,
        vector3Factory: IVector3Factory,
        checkpointFactory: ICheckpointFactory,
        notificationSenderFactory: INotificationSenderFactory,
        playerDataFactory: IPlayerDataFactory,
    ) {
        this._vehicleFactory = vehicleFactory
        this._vector3Factory = vector3Factory
        this._checkpointFactory = checkpointFactory
        this._notificationSenderFactory = notificationSenderFactory
        this._playerDataFactory = playerDataFactory
    }

    public create(automaticEventData: IAutomaticEventData) {
        return new RaceAutomaticEvent(
            automaticEventData,
            this._vehicleFactory,
            this._vector3Factory,
            this._checkpointFactory,
            this._notificationSenderFactory,
            this._playerDataFactory,
        )
    }
}
