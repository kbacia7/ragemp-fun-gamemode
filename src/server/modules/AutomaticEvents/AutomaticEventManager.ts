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
import { AutomaticEventManagerEvents } from "./AutomaticEventManagerEvents"
import { IAutomaticEvent } from "./IAutomaticEvent"

export class AutomaticEventManager {
    private _knex: Knex = null
    private _notificationSender: INotificationSender = null
    private _automaticEvents: {[name: string]: IAutomaticEvent} = null
    private _playersOnEvent: {[name: string]: PlayerMp[]} = {}
    private _playerDataFactory: IPlayerDataFactory = null

    constructor(
        knex: Knex,
        notifiactionSenderFactory: INotificationSenderFactory,
        automaticEvents: {[name: string]: IAutomaticEvent},
        playerDataFactory: IPlayerDataFactory) {
        this._knex = knex
        this._notificationSender = notifiactionSenderFactory.create()
        this._automaticEvents = automaticEvents
        this._playerDataFactory =  playerDataFactory

        console.log(JSON.stringify(automaticEvents))
        Object.values(this._automaticEvents).forEach((automaticEvent: IAutomaticEvent) => {
            console.log(JSON.stringify(automaticEvent))
            const evName = automaticEvent.name
            this._playersOnEvent[evName] = []

            Setting.query()
            .select("name", "value")
            .where("name", "LIKE", `${evName}_max_players`)
            .then((settingsMaxPlayers: Setting[]) => {
                settingsMaxPlayers.forEach((setting: Setting) => {
                    automaticEvent.maxPlayers = parseInt(setting.value, 10)
                })
                Setting.query()
                    .select("name, value")
                    .where("name", "LIKE", `${evName}_min_players`)
                    .then((settingsMinPlayers: Setting[]) => {
                        settingsMinPlayers.forEach((setting: Setting) => {
                            automaticEvent.minPlayers = parseInt(setting.value, 10)
                        })
                    })
            })
        })

        mp.events.add(AutomaticEventManagerEvents.GET_AUTOMATIC_EVENTS, (playerMp: PlayerMp) => {
            playerMp.call(AutomaticEventManagerEvents.PROVIDE_AUTOMATIC_EVENTS, [
                JSON.stringify(Object.values(this._automaticEvents)),
            ])
        })

        mp.events.add(AutomaticEventManagerEvents.PLAYER_SAVE_TO_EVENT, (playerMp: PlayerMp, eventName: string) => {
            const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
            console.log(eventName)
            Object.values(this._automaticEvents).forEach((automaticEvent: IAutomaticEvent) => {
                if (automaticEvent.name === eventName) {
                    console.log("here " + JSON.stringify(playerData.savedOnEvents) + " im!")
                    console.log(JSON.stringify(playerData))
                    playerData.savedOnEvents.push(automaticEvent.type)

                    playerMp.setVariable(
                        PlayerDataProps.SAVED_ON_EVENTS,
                        playerData.savedOnEvents,
                    )
                    this._notificationSender.send(
                        playerMp, "AUTOMATIC_EVENT_SAVED_SUCCESS",
                        NotificationType.INFO, NotificationTimeout.NORMAL,
                        [automaticEvent.displayName],
                    )
                    this._automaticEvents[eventName].actualPlayers++
                    playerMp.call(AutomaticEventManagerEvents.UPDATE_EVENTS_TABLE, [
                        eventName, JSON.stringify(this._automaticEvents[eventName]),
                    ])

                    if (automaticEvent.actualPlayers >= automaticEvent.minPlayers) {
                        mp.players.forEach((playerMpForNotification: PlayerMp) => {
                            this._notificationSender.send(
                                playerMpForNotification, "AUTOMATIC_EVENT_SOON_START",
                                NotificationType.INFO, NotificationTimeout.LONG,
                                [automaticEvent.displayName],
                            )
                        })
                        mp.events.call(AutomaticEventManagerEvents.EVENT_START, eventName)
                    }
                }
            })
        })

        mp.events.add(AutomaticEventManagerEvents.EVENT_END, (eventName: string, winner: string) => {
            this._end(eventName, winner)
        })

        mp.events.add(AutomaticEventManagerEvents.EVENT_START, (eventName: string) => {
            this._start(eventName)
        })
    }

    private _start(name: string) {
        const automaticEvent: IAutomaticEvent = this._automaticEvents[name]
        mp.players.forEach((playerMp: PlayerMp) => {
            const playerData: IPlayerData = this._playerDataFactory.create().load(playerMp)
            if (playerData.savedOnEvents.includes(this._automaticEvents[name].type)) {
                if (playerData.status !== PlayerDataStatus.ACTIVE) {
                    this._notificationSender.send(
                        playerMp, "AUTOMATIC_EVENT_CANT_PREPARE",
                        NotificationType.ERROR, NotificationTimeout.LONG,
                        [automaticEvent.displayName],
                    )
                } else {
                    this._automaticEvents[name].preparePlayer(playerMp)
                    this._playersOnEvent[name].push(playerMp)
                }
            }
            this._notificationSender.send(
                playerMp, "AUTOMATIC_EVENT_START",
                NotificationType.INFO, NotificationTimeout.NORMAL,
                [automaticEvent.displayName],
            )
        })
    }

    private _end(name: string, winner: string) {
        const automaticEvent: IAutomaticEvent = this._automaticEvents[name]
        mp.players.forEach((playerMp: PlayerMp) => {
            this._notificationSender.send(
                playerMp, "AUTOMATIC_EVENT_END",
                NotificationType.INFO, NotificationTimeout.NORMAL,
                [automaticEvent.displayName, winner],
            )
        })
    }
}
