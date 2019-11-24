import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import random from "random"
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { DMArena } from "server/entity/DMArena"
import { DMArenaSpawnPoint } from "server/entity/DMArenaSpawnPoint"
import { DMArenaWeapon } from "server/entity/DMArenaWeapon"
import { HeavyDMArena } from "server/entity/HeavyDMArena"
import { HeavyDMArenaSpawnPoint } from "server/entity/HeavyDMArenaSpawnPoint"
import { HeavyDMArenaWeapon } from "server/entity/HeavyDMArenaWeapon"
import { Arena } from "../../Arena"
import { IArenaData } from "../../IArenaData"

export class HeavyDeathmatchArena extends Arena {
    private _heavyDmArena: HeavyDMArena = null
    private _heavyDmArenaSpawns: HeavyDMArenaSpawnPoint[] = []
    private _heavyDmArenaWeapons: HeavyDMArenaWeapon[] = []
    private _vector3Factory: IVector3Factory = null
    private _playerDataFactory: IPlayerDataFactory = null
    private _notificationSender: INotificationSender = null

    constructor(
        arenaData: IArenaData,
        vector3Factory: IVector3Factory,
        notificationSenderFactory: INotificationSenderFactory,
        playerDataFactory: IPlayerDataFactory,
    ) {
        super(arenaData)
        this._vector3Factory = vector3Factory
        this._playerDataFactory = playerDataFactory
        this._notificationSender = notificationSenderFactory.create()
    }

    public loadArena() {
        DMArena.query()
            .select()
            .where("active", "=", true)
            .limit(1)
            .then((heavyDmArenas: HeavyDMArena[]) => {
                if (heavyDmArenas.length > 0) {
                    const heavyDmArena: HeavyDMArena = heavyDmArenas[0]
                    console.log(`Loaded arena: ${heavyDmArena.name}`)
                    heavyDmArena
                        .$relatedQuery("weapons")
                        .orderBy("id", "ASC")
                        .then((heavyDmArenaWeapons: HeavyDMArenaWeapon[]) => {
                            this._heavyDmArenaWeapons = heavyDmArenaWeapons
                            console.log("Loaded weapons: " + heavyDmArenaWeapons.length)
                        })

                    heavyDmArena
                        .$relatedQuery("spawns")
                        .then((heavyDmArenaSpawns: HeavyDMArenaSpawnPoint[]) => {
                            this._heavyDmArenaSpawns = heavyDmArenaSpawns
                        })
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
            this._heavyDmArenaSpawns[random.int(0, this._heavyDmArenaSpawns.length - 1)]
        playerMp.removeAllWeapons()
        playerMp.position = this._vector3Factory.create(
            spawn.x, spawn.y, spawn.z,
        )
        playerMp.dimension = this._dimension
        this._heavyDmArenaWeapons.forEach((arenaWeapon: HeavyDMArenaWeapon) => {
            playerMp.giveWeapon(arenaWeapon.weaponId, arenaWeapon.ammo)
        })
    }
}
