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
import { DMArenaSpawnPoint } from "server/entity/DMArenaSpawnPoint"
import { DMArenaWeapon } from "server/entity/DMArenaWeapon"
import { Arena } from "../../Arena"
import { IArenaData } from "../../IArenaData"

export class DeathmatchArena extends Arena {
    private _apiManager: IAPIManager<DMArena> = null
    private _dmArena: DMArena = null
    private _vector3Factory: IVector3Factory = null
    private _playerDataFactory: IPlayerDataFactory = null
    private _notificationSender: INotificationSender = null

    constructor(
        arenaData: IArenaData,
        apiManager: IAPIManager<DMArena>,
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
        this._apiManager.query(APIRequests.ARENA_DM).then((arenas: DMArena[]) => {
            if (arenas.length > 0) {
                const dmArena: DMArena = arenas[0]
                console.log(`Loaded arena: ${dmArena.name}`)
                this._dmArena = dmArena
            }
        })
    }

    public spawnPlayer(playerMp: PlayerMp, firstSpawn= false) {
        if (firstSpawn) {
            this._notificationSender.send(
                playerMp, "DM_ARENA_MAP_INFO",
                NotificationType.INFO, NotificationTimeout.NORMAL,
                [this._dmArena.name, this._dmArena.author],
            )
        }
        const dmSpawn: DMArenaSpawnPoint = this._dmArena.spawns[random.int(0, this._dmArena.spawns.length - 1)]
        playerMp.removeAllWeapons()
        playerMp.position = this._vector3Factory.create(
            dmSpawn.x, dmSpawn.y, dmSpawn.z,
        )
        playerMp.dimension = this._dimension
        this._dmArena.weapons.forEach((arenaWeapon: DMArenaWeapon) => {
            playerMp.giveWeapon(arenaWeapon.weapon_id, arenaWeapon.ammo)
        })
    }
}
