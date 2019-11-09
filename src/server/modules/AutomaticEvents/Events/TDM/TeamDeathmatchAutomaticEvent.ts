import { ChangePlayerPedModuleEvents } from "client/modules/ChangePlayerPedModule/ChangePlayerPedModuleEvents"
import { FreezePlayerModuleEvents } from "client/modules/FreezePlayerModule/FreezePlayerModuleEvents"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { PlayerDataStatus } from "core/PlayerDataProps/PlayerDataStatus"
import Knex = require("knex")
import * as luxon from "luxon"
import { knexSnakeCaseMappers } from "objection"
import random from "random"
import { IBlipFactory } from "server/core/BlipFactory/IBlipFactory"
import { ICheckpointFactory } from "server/core/Checkpoint/ICheckpointFactory"
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { IVehicleFactory } from "server/core/VehicleFactory/IVehicleFactory"
import { RaceArena } from "server/entity/RaceArena"
import { RaceArenaCheckpoint } from "server/entity/RaceArenaCheckpoint"
import { RaceArenaSpawnPoint } from "server/entity/RaceArenaSpawnPoint"
import { TeamDeathmatchArena } from "server/entity/TeamDeathmatchArena"
import { TeamDeathmatchArenaSpawnPoint } from "server/entity/TeamDeathmatchArenaSpawnPoint"
import { TeamDeathmatchArenaWeapon } from "server/entity/TeamDeathmatchArenaWeapon"
import { PlayerQuitEvents } from "server/modules/PlayerSave/PlayerQuitEvents"
import { PlayerSpawnManagerEvents } from "server/modules/PlayerSpawnManager/PlayerSpawnManagerEvents"
import { AutomaticEvent } from "../../AutomaticEvent"
import { AutomaticEventManagerEvents } from "../../AutomaticEventManagerEvents"
import { AutomaticEventType } from "../../AutomaticEventType"
import { IAutomaticEvent } from "../../IAutomaticEvent"
import { IAutomaticEventData } from "../../IAutomaticEventData"
export class TeamDeathmatchAutomaticEvent extends AutomaticEvent {
    private static MAX_PLAYERS_IN_TEAM: number = 10
    private _teamDeathmatchArena: TeamDeathmatchArena = null
    private _teamDeathmatchArenaSpawns: {[teamdId: number]: TeamDeathmatchArenaSpawnPoint[]} = []
    private _teamDeathmatchArenaWeapons: TeamDeathmatchArenaWeapon[] = []
    private _blips: BlipMp[] = []
    private _loadedPlayers: {[team: number]: number} = {}
    private _vector3Factory: IVector3Factory = null
    private _blipFactory: IBlipFactory = null
    private _notificationSender: INotificationSender = null
    private _playerDataFactory: IPlayerDataFactory = null
    private _playersInTeams: {[team: number]: PlayerMp[]} = {}
    private _allPlayersInTeams: {[team: number]: PlayerMp[]} = {}
    private _startedDimension: number = 0
    private _teams: number = 0
    private _nextTeam: number = 0
    private _playersAdded: boolean = false
    private _mappedTeamNames: {[team: number]: string} = {}
    private _mappedSkins: {[team: number]: number[]} = {}

    constructor(
        automaticEventData: IAutomaticEventData,
        vector3Factory: IVector3Factory,
        blipFactory: IBlipFactory,
        notificationSenderFactory: INotificationSenderFactory,
        playerDataFactory: IPlayerDataFactory,
    ) {
        super(automaticEventData)
        this._vector3Factory = vector3Factory
        this._blipFactory = blipFactory
        this._playerDataFactory = playerDataFactory
        this._notificationSender = notificationSenderFactory.create()
        this._startedDimension = this._eventDimension
        this._mappedTeamNames = {
            0: "Drużyna A",
            1: "Drużyna B",
        }
        this._mappedSkins = {
            0: [0x231AF63F, 0xA70B4A92, 0x23B88069],
            1: [0xCDEF5408, 0x63858A4A, 0x62CC28E2],
        }

        mp.events.add("playerDeath", (player: PlayerMp) => {
            const playerData: IPlayerData = this._playerDataFactory.create().load(player)
            if (playerData.status === PlayerDataStatus.ON_EVENT && playerData.onEvent === AutomaticEventType.TDM) {
                this._endMatchForPlayer(player)
            }
        })

        mp.events.add(PlayerQuitEvents.PLAYER_QUIT_ON_EVENT, (playerData: IPlayerData) => {
            if (playerData.onEvent === AutomaticEventType.TDM) {
                this._playersInTeams[0] = this._playersInTeams[0].filter((p) => {
                    return p.id !== playerData.id
                })
                this._playersInTeams[1] = this._playersInTeams[0].filter((p) => {
                    return p.id !== playerData.id
                })
                this._allPlayersInTeams[0] = this._allPlayersInTeams[0].filter((p) => {
                    return p.id !== playerData.id
                })
                this._allPlayersInTeams[1] = this._allPlayersInTeams[1].filter((p) => {
                    return p.id !== playerData.id
                })
            }
        })

    }

    public loadArena() {
        this._eventDimension++
        this._loadedPlayers = {}
        this._loadedPlayers[0] = 0
        this._loadedPlayers[1] = 0
        this._playersInTeams = {}
        this._playersInTeams[0] = []
        this._playersInTeams[1] = []
        this._allPlayersInTeams = {}
        this._allPlayersInTeams[0] = []
        this._allPlayersInTeams[1] = []
        this._teamDeathmatchArenaSpawns = {}
        this._teamDeathmatchArenaWeapons = []
        this._blips = []
        this._teams = 0
        this._nextTeam = 0
        this._playersAdded = false
        TeamDeathmatchArena.query()
            .select()
            .orderByRaw("RAND()")
            .limit(1)
            .then((tdmArenas: TeamDeathmatchArena[]) => {
                if (tdmArenas.length > 0) {
                    const tdmArena: RaceArena = tdmArenas[0]
                    console.log(`Loaded arena: ${tdmArena.name}`)
                    tdmArena
                        .$relatedQuery("weapons")
                        .orderBy("id", "ASC")
                        .then((tdmArenaWeapons: TeamDeathmatchArenaWeapon[]) => {
                            this._teamDeathmatchArenaWeapons = tdmArenaWeapons
                            console.log("Loaded weapons: " + tdmArenaWeapons.length)
                        })

                    tdmArena
                        .$relatedQuery("spawns")
                        .then((teamDeathmatchArenaSpawns: TeamDeathmatchArenaSpawnPoint[]) => {
                            console.log("Max players on arena: " + teamDeathmatchArenaSpawns.length)
                            this._teamDeathmatchArenaSpawns[0] = teamDeathmatchArenaSpawns.filter((tdmArenaSpawn) =>  {
                                return tdmArenaSpawn.team === 1
                            })
                            this._teamDeathmatchArenaSpawns[1] = teamDeathmatchArenaSpawns.filter((tdmArenaSpawn) =>  {
                                return tdmArenaSpawn.team === 2
                            })
                        })
                    this._teamDeathmatchArena = tdmArena

                }
            })
    }

    public start() {
        console.log("start")
        setTimeout(() => {
            console.log("start_t")
            Object.values(this._playersInTeams[0]).concat(Object.values(this._playersInTeams[1]))
            .forEach((player: PlayerMp) => {
                console.log("start_p")
                player.call(FreezePlayerModuleEvents.UNFREEZE_PLAYER)
                this._notificationSender.send(
                    player, "TDM_EVENT_MAP_START", NotificationType.INFO, NotificationTimeout.VERY_LONG,
                )
            })
            this._playersAdded = true
        }, 3000)

    }

    public preparePlayer(playerMp: PlayerMp) {
        console.log("prepare")
        const team = this._nextTeam % 2
        if (this._loadedPlayers[team] > this._teamDeathmatchArenaSpawns[team].length - 1) {
            console.log(this._loadedPlayers[team])
            console.log(JSON.stringify(this._teamDeathmatchArenaSpawns))
            this._notificationSender.send(
                playerMp, "TDM_EVENT_MAP_TOO_MANY_PLAYERS", NotificationType.ERROR, NotificationTimeout.VERY_LONG,
                [this._teamDeathmatchArena.name],
            )
            this._endMatchForPlayer(playerMp)
        } else {
            const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
            const tdmArenaSpawn: TeamDeathmatchArenaSpawnPoint =
                this._teamDeathmatchArenaSpawns[team][this._loadedPlayers[team]]
            playerMp.dimension = this._eventDimension
            console.log("prepare")
            console.log(JSON.stringify(tdmArenaSpawn))

            playerMp.position = this._vector3Factory.create(tdmArenaSpawn.x, tdmArenaSpawn.y, tdmArenaSpawn.z)
            playerMp.call(ChangePlayerPedModuleEvents.CHANGE_PED, [random.int(0, this._mappedSkins[team].length - 1)])
            playerMp.removeAllWeapons()
            console.log("prepare")
            this._teamDeathmatchArenaWeapons.forEach((weapon: TeamDeathmatchArenaWeapon) => {
                let ammo = weapon.ammo
                if (ammo === 0) {
                    ammo = 9999
                }
                console.log(JSON.stringify(weapon))
                playerMp.giveWeapon(weapon.weaponId, ammo)
            })
            console.log("prepare")
            playerMp.call(FreezePlayerModuleEvents.FREEZE_PLAYER)
            this._notificationSender.send(
                playerMp, "TDM_EVENT_MAP_INFO", NotificationType.INFO, NotificationTimeout.LONG,
                [this._teamDeathmatchArena.name, this._teamDeathmatchArena.author],
            )
            console.log("prepare")
            this._playersInTeams[team].push(playerMp)
            this._allPlayersInTeams[team].push(playerMp)
            this._loadedPlayers[team]++
            console.log("prepare")
            this._nextTeam++
        }
    }

    private _endMatchForPlayer(playerMp: PlayerMp) {
        const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
        this._playersInTeams[0] = this._playersInTeams[0].filter((p) => {
            return p.id !== playerMp.id
        })
        this._playersInTeams[1] = this._playersInTeams[0].filter((p) => {
            return p.id !== playerMp.id
        })
        playerMp.setVariable(PlayerDataProps.STATUS, PlayerDataStatus.ACTIVE)
        playerMp.setVariable(PlayerDataProps.ON_EVENT, AutomaticEventType.NOTHING)
        mp.events.call(PlayerSpawnManagerEvents.FORCE_RESPAWN, playerMp)
        if (this._playersInTeams[0].length <= 0 || this._playersInTeams[1].length <= 0) {
            this._endMatch()
        }

    }

    private _endMatch() {
        let winners: number = null
        if (this._playersInTeams[0].length <= 0) {
            winners = 1
        } else if (this._playersInTeams[1].length <= 0) {
            winners = 0
        }
        this._eventDimension = this._startedDimension
        if (winners) {
            const automaticEventData: IAutomaticEventData = this._automaticEventData
            this._allPlayersInTeams[winners].forEach((p: PlayerMp) => {
                const randomMoney: number = random.int(automaticEventData.minMoney, automaticEventData.maxMoney)
                const randomExp: number = random.int(automaticEventData.minExp, automaticEventData.maxExp)
                this._notificationSender.send(
                    p, "TDM_EVENT_YOUR_TEAM_WIN", NotificationType.SUCCESS, NotificationTimeout.LONG,
                    [randomMoney.toString(), randomExp.toString()],
                )
            })
        }
        mp.events.call(
            AutomaticEventManagerEvents.EVENT_END, this.automaticEventData.name, this._mappedTeamNames[winners],
        )
    }
}
