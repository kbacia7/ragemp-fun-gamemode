import { eventNames, settings } from "cluster"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { NotificationType } from "core/Notification/NotificationType"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { PlayerDataStatus } from "core/PlayerDataProps/PlayerDataStatus"
import Knex = require("knex")
import { INotificationSender } from "server/core/NotificationSender/INotificationSender"
import { INotificationSenderFactory } from "server/core/NotificationSender/INotificationSenderFactory"
import { Setting } from "server/entity/Setting"
import { PlayerSpawnManager } from "../PlayerSpawnManager/PlayerSpawnManager"
import { PlayerSpawnManagerEvents } from "../PlayerSpawnManager/PlayerSpawnManagerEvents"
import { AutomaticEvent } from "./AutomaticEvent"
import { AutomaticEventManagerEvents } from "./AutomaticEventManagerEvents"
import { AutomaticEventType } from "./AutomaticEventType"
import { IAutomaticEvent } from "./IAutomaticEvent"
import { IAutomaticEventData } from "./IAutomaticEventData"
import { IAutomaticEventDataFactory } from "./IAutomaticEventDataFactory"
import { IAutomaticEventFactory } from "./IAutomaticEventFactory"

export class AutomaticEventManager {
    private _knex: Knex = null
    private _notificationSender: INotificationSender = null
    private _automaticEvents: { [name: string]: IAutomaticEvent } = {}
    private _playersOnEvent: { [name: string]: PlayerMp[] } = {}
    private _playerDataFactory: IPlayerDataFactory = null

    constructor(
        knex: Knex,
        notifiactionSenderFactory: INotificationSenderFactory,
        automaticEventsList: string[],
        playerDataFactory: IPlayerDataFactory,
        automaticEventDataFactory: IAutomaticEventDataFactory,
        mappedNamesToTypes: { [name: string]: AutomaticEventType },
        mappedNamesToFactories: { [name: string]: IAutomaticEventFactory }) {
        this._knex = knex
        this._notificationSender = notifiactionSenderFactory.create()
        this._playerDataFactory = playerDataFactory
        this._automaticEvents = {}

        automaticEventsList.forEach((automaticEventName: string) => {
            console.log(JSON.stringify(automaticEventName))
            const evName = automaticEventName
            this._playersOnEvent[evName] = []
            Setting.query()
                .select()
                .where("name", "LIKE", `${evName}_%`)
                .then((settingsFromDb: Setting[]) => {
                    console.log(`Load settings for ${evName} event`)
                    if (settingsFromDb.length > 0) {
                        const mappedSettingsByName: { [name: string]: string } = Object.assign(
                            {},
                            ...(settingsFromDb.map((item) => ({ [item.name]: item.value }))),
                        )
                        const automaticEventData: IAutomaticEventData = automaticEventDataFactory.create(
                            evName,
                            mappedSettingsByName[`${evName}_display_name`],
                            mappedNamesToTypes[evName],
                            parseInt(mappedSettingsByName[`${evName}_min_players`], 10),
                            0,
                            parseInt(mappedSettingsByName[`${evName}_max_players`], 10),
                            parseInt(mappedSettingsByName[`${evName}_min_exp`], 10),
                            parseInt(mappedSettingsByName[`${evName}_max_exp`], 10),
                            parseInt(mappedSettingsByName[`${evName}_min_money`], 10),
                            parseInt(mappedSettingsByName[`${evName}_max_money`], 10),
                        )
                        this._automaticEvents[evName] =  mappedNamesToFactories[evName].create(
                            automaticEventData,
                        )
                    } else {
                        // TODO: Usuwać wraz z dodawaniem nowych zabaw
                        const tmpMapped = {
                            derby: "Derby",
                            hideandseek: "Hide&Seek",
                            tdm: "TDM",
                        }

                        const automaticEventData: IAutomaticEventData = automaticEventDataFactory.create(
                            evName,
                            tmpMapped[evName],
                            AutomaticEventType.TDM,
                            1,
                            0,
                            10,
                            0, 0, 0, 0,
                        )
                        this._automaticEvents[evName] = new AutomaticEvent(automaticEventData)

                    }
                })
        })

        mp.events.add(AutomaticEventManagerEvents.GET_AUTOMATIC_EVENTS, (playerMp: PlayerMp) => {
            playerMp.call(AutomaticEventManagerEvents.PROVIDE_AUTOMATIC_EVENTS, [
                JSON.stringify(Object.values(this._automaticEvents).map((ev) => ev.automaticEventData)),
            ])
        })

        mp.events.add(AutomaticEventManagerEvents.PLAYER_SAVE_TO_EVENT, (playerMp: PlayerMp, eventName: string) => {
            this._playerSave(playerMp, eventName)
        })

        mp.events.add(AutomaticEventManagerEvents.EVENT_END, (eventName: string, winner: string) => {
            this._end(eventName, winner)
        })

        mp.events.add(AutomaticEventManagerEvents.EVENT_START, (eventName: string) => {
            this._start(eventName)
        })

        mp.events.add(AutomaticEventManagerEvents.PLAYER_SIGNED_OFF_EVENT, (playerMp: PlayerMp, eventName: string) => {
            this._playerSignOff(playerMp, eventName)
        })

        mp.events.add(AutomaticEventManagerEvents.EVENT_START_SOON, (eventName: string) => {
            setTimeout(() => {
                this._start(eventName)
            }, 30000)
        })
    }

    private _playerSave(playerMp: PlayerMp, eventName: string) {
        const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
        console.log(eventName)
        Object.values(this._automaticEvents).forEach((automaticEvent: IAutomaticEvent) => {
            const automaticEventData: IAutomaticEventData = automaticEvent.automaticEventData
            if (automaticEventData.name === eventName) {
                console.log("here " + JSON.stringify(playerData.savedOnEvents) + " im!")
                console.log(JSON.stringify(playerData))
                playerData.savedOnEvents.push(automaticEventData.type)

                playerMp.setVariable(
                    PlayerDataProps.SAVED_ON_EVENTS,
                    playerData.savedOnEvents,
                )
                this._notificationSender.send(
                    playerMp, "AUTOMATIC_EVENT_SAVED_SUCCESS",
                    NotificationType.INFO, NotificationTimeout.NORMAL,
                    [automaticEventData.displayName],
                )
                automaticEventData.actualPlayers++
                playerMp.call(AutomaticEventManagerEvents.UPDATE_EVENTS_TABLE, [
                    eventName, JSON.stringify(this._automaticEvents[eventName].automaticEventData),
                ])

                if (automaticEventData.actualPlayers >= automaticEventData.minPlayers) {
                    mp.players.forEach((playerMpForNotification: PlayerMp) => {
                        this._notificationSender.send(
                            playerMpForNotification, "AUTOMATIC_EVENT_SOON_START",
                            NotificationType.INFO, NotificationTimeout.LONG,
                            [automaticEventData.displayName],
                        )
                    })
                    this._automaticEvents[eventName].loadArena()
                    mp.events.call(AutomaticEventManagerEvents.EVENT_START_SOON, eventName)
                }
            }
        })
    }

    private _playerSignOff(playerMp: PlayerMp, eventName: string) {
        const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
        console.log(eventName)
        Object.values(this._automaticEvents).forEach((automaticEvent: IAutomaticEvent) => {
            const automaticEventData: IAutomaticEventData = automaticEvent.automaticEventData
            if (automaticEventData.name === eventName) {
                console.log("here " + JSON.stringify(playerData.savedOnEvents) + " im!")
                console.log(JSON.stringify(playerData))
                const savedOnEvents = playerData.savedOnEvents.filter((ev: AutomaticEventType) => {
                    return ev !== automaticEventData.type
                })

                playerMp.setVariable(
                    PlayerDataProps.SAVED_ON_EVENTS, savedOnEvents,
                )
                this._notificationSender.send(
                    playerMp, "AUTOMATIC_EVENT_SIGNED_OFF_SUCCESS",
                    NotificationType.INFO, NotificationTimeout.NORMAL,
                    [automaticEventData.displayName],
                )
                automaticEventData.actualPlayers--
                playerMp.call(AutomaticEventManagerEvents.UPDATE_EVENTS_TABLE, [
                    eventName, JSON.stringify(automaticEventData),
                ])
            }
        })

    }

    private _start(name: string) {
        const automaticEvent: IAutomaticEvent = this._automaticEvents[name]
        const automaticEventData: IAutomaticEventData = automaticEvent.automaticEventData
        mp.players.forEach((playerMp: PlayerMp) => {
            if (automaticEventData.actualPlayers < automaticEventData.minPlayers) {
                mp.players.forEach((playerMpForNotification: PlayerMp) => {
                    this._notificationSender.send(
                        playerMpForNotification, "AUTOMATIC_EVENT_CANT_START",
                        NotificationType.ERROR, NotificationTimeout.LONG,
                        [automaticEventData.displayName],
                    )
                })
                return this._end(name, null)
            }

            const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
            if (playerData.savedOnEvents.includes(automaticEventData.type)) {
                if (playerData.status !== PlayerDataStatus.ACTIVE) {
                    this._notificationSender.send(
                        playerMp, "AUTOMATIC_EVENT_CANT_PREPARE",
                        NotificationType.ERROR, NotificationTimeout.LONG,
                        [automaticEventData.displayName],
                    )
                    automaticEventData.actualPlayers--
                } else {
                    playerMp.setVariable(
                        PlayerDataProps.SAVED_ON_EVENTS,
                        playerMp.getVariable(PlayerDataProps.SAVED_ON_EVENTS).filter(
                            (e) => {
                                return e !== automaticEventData.type
                            },
                        ),
                    )
                    playerMp.setVariable(PlayerDataProps.STATUS, PlayerDataStatus.ON_EVENT)
                    playerMp.setVariable(PlayerDataProps.ON_EVENT, automaticEventData.type)
                    this._automaticEvents[name].preparePlayer(playerMp)
                    this._playersOnEvent[name].push(playerMp)
                }
            }
            this._notificationSender.send(
                playerMp, "AUTOMATIC_EVENT_START",
                NotificationType.INFO, NotificationTimeout.NORMAL,
                [automaticEventData.displayName],
            )
        })
        automaticEventData.actualPlayers = 0
        mp.players.forEach((playerMp: PlayerMp) => {
            playerMp.call(AutomaticEventManagerEvents.UPDATE_EVENTS_TABLE, [
                name, JSON.stringify(automaticEventData),
            ])
            playerMp.call(AutomaticEventManagerEvents.UPDATE_EVENTS_BUTTON_TABLE, [
                name,
            ])
        })
        this._automaticEvents[name].start()

    }

    private _end(name: string, winner: string) {
        const automaticEvent: IAutomaticEvent = this._automaticEvents[name]
        const automaticEventData: IAutomaticEventData = automaticEvent.automaticEventData
        if (winner) {
            mp.players.forEach((playerMp: PlayerMp) => {
                this._notificationSender.send(
                    playerMp, "AUTOMATIC_EVENT_END",
                    NotificationType.INFO, NotificationTimeout.NORMAL,
                    [automaticEventData.displayName, winner],
                )
            })
        }
        this._playersOnEvent[name].forEach((playerMp: PlayerMp) => {
            mp.events.call(PlayerSpawnManagerEvents.FORCE_RESPAWN, playerMp)
        })
    }
}
