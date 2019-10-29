import { FreezePlayerModuleEvents } from "client/modules/FreezePlayerModule/FreezePlayerModuleEvents"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { PlayerDataStatus } from "core/PlayerDataProps/PlayerDataStatus"
import Knex = require("knex")
import { knexSnakeCaseMappers } from "objection"
import random from "random"
import { ICheckpointFactory } from "server/core/Checkpoint/ICheckpointFactory"
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { IVehicleFactory } from "server/core/VehicleFactory/IVehicleFactory"
import { RaceArena } from "server/entity/RaceArena"
import { RaceArenaCheckpoint } from "server/entity/RaceArenaCheckpoint"
import { RaceArenaSpawnPoint } from "server/entity/RaceArenaSpawnPoint"
import { PlayerSpawnManagerEvents } from "server/modules/PlayerSpawnManager/PlayerSpawnManagerEvents"
import { AutomaticEvent } from "../AutomaticEvent"
import { AutomaticEventManagerEvents } from "../AutomaticEventManagerEvents"
import { AutomaticEventType } from "../AutomaticEventType"
import { IAutomaticEvent } from "../IAutomaticEvent"
import { IAutomaticEventData } from "../IAutomaticEventData"
import { RaceAutomaticEventEndPlayerReasons } from "./RaceAutomaticEventEndPlayerReasons"

export class RaceAutomaticEvent extends AutomaticEvent {
    private static MAX_WINNERS: number = 3
    private _raceArena: RaceArena = null
    private _raceArenaSpawns: RaceArenaSpawnPoint[] = []
    private _checkpoints: CheckpointMp[]  = []
    private _vehicles: VehicleMp[] = []
    private _loadedPlayers: number = 0
    private _vehicleFactory: IVehicleFactory = null
    private _vector3Factory: IVector3Factory = null
    private _checkpointFactory: ICheckpointFactory = null
    private _notificationSender: INotificationSender = null
    private _playerDataFactory: IPlayerDataFactory = null
    private _players: PlayerMp[] = []
    private _nextCheckpointForPlayer: {[playerId: number]: number}
    private _winners: number = RaceAutomaticEvent.MAX_WINNERS
    private _id: number = 0
    private _startedDimension: number = 0
    private _playersAdded: boolean = false

    constructor(
        automaticEventData: IAutomaticEventData,
        vehicleFactory: IVehicleFactory,
        vector3Factory: IVector3Factory,
        checkpointFactory: ICheckpointFactory,
        notificationSenderFactory: INotificationSenderFactory,
        playerDataFactory: IPlayerDataFactory,
    ) {
        super(automaticEventData)
        this._vehicleFactory = vehicleFactory
        this._vector3Factory = vector3Factory
        this._checkpointFactory = checkpointFactory
        this._playerDataFactory = playerDataFactory
        this._notificationSender = notificationSenderFactory.create()
        this._nextCheckpointForPlayer = {}
        this._id = random.int(100, 10000000)
        this._startedDimension = this._eventDimension

        mp.events.add("playerEnterCheckpoint", (player: PlayerMp) => {
            const playerData: IPlayerData = this._playerDataFactory.create().load(player)
            if (playerData.status === PlayerDataStatus.ON_EVENT && playerData.onEvent === AutomaticEventType.RACE) {
                console.log(JSON.stringify(this._nextCheckpointForPlayer))
                this._playerEnterCheckpoint(player)
            }
        })

        mp.events.add("playerExitVehicle", (player: PlayerMp, vehicle: VehicleMp) => {
            const playerData: IPlayerData = this._playerDataFactory.create().load(player)
            const trueOnEvent = playerData.status === PlayerDataStatus.ON_EVENT &&
                playerData.onEvent === AutomaticEventType.RACE
            if (trueOnEvent && this._playersAdded) {
                this._endRaceForPlayer(player, RaceAutomaticEventEndPlayerReasons.FORCE)
            }
        })

        mp.events.add("playerDeath", (player: PlayerMp) => {
            const playerData: IPlayerData = this._playerDataFactory.create().load(player)
            if (playerData.status === PlayerDataStatus.ON_EVENT && playerData.onEvent === AutomaticEventType.RACE) {
                this._endRaceForPlayer(player, RaceAutomaticEventEndPlayerReasons.FORCE)
            }
        })

    }

    public loadArena() {
        this._eventDimension++
        this._checkpoints = []
        this._vehicles = []
        this._raceArenaSpawns = []
        this._loadedPlayers = 0
        this._players = []
        this._playersAdded = false
        this._winners = RaceAutomaticEvent.MAX_WINNERS
        console.log("Load arena " + this._id)
        RaceArena.query()
            .select()
            .orderByRaw("RAND()")
            .limit(1)
            .then((raceArenas: RaceArena[]) => {
                if (raceArenas.length > 0) {
                    const raceArena: RaceArena = raceArenas[0]
                    console.log(`Loaded arena: ${raceArena.name}`)
                    raceArena
                        .$relatedQuery("checkpoints")
                        .orderBy("id", "ASC")
                        .then((raceArenaCheckpoints: RaceArenaCheckpoint[]) => {
                            const checkpointColor: [number, number, number, number] = [
                                Math.floor(Math.random() * 255) + 1,
                                Math.floor(Math.random() * 255) + 1,
                                Math.floor(Math.random() * 255) + 1,
                                255,
                            ]
                            console.log("Loaded checkpoints: " + raceArenaCheckpoints.length)
                            let index = 0
                            raceArenaCheckpoints.forEach((raceArenaCheckpoint: RaceArenaCheckpoint) => {
                                let nextPosition: Vector3Mp = null
                                const nextIndex = index + 1
                                if (raceArenaCheckpoints[nextIndex]) {
                                    nextPosition = this._vector3Factory.create(
                                        raceArenaCheckpoints[nextIndex].x,
                                        raceArenaCheckpoints[nextIndex].y,
                                        raceArenaCheckpoints[nextIndex].z,
                                    )
                                }
                                const checkpointType = (nextPosition) ? 2 : 4
                                this._checkpoints.push(
                                    this._checkpointFactory.create(
                                        checkpointType, this._vector3Factory.create(
                                            raceArenaCheckpoint.x, raceArenaCheckpoint.y, raceArenaCheckpoint.z,
                                        ), 10, nextPosition, checkpointColor, false, this._eventDimension,
                                    ),
                                )
                                index++
                            })
                        })
                    raceArena
                        .$relatedQuery("spawns")
                        .then((raceArenaSpawns: RaceArenaSpawnPoint[]) => {
                            console.log("Max players on arena: " + raceArenaSpawns.length)
                            this._raceArenaSpawns = raceArenaSpawns
                        })
                    console.log("aID " + this._id)

                    this._raceArena = raceArena
                }
            })
    }

    public start() {
        setTimeout(() => {
            this._players.forEach((player) => {
                player.call(FreezePlayerModuleEvents.UNFREEZE_PLAYER)
                this._notificationSender.send(
                    player, "RACE_EVENT_MAP_START", NotificationType.INFO, NotificationTimeout.VERY_LONG,
                )
            })
            this._playersAdded = true
        }, 3000)

    }

    public preparePlayer(playerMp: PlayerMp) {
        console.log("prepare " + this._id)
        if (this._loadedPlayers > this._raceArenaSpawns.length - 1) {
            this._notificationSender.send(
                playerMp, "RACE_EVENT_MAP_TOO_MANY_PLAYERS", NotificationType.ERROR, NotificationTimeout.VERY_LONG,
                [this._raceArena.name],
            )
            this._endRaceForPlayer(playerMp)
        } else {
            const raceArenaSpawn: RaceArenaSpawnPoint = this._raceArenaSpawns[this._loadedPlayers]
            const randomColor: [number, number, number] = [
                Math.floor(Math.random() * 255) + 1,
                Math.floor(Math.random() * 255) + 1,
                Math.floor(Math.random() * 255) + 1,
            ]
            const vehicleForSpawn = this._vehicleFactory.create(
                raceArenaSpawn.vehicleModel,
                this._vector3Factory.create(raceArenaSpawn.x,  raceArenaSpawn.y,  raceArenaSpawn.z),
                raceArenaSpawn.rotation, undefined, undefined, [randomColor, randomColor],
                true, true, this._eventDimension,
            )
            console.log("prepare 2")
            playerMp.dimension = this._eventDimension
            playerMp.putIntoVehicle(vehicleForSpawn, -1)
            playerMp.call(FreezePlayerModuleEvents.FREEZE_PLAYER)
            console.log("oo")
            this._checkpoints.forEach((checkPoint: CheckpointMp) => {
                checkPoint.hideFor(playerMp)
            })
            this._checkpoints[0].showFor(playerMp)
            this._nextCheckpointForPlayer[playerMp.id] = 0
            console.log(JSON.stringify(this._nextCheckpointForPlayer))
            this._notificationSender.send(
                playerMp, "RACE_EVENT_MAP_INFO", NotificationType.INFO, NotificationTimeout.LONG,
                [this._raceArena.name, this._raceArena.author],
            )
            this._players.push(playerMp)
            this._loadedPlayers++
        }
    }

    private _endRaceForPlayer(
        playerMp: PlayerMp,
        reason: RaceAutomaticEventEndPlayerReasons = RaceAutomaticEventEndPlayerReasons.NORMAL,
    ) {
        const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
        if (reason === RaceAutomaticEventEndPlayerReasons.NORMAL) {
            const automaticEventData: IAutomaticEventData = this._automaticEventData

            let randomMoney: number = random.int(automaticEventData.minMoney, automaticEventData.maxMoney)
            let randomExp: number = random.int(automaticEventData.minExp, automaticEventData.maxExp)
            randomMoney *= (this._winners / RaceAutomaticEvent.MAX_WINNERS)
            randomExp *= (this._winners / RaceAutomaticEvent.MAX_WINNERS)
            this._notificationSender.send(
                playerMp, "RACE_EVENT_YOU_WIN", NotificationType.SUCCESS, NotificationTimeout.LONG,
                [(4 - this._winners).toString(), randomMoney.toString(), randomExp.toString()],
            )
            this._players.forEach((playerMpForNotification: PlayerMp) => {
                if (playerMpForNotification.id !== playerMp.id) {
                    this._notificationSender.send(
                        playerMpForNotification, "RACE_EVENT_WINNER", NotificationType.INFO, NotificationTimeout.LONG,
                        [playerData.name, (4 - this._winners).toString(), "00:00"],
                    )
                }
            })
            this._winners--
        } else {
            this._notificationSender.send(
                playerMp, "RACE_EVENT_LOOSE", NotificationType.INFO, NotificationTimeout.LONG,
            )
        }
        this._players = this._players.filter((p) => {
            return p.id !== playerMp.id
        })
        playerMp.setVariable(PlayerDataProps.STATUS, PlayerDataStatus.ACTIVE)
        playerMp.setVariable(PlayerDataProps.ON_EVENT, AutomaticEventType.NOTHING)
        mp.events.call(PlayerSpawnManagerEvents.FORCE_RESPAWN, playerMp)
        if (this._winners === 0 || this._players.length === 0) {
            this._endRace()
        }

    }

    private _endRace() {
        this._checkpoints.forEach((checkpoint) => {
            checkpoint.destroy()
        })
        this._vehicles.forEach((vehicle) => {
            vehicle.destroy()
        })
        this._eventDimension = this._startedDimension
        mp.events.call(AutomaticEventManagerEvents.EVENT_END, this.automaticEventData.name)
    }

    private _playerEnterCheckpoint(playerMp: PlayerMp) {
        console.log(this._nextCheckpointForPlayer[playerMp.id])
        console.log(playerMp.id)
        console.log("ID " + this._id)
        console.log(JSON.stringify(this._nextCheckpointForPlayer))
        console.log(JSON.stringify(this._checkpoints))
        if (!this._nextCheckpointForPlayer[playerMp.id]) {
            this._nextCheckpointForPlayer[playerMp.id] = 0
            console.log("fixed")
        }
        this._checkpoints[this._nextCheckpointForPlayer[playerMp.id]].hideFor(playerMp)
        if (this._checkpoints[this._nextCheckpointForPlayer[playerMp.id] + 1]) {
            this._nextCheckpointForPlayer[playerMp.id]++
            this._checkpoints[this._nextCheckpointForPlayer[playerMp.id]].showFor(playerMp)
        } else {
            this._endRaceForPlayer(playerMp)
        }

    }
}
