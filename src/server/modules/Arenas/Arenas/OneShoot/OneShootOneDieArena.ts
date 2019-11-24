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
import { OneShootArena } from "server/entity/OneShootArena"
import { OneShootArenaSpawnPoint } from "server/entity/OneShootArenaSpawnPoint"
import { OneShootArenaWeapon } from "server/entity/OneShootArenaWeapon"
import { SniperArenaEntity } from "server/entity/SniperArenaEntity"
import { SniperArenaSpawnPoint } from "server/entity/SniperArenaSpawnPoint"
import { SniperArenaWeapon } from "server/entity/SniperArenaWeapon"
import { Arena } from "../../Arena"
import { IArenaData } from "../../IArenaData"

export class OneShootOneDieArena extends Arena {
    private _oneShootArena: OneShootArena = null
    private _oneShootArenaSpawns: OneShootArenaSpawnPoint[] = []
    private _oneShootArenaWeapons: OneShootArenaWeapon[] = []
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
            .then((oneShootArenas: OneShootArena[]) => {
                if (oneShootArenas.length > 0) {
                    const oneShootArena: OneShootArena = oneShootArenas[0]
                    console.log(`Loaded arena: ${oneShootArena.name}`)
                    oneShootArena
                        .$relatedQuery("weapons")
                        .orderBy("id", "ASC")
                        .then((oneShootArenaWeapons: OneShootArenaWeapon[]) => {
                            this._oneShootArenaWeapons = oneShootArenaWeapons
                            console.log("Loaded weapons: " + oneShootArenaWeapons.length)
                        })

                    oneShootArena
                        .$relatedQuery("spawns")
                        .then((oneShootArenaSpawns: OneShootArenaSpawnPoint[]) => {
                            this._oneShootArenaSpawns = oneShootArenaSpawns
                        })
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
            this._oneShootArenaSpawns[random.int(0, this._oneShootArenaSpawns.length - 1)]
        playerMp.removeAllWeapons()
        playerMp.health = 5
        playerMp.position = this._vector3Factory.create(
            spawn.x, spawn.y, spawn.z,
        )
        playerMp.dimension = this._dimension
        this._oneShootArenaWeapons.forEach((arenaWeapon: OneShootArenaWeapon) => {
            playerMp.giveWeapon(arenaWeapon.weaponId, arenaWeapon.ammo)
        })
    }
}
