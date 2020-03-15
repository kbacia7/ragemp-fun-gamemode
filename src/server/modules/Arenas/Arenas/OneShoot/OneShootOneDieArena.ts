import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import random from "random"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { OneShootArena } from "server/entity/OneShootArena"
import { OneShootArenaSpawnPoint } from "server/entity/OneShootArenaSpawnPoint"
import { OneShootArenaWeapon } from "server/entity/OneShootArenaWeapon"
import { Arena } from "../../Arena"
import { IArenaData } from "../../IArenaData"

export class OneShootOneDieArena extends Arena {
    private _apiManager: IAPIManager<OneShootArena> = null
    private _oneShootArena: OneShootArena = null
    private _vector3Factory: IVector3Factory = null
    private _playerDataFactory: IPlayerDataFactory = null
    private _notificationSender: INotificationSender = null

    constructor(
        arenaData: IArenaData,
        apiManager: IAPIManager<OneShootArena>,
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
        this._apiManager.query(APIRequests.ARENA_ONESHOOT).then((arenas: OneShootArena[]) => {
            if (arenas.length > 0) {
                const oneShootArena: OneShootArena = arenas[0]
                console.log(`Loaded arena: ${oneShootArena.name}`)
                this._oneShootArena = oneShootArena
            }
        })
    }

    public spawnPlayer(playerMp: PlayerMp, firstSpawn= false) {
        if (firstSpawn) {
            this._notificationSender.send(
                playerMp, "ONESHOOT_ARENA_MAP_INFO",
                NotificationType.INFO, NotificationTimeout.NORMAL,
                [this._oneShootArena.name, this._oneShootArena.author],
            )
        }
        const spawn: OneShootArenaSpawnPoint =
            this._oneShootArena.spawns[random.int(0, this._oneShootArena.spawns.length - 1)]
        playerMp.removeAllWeapons()
        playerMp.health = 5
        playerMp.position = this._vector3Factory.create(
            spawn.x, spawn.y, spawn.z,
        )
        playerMp.dimension = this._dimension
        this._oneShootArena.weapons.forEach((arenaWeapon: OneShootArenaWeapon) => {
            playerMp.giveWeapon(arenaWeapon.weapon_id, arenaWeapon.ammo)
        })
    }
}
