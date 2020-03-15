import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import random from "random"
import { IAPIManager } from "server/core/API/IAPIManager"
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { HeavyDMArena } from "server/entity/HeavyDMArena"
import { HeavyDMArenaSpawnPoint } from "server/entity/HeavyDMArenaSpawnPoint"
import { HeavyDMArenaWeapon } from "server/entity/HeavyDMArenaWeapon"
import { Arena } from "../../Arena"
import { IArenaData } from "../../IArenaData"
import { APIRequests } from "server/core/API/APIRequests"

export class HeavyDeathmatchArena extends Arena {
    private _apiManager: IAPIManager<HeavyDMArena> = null
    private _heavyDmArena: HeavyDMArena = null
    private _vector3Factory: IVector3Factory = null
    private _playerDataFactory: IPlayerDataFactory = null
    private _notificationSender: INotificationSender = null

    constructor(
        arenaData: IArenaData,
        apiManager: IAPIManager<HeavyDMArena>,
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
        this._apiManager.query(APIRequests.ARENA_HEAVYDM).then((arenas: HeavyDMArena[]) => {
            if(arenas.length > 0) {
                const heavyDmArena: HeavyDMArena = arenas[0]
                console.log(`Loaded arena: ${heavyDmArena.name}`)
                this._heavyDmArena = heavyDmArena
            }
        })
    }

    public spawnPlayer(playerMp: PlayerMp, firstSpawn= false) {
        if (firstSpawn) {
            this._notificationSender.send(
                playerMp, "HEAVYDM_ARENA_MAP_INFO",
                NotificationType.INFO, NotificationTimeout.NORMAL,
                [this._heavyDmArena.name, this._heavyDmArena.author],
            )
        }
        const spawn: HeavyDMArenaSpawnPoint =
            this._heavyDmArena.spawns[random.int(0, this._heavyDmArena.spawns.length - 1)]
        playerMp.removeAllWeapons()
        playerMp.position = this._vector3Factory.create(
            spawn.x, spawn.y, spawn.z,
        )
        playerMp.dimension = this._dimension
        this._heavyDmArena.weapons.forEach((arenaWeapon: HeavyDMArenaWeapon) => {
            playerMp.giveWeapon(arenaWeapon.weapon_id, arenaWeapon.ammo)
        })
    }
}
