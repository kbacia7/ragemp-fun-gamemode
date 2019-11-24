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
import { Arena } from "../../Arena"
import { IArenaData } from "../../IArenaData"

export class DeathmatchArena extends Arena {
    private _dmArena: DMArena = null
    private _dmArenaSpawns: DMArenaSpawnPoint[] = []
    private _dmArenaWeapons: DMArenaWeapon[] = []
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
            .then((dmArenas: DMArena[]) => {
                if (dmArenas.length > 0) {
                    const dmArena: DMArena = dmArenas[0]
                    console.log(`Loaded arena: ${dmArena.name}`)
                    dmArena
                        .$relatedQuery("weapons")
                        .orderBy("id", "ASC")
                        .then((dmArenaWeapons: DMArenaWeapon[]) => {
                            this._dmArenaWeapons = dmArenaWeapons
                            console.log("Loaded weapons: " + dmArenaWeapons.length)
                        })

                    dmArena
                        .$relatedQuery("spawns")
                        .then((dmArenaSpawns: DMArenaSpawnPoint[]) => {
                            this._dmArenaSpawns = dmArenaSpawns
                        })
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
        const dmSpawn: DMArenaSpawnPoint = this._dmArenaSpawns[random.int(0, this._dmArenaSpawns.length - 1)]
        playerMp.removeAllWeapons()
        playerMp.position = this._vector3Factory.create(
            dmSpawn.x, dmSpawn.y, dmSpawn.z,
        )
        playerMp.dimension = this._dimension
        this._dmArenaWeapons.forEach((arenaWeapon: DMArenaWeapon) => {
            playerMp.giveWeapon(arenaWeapon.weaponId, arenaWeapon.ammo)
        })
    }
}
