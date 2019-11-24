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
import { SniperArenaEntity } from "server/entity/SniperArenaEntity"
import { SniperArenaSpawnPoint } from "server/entity/SniperArenaSpawnPoint"
import { SniperArenaWeapon } from "server/entity/SniperArenaWeapon"

export class SniperArena extends Arena {
    private _sniperArena: SniperArenaEntity = null
    private _sniperArenaSpawns: SniperArenaSpawnPoint[] = []
    private _sniperArenaWeapons: SniperArenaWeapon[] = []
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
            .then((sniperArenas: SniperArenaEntity[]) => {
                if (sniperArenas.length > 0) {
                    const sniperArena: SniperArenaEntity = sniperArenas[0]
                    console.log(`Loaded arena: ${sniperArena.name}`)
                    sniperArena
                        .$relatedQuery("weapons")
                        .orderBy("id", "ASC")
                        .then((sniperArenaWeapons: SniperArenaWeapon[]) => {
                            this._sniperArenaWeapons = sniperArenaWeapons
                            console.log("Loaded weapons: " + sniperArenaWeapons.length)
                        })

                    sniperArena
                        .$relatedQuery("spawns")
                        .then((sniperArenaSpawns: SniperArenaSpawnPoint[]) => {
                            this._sniperArenaSpawns = sniperArenaSpawns
                        })
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
            this._sniperArenaSpawns[random.int(0, this._sniperArenaSpawns.length - 1)]
        playerMp.removeAllWeapons()
        playerMp.position = this._vector3Factory.create(
            spawn.x, spawn.y, spawn.z,
        )
        playerMp.dimension = this._dimension
        this._sniperArenaWeapons.forEach((arenaWeapon: SniperArenaWeapon) => {
            playerMp.giveWeapon(arenaWeapon.weaponId, arenaWeapon.ammo)
        })
    }
}
