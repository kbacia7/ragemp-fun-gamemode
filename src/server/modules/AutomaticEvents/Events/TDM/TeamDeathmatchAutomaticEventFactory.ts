import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { IBlipFactory } from "server/core/BlipFactory/IBlipFactory"
import { ICheckpointFactory } from "server/core/Checkpoint/ICheckpointFactory"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { IVehicleFactory } from "server/core/VehicleFactory/IVehicleFactory"
import { AutomaticEventFactory } from "../../AutomaticEventFactory"
import { IAutomaticEventData } from "../../IAutomaticEventData"
import { IAutomaticEventFactory } from "../../IAutomaticEventFactory"
import { TeamDeathmatchAutomaticEvent } from "./TeamDeathmatchAutomaticEvent"

export class TeamDeathmatchAutomaticEventFactory implements AutomaticEventFactory {
    private _vector3Factory: IVector3Factory = null
    private _blipFactory: IBlipFactory = null
    private _notificationSenderFactory: INotificationSenderFactory = null
    private _playerDataFactory: IPlayerDataFactory = null

    constructor(
        vector3Factory: IVector3Factory,
        blipFactory: IBlipFactory,
        notificationSenderFactory: INotificationSenderFactory,
        playerDataFactory: IPlayerDataFactory,
    ) {
        this._vector3Factory = vector3Factory
        this._blipFactory = blipFactory
        this._notificationSenderFactory = notificationSenderFactory
        this._playerDataFactory = playerDataFactory
    }

    public create(automaticEventData: IAutomaticEventData) {
        return new TeamDeathmatchAutomaticEvent(
            automaticEventData,
            this._vector3Factory,
            this._blipFactory,
            this._notificationSenderFactory,
            this._playerDataFactory,
        )
    }
}
