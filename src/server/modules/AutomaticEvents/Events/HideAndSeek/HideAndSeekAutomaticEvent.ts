import { ChangePlayerPedModuleEvents } from "client/modules/ChangePlayerPedModule/ChangePlayerPedModuleEvents"
import { FreezePlayerModuleEvents } from "client/modules/FreezePlayerModule/FreezePlayerModuleEvents"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { PlayerDataStatus } from "core/PlayerDataProps/PlayerDataStatus"
import random from "random"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { IVehicleFactory } from "server/core/VehicleFactory/IVehicleFactory"
import { HideAndSeekArena } from "server/entity/HideAndSeekArena"
import { HideAndSeekArenaSpawnPoint } from "server/entity/HideAndSeekArenaSpawnPoint"
import { Setting } from "server/entity/Setting"
import { PlayerQuitEvents } from "server/modules/PlayerSave/PlayerQuitEvents"
import { PlayerSpawnManagerEvents } from "server/modules/PlayerSpawnManager/PlayerSpawnManagerEvents"
import { AutomaticEvent } from "../../AutomaticEvent"
import { AutomaticEventManagerEvents } from "../../AutomaticEventManagerEvents"
import { AutomaticEventType } from "../../AutomaticEventType"
import { IAutomaticEventData } from "../../IAutomaticEventData"
import { HideAndSeekAutomaticEventPageEvents } from "./HideAndSeekAutomaticEventPageEvents"
export class HideAndSeekAutomaticEvent extends AutomaticEvent {
    private static TIME_TO_HIDE: number = 180000
    private static LOOKING_WEAPON: number = 0x476BF155
    private _apiManager: IAPIManager<HideAndSeekArena> = null
    private _hideAndSeekArena: HideAndSeekArena = null
    private _vector3Factory: IVector3Factory = null
    private _notificationSender: INotificationSender = null
    private _playerDataFactory: IPlayerDataFactory = null
    private _players: PlayerMp[] = []
    private _startedDimension: number = 0
    private _playersAdded: boolean = false
    private _looking: PlayerMp = null
    private _lookingWaitRoom: Vector3Mp = null
    constructor(
        automaticEventData: IAutomaticEventData,
        apiManager: IAPIManager<HideAndSeekArena>,
        vector3Factory: IVector3Factory,
        notificationSenderFactory: INotificationSenderFactory,
        playerDataFactory: IPlayerDataFactory,
    ) {
        super(automaticEventData)
        this._apiManager = apiManager
        this._vector3Factory = vector3Factory
        this._playerDataFactory = playerDataFactory
        this._notificationSender = notificationSenderFactory.create()
        this._startedDimension = this._eventDimension

        mp.events.add("playerDeath", (player: PlayerMp) => {
            const playerData: IPlayerData = this._playerDataFactory.create().load(player)
            const onEvent = playerData.onEvent === AutomaticEventType.HIDEANDSEEK
            if (playerData.status === PlayerDataStatus.ON_EVENT && onEvent) {
                this._endMatchForPlayer(player)
            }
        })

        mp.events.add("playerDamage", (player: PlayerMp) => {
            const playerData: IPlayerData = this._playerDataFactory.create().load(player)
            const onEvent = playerData.onEvent === AutomaticEventType.HIDEANDSEEK
            if (playerData.status === PlayerDataStatus.ON_EVENT && onEvent) {
                if (player.id === this._looking.id) {
                    player.health = 100
                }
            }
        })

        mp.events.add(PlayerQuitEvents.PLAYER_QUIT_ON_EVENT, (playerData: IPlayerData) => {
            if (playerData.onEvent === AutomaticEventType.HIDEANDSEEK) {
                this._players = this._players.filter((p) => {
                    return p.id !== playerData.id
                })
                if (playerData.id === this._looking.id) {
                    this._endMatch()
                }
            }
        })

        const evName = this._automaticEventData.name
        /*Setting.query()
                .select()
                .where("name", "LIKE", `${evName}_%`)
                .then((settingsFromDb: Setting[]) => {
                    if (settingsFromDb.length > 0) {
                        console.log(`Load settings for ${evName} event ${settingsFromDb.length}`)
                        const mappedSettingsByName: { [name: string]: string } = Object.assign(
                            {},
                            ...(settingsFromDb.map((item) => ({ [item.name]: item.value }))),
                        )
                        this._lookingWaitRoom = this._vector3Factory.create(
                            parseFloat(mappedSettingsByName.hideandseek_looking_wait_room_x),
                            parseFloat(mappedSettingsByName.hideandseek_looking_wait_room_y),
                            parseFloat(mappedSettingsByName.hideandseek_looking_wait_room_z),
                        )
                    }
                })*/

    }

    public loadArena() {
        this._eventDimension++
        this._players = []
        this._playersAdded = false
        this._apiManager.query(APIRequests.EVENT_HIDEANDSEEK).then((arenas: HideAndSeekArena[]) => {
            if (arenas.length > 0) {
                const hideAndSeekArena: HideAndSeekArena = arenas[0]
                console.log(`Loaded arena: ${hideAndSeekArena.name}`)
                this._hideAndSeekArena = hideAndSeekArena
            }
        })
    }

    public start() {
        setTimeout(() => {
            this._players.forEach((player: PlayerMp) => {
                player.call(HideAndSeekAutomaticEventPageEvents.DISPLAY_PAGE, [
                    this.automaticEventData.name, this.automaticEventData.displayName,
                ])
                player.call(FreezePlayerModuleEvents.UNFREEZE_PLAYER)
                this._notificationSender.send(
                    player, "HIDE_AND_SEEK_EVENT_MAP_START", NotificationType.INFO, NotificationTimeout.VERY_LONG,
                )
            })
            setTimeout(() => {
                const hideAndSeekArenaSpawn: HideAndSeekArenaSpawnPoint =
                    this._hideAndSeekArena[random.int(0, this._hideAndSeekArena.spawns.length - 1)]
                this._looking.position  = this._vector3Factory.create(
                    hideAndSeekArenaSpawn.x, hideAndSeekArenaSpawn.y, hideAndSeekArenaSpawn.z,
                )
                this._looking.giveWeapon(HideAndSeekAutomaticEvent.LOOKING_WEAPON, 999999)
                this._players.forEach((player: PlayerMp) => {
                    this._notificationSender.send(
                        player, "HIDE_AND_SEEK_EVENT_MATCH_START", NotificationType.INFO, NotificationTimeout.VERY_LONG,
                    )
                })
            }, HideAndSeekAutomaticEvent.TIME_TO_HIDE)
            this._playersAdded = true
        }, 3000)

    }

    public preparePlayer(playerMp: PlayerMp) {
            const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
            const isLooking = random.int(0, 100) % 2 === 0 && !this._looking
            const hideAndSeekArenaSpawn: HideAndSeekArenaSpawnPoint =
                this._hideAndSeekArena.spawns[random.int(0, this._hideAndSeekArena.spawns.length - 1)]
            playerMp.dimension = this._eventDimension
            if (isLooking) {
                this._looking = playerMp
                this._notificationSender.send(
                    playerMp, "HIDE_AND_SEEK_EVENT_YOU_LOOKING", NotificationType.INFO, NotificationTimeout.LONG,
                )
                playerMp.position = this._lookingWaitRoom
            } else {
                playerMp.position = this._vector3Factory.create(
                    hideAndSeekArenaSpawn.x, hideAndSeekArenaSpawn.y, hideAndSeekArenaSpawn.z,
                )
            }
            playerMp.call(FreezePlayerModuleEvents.FREEZE_PLAYER)
            this._notificationSender.send(
                playerMp, "HIDE_AND_SEEK_EVENT_MAP_INFO", NotificationType.INFO, NotificationTimeout.LONG,
                [this._hideAndSeekArena.name, this._hideAndSeekArena.author],
            )
            this._players.push(playerMp)
    }

    private _endMatchForPlayer(playerMp: PlayerMp) {
        const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
        this._players = this._players.filter((p) => {
            return p.id !== playerMp.id
        })
        playerMp.setVariable(PlayerDataProps.STATUS, PlayerDataStatus.ACTIVE)
        playerMp.setVariable(PlayerDataProps.ON_EVENT, AutomaticEventType.NOTHING)
        this._players.forEach((p: PlayerMp) => {
            p.call(HideAndSeekAutomaticEventPageEvents.UPDATE_PAGE, [

            ])
        })
        playerMp.call(HideAndSeekAutomaticEventPageEvents.REMOVE_PAGE)
        mp.events.call(PlayerSpawnManagerEvents.FORCE_RESPAWN, playerMp)
        if (this._players.length <= 2) {
            this._endMatch()
        }

    }

    private _endMatch() {
        this._eventDimension = this._startedDimension
        const automaticEventData: IAutomaticEventData = this._automaticEventData

        if (this._looking === null) {
            this._players.forEach((playerMp: PlayerMp) => {
                this._notificationSender.send(
                    playerMp, "HIDE_AND_SEEK_EVENT_LOOKING_LEAVE", NotificationType.INFO, NotificationTimeout.LONG,
                )
            })
            mp.events.call(
                AutomaticEventManagerEvents.EVENT_END, this.automaticEventData.name,
            )
        } else {
            const winner = this._players.filter((p) => p.id !== this._looking.id)[0]
            const playerData: IPlayerData = this._playerDataFactory.create().load(winner)
            const randomMoney: number = random.int(automaticEventData.minMoney, automaticEventData.maxMoney)
            const randomExp: number = random.int(automaticEventData.minExp, automaticEventData.maxExp)
            this._notificationSender.send(
                winner, "HIDE_AND_SEEK_EVENT_YOU_WIN", NotificationType.SUCCESS, NotificationTimeout.LONG,
                [randomMoney.toString(), randomExp.toString()],
            )
            mp.events.call(
                AutomaticEventManagerEvents.EVENT_END, this.automaticEventData.name, playerData.name,
            )
        }
    }
}
