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
import { IBlipFactory } from "server/core/BlipFactory/IBlipFactory"
import { ICheckpointFactory } from "server/core/Checkpoint/ICheckpointFactory"
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { IVehicleFactory } from "server/core/VehicleFactory/IVehicleFactory"
import { DerbyArena } from "server/entity/DerbyArena"
import { DerbyArenaSpawnPoint } from "server/entity/DerbyArenaSpawnPoint"
import { PlayerQuitEvents } from "server/modules/PlayerSave/PlayerQuitEvents"
import { PlayerSpawnManagerEvents } from "server/modules/PlayerSpawnManager/PlayerSpawnManagerEvents"
import { AutomaticEvent } from "../../AutomaticEvent"
import { AutomaticEventManagerEvents } from "../../AutomaticEventManagerEvents"
import { AutomaticEventType } from "../../AutomaticEventType"
import { IAutomaticEvent } from "../../IAutomaticEvent"
import { IAutomaticEventData } from "../../IAutomaticEventData"
import { DerbyAutomaticEventEndPlayerReasons } from "./DerbyAutomaticEventEndPlayerReasons"
import { DerbyAutomaticEventPageEvents } from "./DerbyAutomaticEventPageEvents"

export class DerbyAutomaticEvent extends AutomaticEvent {
    private _apiManager: IAPIManager<DerbyArena> = null
    private _derbyArena: DerbyArena = null
    private _vehicles: VehicleMp[] = []
    private _loadedPlayers: number = 0
    private _vehicleFactory: IVehicleFactory = null
    private _vector3Factory: IVector3Factory = null
    private _notificationSender: INotificationSender = null
    private _playerDataFactory: IPlayerDataFactory = null
    private _players: PlayerMp[] = []
    private _startedDimension: number = 0
    private _playersAdded: boolean = false
    private _playersLooseInterval = null

    constructor(
        automaticEventData: IAutomaticEventData,
        apiManager: IAPIManager<DerbyArena>,
        vehicleFactory: IVehicleFactory,
        vector3Factory: IVector3Factory,
        notificationSenderFactory: INotificationSenderFactory,
        playerDataFactory: IPlayerDataFactory,
    ) {
        super(automaticEventData)
        this._apiManager = apiManager
        this._vehicleFactory = vehicleFactory
        this._vector3Factory = vector3Factory
        this._playerDataFactory = playerDataFactory
        this._notificationSender = notificationSenderFactory.create()
        this._startedDimension = this._eventDimension

        mp.events.add("playerExitVehicle", (player: PlayerMp) => {
            const playerData: IPlayerData = this._playerDataFactory.create().load(player)
            const trueOnEvent = playerData.status === PlayerDataStatus.ON_EVENT &&
                playerData.onEvent === AutomaticEventType.DERBY
            if (trueOnEvent && this._playersAdded) {
                this._endDerbyForPlayer(player, DerbyAutomaticEventEndPlayerReasons.FORCE)
            }
        })

        mp.events.add("playerDeath", (player: PlayerMp) => {
            const playerData: IPlayerData = this._playerDataFactory.create().load(player)
            if (playerData.status === PlayerDataStatus.ON_EVENT && playerData.onEvent === AutomaticEventType.DERBY) {
                this._endDerbyForPlayer(player, DerbyAutomaticEventEndPlayerReasons.FORCE)
            }
        })

        mp.events.add(PlayerQuitEvents.PLAYER_QUIT_ON_EVENT, (playerData: IPlayerData) => {
            if (playerData.onEvent === AutomaticEventType.DERBY) {
                this._players = this._players.filter((p) => {
                    return p.id !== playerData.id
                })
                if (this._players.length === 0) {
                    this._endMatch()
                }
            }
        })

    }

    public loadArena() {
        this._eventDimension++
        this._vehicles = []
        this._loadedPlayers = 0
        this._players = []
        this._playersAdded = false
        this._apiManager.query(APIRequests.EVENT_DERBY).then((arenas: DerbyArena[]) => {
            if (arenas.length > 0) {
                const derbyArena: DerbyArena = arenas[0]
                console.log(`Loaded arena: ${derbyArena.name}`)
                this._derbyArena = derbyArena
            }
        })
    }

    public start() {
        setTimeout(() => {
            this._players.forEach((player: PlayerMp) => {
                player.call(DerbyAutomaticEventPageEvents.DISPLAY_PAGE, [
                    this.automaticEventData.name, this.automaticEventData.displayName,
                    this._getPlayersNames(),

                ])
                player.call(FreezePlayerModuleEvents.UNFREEZE_PLAYER)
                this._notificationSender.send(
                    player, "DERBY_EVENT_MAP_START", NotificationType.INFO, NotificationTimeout.VERY_LONG,
                )
            })
            this._playersAdded = true
        }, 3000)

        this._playersLooseInterval = setInterval(() => {
            this._checkPlayersDropOverMap()
        }, 1000)

    }

    public _getPlayersNames() {
        const names = []
        this._players.forEach((playerMp: PlayerMp) => {
            const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
            names.push(playerData.name)
        })
        return names
    }

    public _checkPlayersDropOverMap() {
        this._players.forEach((playerMp: PlayerMp) => {
            if (playerMp.vehicle) {
                this._vehicles.forEach((vehicleMp: VehicleMp) => {
                    if (vehicleMp.id === playerMp.vehicle.id) {
                        playerMp.removeFromVehicle()
                        vehicleMp.destroy()
                        this._endDerbyForPlayer(playerMp)
                    }
                })
            }
        })
    }

    public preparePlayer(playerMp: PlayerMp) {
        if (this._loadedPlayers > this._derbyArena.spawns.length - 1) {
            this._notificationSender.send(
                playerMp, "DERBY_EVENT_MAP_TOO_MANY_PLAYERS", NotificationType.ERROR, NotificationTimeout.VERY_LONG,
                [this._derbyArena.name],
            )
            this._endDerbyForPlayer(playerMp)
        } else {
            const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
            const derbyArenaSpawn: DerbyArenaSpawnPoint = this._derbyArena.spawns[this._loadedPlayers]
            const randomColor: [number, number, number] = [
                random.int(1, 255),
                random.int(1, 255),
                random.int(1, 255),
            ]
            this._vehicles.push(this._vehicleFactory.create(
                this._derbyArena.vehicle_model,
                this._vector3Factory.create(derbyArenaSpawn.x,  derbyArenaSpawn.y,  derbyArenaSpawn.z),
                derbyArenaSpawn.rotation, undefined, undefined, [randomColor, randomColor],
                true, true, this._eventDimension,
            ))
            const vehicleForSpawn = this._vehicles[this._vehicles.length - 1]
            playerMp.dimension = this._eventDimension
            playerMp.putIntoVehicle(vehicleForSpawn, -1)
            playerMp.call(FreezePlayerModuleEvents.FREEZE_PLAYER)
            this._notificationSender.send(
                playerMp, "DERBY_EVENT_MAP_INFO", NotificationType.INFO, NotificationTimeout.LONG,
                [this._derbyArena.name, this._derbyArena.author],
            )
            this._players.push(playerMp)
            this._loadedPlayers++
        }
    }

    private _endDerbyForPlayer(
        playerMp: PlayerMp,
        reason: DerbyAutomaticEventEndPlayerReasons = DerbyAutomaticEventEndPlayerReasons.NORMAL,
    ) {
        const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
        if (reason === DerbyAutomaticEventEndPlayerReasons.NORMAL) {
            const automaticEventData: IAutomaticEventData = this._automaticEventData

            const randomMoney: number = random.int(automaticEventData.minMoney, automaticEventData.maxMoney)
            const randomExp: number = random.int(automaticEventData.minExp, automaticEventData.maxExp)
            this._notificationSender.send(
                playerMp, "DERBY_EVENT_YOU_WIN", NotificationType.SUCCESS, NotificationTimeout.LONG,
                [randomMoney.toString(), randomExp.toString()],
            )
            this._players.forEach((playerMpForNotification: PlayerMp) => {
                if (playerMpForNotification.id !== playerMp.id) {
                    this._notificationSender.send(
                        playerMpForNotification, "DERBY_EVENT_WINNER", NotificationType.INFO, NotificationTimeout.LONG,
                        [playerData.name],
                    )
                }
            })
        } else {
            this._notificationSender.send(
                playerMp, "DERBY_EVENT_LOOSE", NotificationType.INFO, NotificationTimeout.LONG,
            )
        }
        playerMp.call(DerbyAutomaticEventPageEvents.REMOVE_PAGE)
        this._players = this._players.filter((p) => {
            return p.id !== playerMp.id
        })
        this._players.forEach((playerOnDerby: PlayerMp) => {
            playerOnDerby.call(DerbyAutomaticEventPageEvents.UPDATE_PAGE, [
                this._getPlayersNames(),
            ])

        })
        playerMp.setVariable(PlayerDataProps.STATUS, PlayerDataStatus.ACTIVE)
        playerMp.setVariable(PlayerDataProps.ON_EVENT, AutomaticEventType.NOTHING)
        mp.events.call(PlayerSpawnManagerEvents.FORCE_RESPAWN, playerMp)
        if (this._players.length <= 1) {
            this._endMatch()
        }

    }

    private _endMatch() {
        this._vehicles.forEach((vehicle) => {
            vehicle.destroy()
        })
        this._eventDimension = this._startedDimension
        clearInterval(this._playersLooseInterval)
        mp.events.call(AutomaticEventManagerEvents.EVENT_END, this.automaticEventData.name)
    }
}
