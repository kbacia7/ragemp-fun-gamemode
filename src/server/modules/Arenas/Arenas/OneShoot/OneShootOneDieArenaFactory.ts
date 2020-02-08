import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { IArenaData } from "../../IArenaData"
import { IArenaFactory } from "../../IArenaFactory"
import { OneShootOneDieArena } from "./OneShootOneDieArena"
import { OneShootArena } from "server/entity/OneShootArena"
import { IAPIManager } from "server/core/API/IAPIManager"

export class OneShootOneDieArenaFactory implements IArenaFactory {
    private _vector3Factory: IVector3Factory = null
    private _apiManager: IAPIManager<OneShootArena> = null
    private _playerDataFactory: IPlayerDataFactory = null
    private _notificationSenderFactory: INotificationSenderFactory = null
    constructor(
        apiManager: IAPIManager<OneShootArena>,
        vector3Factory: IVector3Factory,
        notificationSenderFactory: INotificationSenderFactory,
        playerDataFactory: IPlayerDataFactory,
    ) {
        this._vector3Factory = vector3Factory
        this._apiManager = apiManager
        this._notificationSenderFactory = notificationSenderFactory
        this._playerDataFactory = playerDataFactory
    }

    public create(arenaData: IArenaData) {
        return new OneShootOneDieArena(
            arenaData,
            this._apiManager,
            this._vector3Factory,
            this._notificationSenderFactory,
            this._playerDataFactory,
        )
    }
}
