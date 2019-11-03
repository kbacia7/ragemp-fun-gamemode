import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { IBlipFactory } from "server/core/BlipFactory/IBlipFactory"
import { ICheckpointFactory } from "server/core/Checkpoint/ICheckpointFactory"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { IVehicleFactory } from "server/core/VehicleFactory/IVehicleFactory"
import { AutomaticEventFactory } from "../AutomaticEventFactory"
import { IAutomaticEventData } from "../IAutomaticEventData"
import { IAutomaticEventFactory } from "../IAutomaticEventFactory"
import { IRaceDataFactory } from "./IRaceDataFactory"
import { RaceAutomaticEvent } from "./RaceAutomaticEvent"

export class RaceAutomaticEventFactory implements AutomaticEventFactory {
    private _vehicleFactory: IVehicleFactory = null
    private _vector3Factory: IVector3Factory = null
    private _checkpointFactory: ICheckpointFactory = null
    private _blipFactory: IBlipFactory = null
    private _notificationSenderFactory: INotificationSenderFactory = null
    private _playerDataFactory: IPlayerDataFactory = null
    private _raceDataFactory: IRaceDataFactory = null

    constructor(
        vehicleFactory: IVehicleFactory,
        vector3Factory: IVector3Factory,
        checkpointFactory: ICheckpointFactory,
        blipFactory: IBlipFactory,
        notificationSenderFactory: INotificationSenderFactory,
        playerDataFactory: IPlayerDataFactory,
        raceDataFactory: IRaceDataFactory,
    ) {
        this._vehicleFactory = vehicleFactory
        this._vector3Factory = vector3Factory
        this._checkpointFactory = checkpointFactory
        this._blipFactory = blipFactory
        this._notificationSenderFactory = notificationSenderFactory
        this._playerDataFactory = playerDataFactory
        this._raceDataFactory = raceDataFactory
    }

    public create(automaticEventData: IAutomaticEventData) {
        return new RaceAutomaticEvent(
            automaticEventData,
            this._vehicleFactory,
            this._vector3Factory,
            this._checkpointFactory,
            this._blipFactory,
            this._notificationSenderFactory,
            this._playerDataFactory,
            this._raceDataFactory,
        )
    }
}
