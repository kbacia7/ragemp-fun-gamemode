import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
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
import { AutomaticEvent } from "../AutomaticEvent"
import { AutomaticEventManagerEvents } from "../AutomaticEventManagerEvents"
import { AutomaticEventType } from "../AutomaticEventType"
import { IAutomaticEvent } from "../IAutomaticEvent"
import { IAutomaticEventData } from "../IAutomaticEventData"

export class RaceAutomaticEvent extends AutomaticEvent {
    private static MAX_WINNERS: number = 3
    private _raceArena: RaceArena = null
    private _raceArenaCheckpoints: RaceArenaCheckpoint[] = []
    private _raceArenaSpawns: RaceArenaSpawnPoint[] = []
    private _checkpoints: CheckpointMp[]  = []
    private _vehicles: VehicleMp[] = []
    private _loadedPlayers: number = 0
    private _vehicleFactory: IVehicleFactory = null
    private _vector3Factory: IVector3Factory = null
    private _checkpointFactory: ICheckpointFactory = null
    private _notificationSender: INotificationSender = null
    private _playerDataFactory: IPlayerDataFactory = null
    private _players: PlayerMp[]
    private _nextCheckpointForPlayer: {[playerId: number]: number} = {}
    private _winners: number = RaceAutomaticEvent.MAX_WINNERS

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

        mp.events.add("playerEnterCheckpoint", (player: PlayerMp) => {
            const playerData: IPlayerData = this._playerDataFactory.create().load(player)
            if (playerData.status === PlayerDataStatus.ON_EVENT && playerData.onEvent === AutomaticEventType.RACE) {
                this._playerEnterCheckpoint(player)
            }
        })

    }

    public loadArena() {
        RaceArena.query()
            .select()
            .orderByRaw("RAND()")
            .limit(1)
            .then((raceArenas: RaceArena[]) => {
                if (raceArenas.length > 0) {
                    const raceArena: RaceArena = raceArenas[0]
                    raceArena
                        .$relatedQuery("races_arenas_checkpoints")
                        .orderBy("id", "ASC")
                        .then((raceArenaCheckpoints: RaceArenaCheckpoint[]) => {
                            const checkpointColor: [number, number, number, number] = [
                                Math.floor(Math.random() * 255) + 1,
                                Math.floor(Math.random() * 255) + 1,
                                Math.floor(Math.random() * 255) + 1,
                                255,
                            ]
                            this._raceArenaCheckpoints = raceArenaCheckpoints
                            let index = 0
                            raceArenaCheckpoints.forEach((raceArenaCheckpoint: RaceArenaCheckpoint) => {
                                let nextPosition: Vector3Mp
                                if (raceArenaCheckpoints[index]) {
                                    nextPosition = this._vector3Factory.create(
                                        raceArenaCheckpoints[index].x,
                                        raceArenaCheckpoints[index].y,
                                        raceArenaCheckpoints[index].z,
                                    )
                                }
                                this._checkpoints.push(
                                    this._checkpointFactory.create(
                                        2, this._vector3Factory.create(
                                            raceArenaCheckpoint.x, raceArenaCheckpoint.y, raceArenaCheckpoint.z,
                                        ), 10, nextPosition, checkpointColor, false, this._eventDimension,
                                    ),
                                )
                                index++
                            })
                        })
                    raceArena
                        .$relatedQuery("races_arenas_spawns")
                        .then((raceArenaSpawns: RaceArenaSpawnPoint[]) => {
                            this._raceArenaSpawns = raceArenaSpawns
                        })
                    this._raceArena = raceArena
                }
            })
    }

    public preparePlayer(playerMp: PlayerMp) {
        if (this._loadedPlayers > this._raceArenaSpawns.length - 1) {
            this._notificationSender.send(
                playerMp, "RACE_EVENT_MAP_TOO_MANY_PLAYERS", NotificationType.ERROR, NotificationTimeout.VERY_LONG,
                [this._raceArena.name],
            )
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
                true, true, super._eventDimension,
            )
            playerMp.dimension = super._eventDimension
            playerMp.putIntoVehicle(vehicleForSpawn, -1)
            playerMp.freezePosition(true)
            this._checkpoints[0].showFor(playerMp)
            this._nextCheckpointForPlayer[playerMp.id] = 1

            this._notificationSender.send(
                playerMp, "RACE_EVENT_MAP_INFO", NotificationType.INFO, NotificationTimeout.LONG,
                [this._raceArena.name, this._raceArena.author],
            )
            this._players.push(playerMp)
            this._loadedPlayers++
        }
    }

    private _endRaceForPlayer(playerMp: PlayerMp) {
        const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
        const automaticEventData: IAutomaticEventData = this._automaticEventData

        let randomMoney: number = random.int(automaticEventData.minMoney, automaticEventData.maxMoney)
        let randomExp: number = random.int(automaticEventData.minExp, automaticEventData.maxExp)
        randomMoney *= (this._winners / RaceAutomaticEvent.MAX_WINNERS)
        randomExp *= (this._winners / RaceAutomaticEvent.MAX_WINNERS)
        this._notificationSender.send(
            playerMp, "RACE_EVENT_YOU_WIN", NotificationType.SUCCESS, NotificationTimeout.LONG,
            [(4 - this._winners).toString(), randomMoney.toString(), randomExp.toString()],
        )
        this._winners--
        if (this._winners === 0) {
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
        mp.events.call(AutomaticEventManagerEvents.EVENT_END)
    }

    private _playerEnterCheckpoint(playerMp: PlayerMp) {
        this._checkpoints[this._nextCheckpointForPlayer[playerMp.id]].hideFor(playerMp)
        if (this._checkpoints[this._nextCheckpointForPlayer[playerMp.id] + 1]) {
            this._nextCheckpointForPlayer[playerMp.id]++
            this._checkpoints[this._nextCheckpointForPlayer[playerMp.id]].showFor(playerMp)
        } else {
            this._endRaceForPlayer(playerMp)
        }

    }
}
