import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import random from "random"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { DMArena } from "server/entity/DMArena"
import { SniperArena as SniperArenaEntity } from "server/entity/SniperArena"
import { SniperArenaSpawnPoint } from "server/entity/SniperArenaSpawnPoint"
import { SniperArenaWeapon } from "server/entity/SniperArenaWeapon"
import { Arena } from "../../Arena"
import { IArenaData } from "../../IArenaData"

export class SniperArena extends Arena {
    private _apiManager: IAPIManager<SniperArenaEntity> = null
    private _sniperArena: SniperArenaEntity = null
    private _vector3Factory: IVector3Factory = null
    private _playerDataFactory: IPlayerDataFactory = null
    private _notificationSender: INotificationSender = null

    constructor(
        arenaData: IArenaData,
        apiManager: IAPIManager<SniperArenaEntity>,
        vector3Factory: IVector3Factory,
        notificationSenderFactory: INotificationSenderFactory,
        playerDataFactory: IPlayerDataFactory,
    ) {
        super(arenaData)
        this._apiManager = apiManager
        this._vector3Factory = vector3Factory
        this._playerDataFactory = playerDataFactory
        this._notificationSender = notificationSenderFactory.create()
    }

    public loadArena() {
        this._apiManager.query(APIRequests.ARENA_SNIPER).then((arenas: SniperArenaEntity[]) => {
            if (arenas.length > 0) {
                const sniperArena: SniperArenaEntity = arenas[0]
                console.log(`Loaded arena: ${sniperArena.name}`)
                this._sniperArena = sniperArena
            }
        })
    }

    public spawnPlayer(playerMp: PlayerMp, firstSpawn= false) {
        if (firstSpawn) {
            this._notificationSender.send(
                playerMp, "SNIPER_ARENA_MAP_INFO",
                NotificationType.INFO, NotificationTimeout.NORMAL,
                [this._sniperArena.name, this._sniperArena.author],
            )
        }
        const spawn: SniperArenaSpawnPoint =
            this._sniperArena.spawns[random.int(0, this._sniperArena.spawns.length - 1)]
        playerMp.removeAllWeapons()
        playerMp.position = this._vector3Factory.create(
            spawn.x, spawn.y, spawn.z,
        )
        playerMp.dimension = this._dimension
        this._sniperArena.weapons.forEach((arenaWeapon: SniperArenaWeapon) => {
            playerMp.giveWeapon(arenaWeapon.weapon_id, arenaWeapon.ammo)
        })
    }
}
