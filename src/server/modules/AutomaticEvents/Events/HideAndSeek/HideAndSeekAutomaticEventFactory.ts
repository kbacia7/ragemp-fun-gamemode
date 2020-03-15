import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { IAPIManager } from "server/core/API/IAPIManager"
import { IBlipFactory } from "server/core/BlipFactory/IBlipFactory"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { HideAndSeekArena } from "server/entity/HideAndSeekArena"
import { AutomaticEventFactory } from "../../AutomaticEventFactory"
import { IAutomaticEventData } from "../../IAutomaticEventData"
import { HideAndSeekAutomaticEvent } from "./HideAndSeekAutomaticEvent"

export class HideAndSeekAutomaticEventFactory implements AutomaticEventFactory {
    private _apiManager: IAPIManager<HideAndSeekArena> = null
    private _vector3Factory: IVector3Factory = null
    private _notificationSenderFactory: INotificationSenderFactory = null
    private _playerDataFactory: IPlayerDataFactory = null

    constructor(
        apiManager: IAPIManager<HideAndSeekArena>,
        vector3Factory: IVector3Factory,
        notificationSenderFactory: INotificationSenderFactory,
        playerDataFactory: IPlayerDataFactory,
    ) {
        this._apiManager = apiManager
        this._vector3Factory = vector3Factory
        this._notificationSenderFactory = notificationSenderFactory
        this._playerDataFactory = playerDataFactory
    }

    public create(automaticEventData: IAutomaticEventData) {
        return new HideAndSeekAutomaticEvent(
            automaticEventData,
            this._apiManager,
            this._vector3Factory,
            this._notificationSenderFactory,
            this._playerDataFactory,
        )
    }
}
