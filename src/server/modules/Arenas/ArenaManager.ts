import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { PlayerDataStatus } from "core/PlayerDataProps/PlayerDataStatus"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { Setting } from "server/entity/Setting"
import { PlayerQuitEvents } from "../PlayerSave/PlayerQuitEvents"
import { Arena } from "./Arena"
import { ArenaManagerEvents } from "./ArenaManagerEvents"
import { ArenaType } from "./ArenaType"
import { IArena } from "./IArena"
import { IArenaData } from "./IArenaData"
import { IArenaDataFactory } from "./IArenaDataFactory"
import { IArenaFactory } from "./IArenaFactory"

export class ArenaManager {
    private _apiManager: IAPIManager<Setting> = null
    private _notificationSender: INotificationSender = null
    private _arenas: { [name: string]: IArena } = {}
    private _playersOnArena: { [name: string]: PlayerMp[] } = {}
    private _playerDataFactory: IPlayerDataFactory = null

    constructor(
        apiManager: IAPIManager<Setting>,
        notifiactionSenderFactory: INotificationSenderFactory,
        arenasList: string[],
        playerDataFactory: IPlayerDataFactory,
        arenaDataFactory: IArenaDataFactory,
        mappedNamesToTypes: { [name: string]: ArenaType },
        mappedNamesToFactories: { [name: string]: IArenaFactory }) {
        this._apiManager = apiManager
        this._notificationSender = notifiactionSenderFactory.create()
        this._playerDataFactory = playerDataFactory
        this._arenas = {}

        arenasList.forEach((arenaName: string) => {
            this._playersOnArena[arenaName] = []
            this._apiManager.query(`${APIRequests.SETTINGS_PREFIX}/${arenaName}/`).then((settings: Setting[]) => {
                if (settings.length > 0) {
                    console.log(`Load settings for ${arenaName} arena ${settings.length}`)
                    const mappedSettingsByName: { [name: string]: string } = Object.assign(
                        {},
                        ...(settings.map((item) => ({ [item.name]: item.value }))),
                    )
                    const arenaData: IArenaData = arenaDataFactory.create(
                        arenaName,
                        mappedSettingsByName[`${arenaName}_display_name`],
                        mappedNamesToTypes[arenaName],
                        0,
                        parseInt(mappedSettingsByName[`${arenaName}_max_players`], 10),
                    )
                    this._arenas[arenaName] =  mappedNamesToFactories[arenaName].create(
                        arenaData,
                    )
                    this._arenas[arenaName].loadArena()
                }
            })
        })

        mp.events.add(ArenaManagerEvents.GET_ARENAS, (playerMp: PlayerMp) => {
            playerMp.call(ArenaManagerEvents.PROVIDE_ARENAS, [
                JSON.stringify(Object.values(this._arenas).map((a) => a.data)),
            ])
        })

        mp.events.add("playerDeath", (playerMp: PlayerMp) => {
            const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
            if (playerData.status === PlayerDataStatus.ON_ARENA) {
                Object.values(this._arenas).forEach((arena: IArena) => {
                    if (arena.data.type === playerData.onArena) {
                        arena.spawnPlayer(playerMp, false)
                    }
                } )

            }
        })

        mp.events.add(ArenaManagerEvents.PLAYER_JOIN_ARENA, (playerMp: PlayerMp, arenaName: string) => {
            this._playerSave(playerMp, arenaName)
        })

        mp.events.add(ArenaManagerEvents.PLAYER_QUIT_ARENA, (playerMp: PlayerMp, arenaName: string) => {
            this._playerSignOff(playerMp, arenaName)
        })

        mp.events.add(PlayerQuitEvents.PLAYER_QUIT_ON_ARENA, (playerData: IPlayerData) => {
            Object.values(this._arenas).forEach((arena: IArena) => {
                const arenaData: IArenaData = arena.data
                if (arenaData.type === playerData.onArena) {
                    arenaData.actualPlayers--
                    mp.players.forEach((pMp: PlayerMp) => {
                        pMp.call(ArenaManagerEvents.UPDATE_ARENAS_TABLE, [
                            arenaData.name, JSON.stringify(arenaData),
                        ])
                    })
                }
            })
        })
    }

    private _playerSave(playerMp: PlayerMp, arenaName: string) {
        const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
        if (playerData.status === PlayerDataStatus.ACTIVE) {
            Object.values(this._arenas).forEach((arena: IArena) => {
                const arenaData: IArenaData = arena.data
                if (arenaData.name === arenaName) {
                    this._notificationSender.send(
                        playerMp, "ARENA_JOIN",
                        NotificationType.INFO, NotificationTimeout.NORMAL,
                        [arenaData.displayName],
                    )
                    this._arenas[arenaName].spawnPlayer(playerMp, true)
                    arenaData.actualPlayers++
                    playerMp.setVariable(
                        PlayerDataProps.ON_ARENA,
                        arenaData.type,
                    )
                    playerMp.setVariable(
                        PlayerDataProps.STATUS,
                        PlayerDataStatus.ON_ARENA,
                    )
                    mp.players.forEach((pMp: PlayerMp) => {
                        pMp.call(ArenaManagerEvents.UPDATE_ARENAS_TABLE, [
                            arenaName, JSON.stringify(arenaData),
                        ])
                    })
                }
            })
        } else {
            this._notificationSender.send(
                playerMp, "ARENA_CANT_JOIN",
                NotificationType.ERROR, NotificationTimeout.NORMAL,
            )
            playerMp.call(ArenaManagerEvents.UPDATE_ARENAS_BUTTON_TABLE, [
                arenaName,
            ])
        }

    }

    private _playerSignOff(playerMp: PlayerMp, arenaName: string) {
        const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
        Object.values(this._arenas).forEach((arena: IArena) => {
            const arenaData: IArenaData = arena.data
            if (arenaData.name === arenaName) {
                this._notificationSender.send(
                    playerMp, "ARENA_EXIT",
                    NotificationType.INFO, NotificationTimeout.NORMAL,
                    [arenaData.displayName],
                )
                arenaData.actualPlayers--
                playerMp.setVariable(
                    PlayerDataProps.ON_ARENA,
                    ArenaType.NOTHING,
                )
                playerMp.setVariable(
                    PlayerDataProps.STATUS,
                    PlayerDataStatus.ACTIVE,
                )
                mp.players.forEach((pMp: PlayerMp) => {
                    pMp.call(ArenaManagerEvents.UPDATE_ARENAS_TABLE, [
                        arenaName, JSON.stringify(arenaData),
                    ])
                })
            }
        })

    }
}
