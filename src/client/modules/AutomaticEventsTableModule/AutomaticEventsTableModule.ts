import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { eventNames } from "cluster"
import { PlayerDataLoaderEvents } from "core/PlayerDataLoader/PlayerDataLoaderEvents"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { ArenaManagerEvents } from "server/modules/Arenas/ArenaManagerEvents"
import { IArenaData } from "server/modules/Arenas/IArenaData"
import { AutomaticEventManagerEvents } from "server/modules/AutomaticEvents/AutomaticEventManagerEvents"
import { DerbyAutomaticEventPageEvents } from "server/modules/AutomaticEvents/Events/Derby/DerbyAutomaticEventPageEvents"
import { HideAndSeekAutomaticEventPageEvents } from "server/modules/AutomaticEvents/Events/HideAndSeek/HideAndSeekAutomaticEventPageEvents"
import { RaceAutomaticEventPageEvents } from "server/modules/AutomaticEvents/Events/Race/RaceAutomaticEventPageEvents"
import {
    TeamDeathmatchAutomaticEventPageEvents,
} from "server/modules/AutomaticEvents/Events/TDM/TeamDeathmatchAutomaticEventPageEvents"
import { IAutomaticEventData } from "server/modules/AutomaticEvents/IAutomaticEventData"
import { Module } from "./../Module"
import { AutomaticEventsTableModuleEvents } from "./AutomaticEventsTableModuleEvents"

export class AutomaticEventsTableModule extends Module {

    private _automaticEventsDatas: IAutomaticEventData[] = null
    private _arenasDatas: IArenaData[] = null
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        super(promiseFactory)
        this._name = "automatic-events-table"
        mp.events.add("playerStartPlay", (playerDataInJson: string) => {
            mp.events.callRemote(AutomaticEventManagerEvents.GET_AUTOMATIC_EVENTS)
            mp.events.callRemote(ArenaManagerEvents.GET_ARENAS)
        })

        mp.events.add(AutomaticEventManagerEvents.PROVIDE_AUTOMATIC_EVENTS, (automaticEventsDatas: string) => {
            this._automaticEventsDatas = JSON.parse(automaticEventsDatas)
            if (this._arenasDatas !== null) {
                this.loadUI()

            }
        })

        mp.events.add(ArenaManagerEvents.PROVIDE_ARENAS, (arenasDatas: string) => {
            this._arenasDatas = JSON.parse(arenasDatas)
            if (this._automaticEventsDatas !== null) {
                this.loadUI()
            }
        })

        mp.events.add(AutomaticEventsTableModuleEvents.PLAYER_SAVE_ON_EVENT, (eventName: string) => {
            mp.events.callRemote(AutomaticEventManagerEvents.PLAYER_SAVE_TO_EVENT, eventName)
        })

        mp.events.add(AutomaticEventsTableModuleEvents.PLAYER_SIGNED_OFF_EVENT, (eventName: string) => {
            mp.events.callRemote(AutomaticEventManagerEvents.PLAYER_SIGNED_OFF_EVENT, eventName)
        })

        mp.events.add(AutomaticEventsTableModuleEvents.JOIN_ARENA, (arenaName: string) => {
            mp.events.callRemote(ArenaManagerEvents.PLAYER_JOIN_ARENA, arenaName)
        })

        mp.events.add(AutomaticEventsTableModuleEvents.QUIT_ARENA, (arenaName: string) => {
            mp.events.callRemote(ArenaManagerEvents.PLAYER_QUIT_ARENA, arenaName)
        })

        mp.events.add(AutomaticEventManagerEvents.UPDATE_EVENTS_TABLE,
            (eventName: string, automaticEventDataStr: string) => {
                this._updateTableRow(eventName, automaticEventDataStr)
        })

        mp.events.add(ArenaManagerEvents.UPDATE_ARENAS_TABLE,
            (arenaName: string, arenaData: string) => {
                this._updateArenaTableRow(arenaName, arenaData)
        })

        mp.events.add(ArenaManagerEvents.UPDATE_ARENAS_BUTTON_TABLE, (arenaName: string) => {
            this._updateArenaButton(arenaName)
        })

        mp.events.add(AutomaticEventManagerEvents.UPDATE_EVENTS_BUTTON_TABLE, (eventName: string) => {
            this._updateButton(eventName)
        })

        mp.events.add(RaceAutomaticEventPageEvents.DISPLAY_PAGE,
            (eventName: string, displayName: string,
             playersWithTime: string, allCheckpoints: string, playerTime: string,
             playerCheckpoints: string) => {
            this._addButton(eventName, displayName)
            this._togglePage(eventName)
            this._setRaceData(playersWithTime, allCheckpoints, playerTime, playerCheckpoints)
        })

        mp.events.add(RaceAutomaticEventPageEvents.UPDATE_PAGE,
            (playersWithTime: string, allCheckpoints: string, playerTime: string,
             playerCheckpoints: string) => {
            this._clearRaceList()
            this._setRaceData(playersWithTime, allCheckpoints, playerTime, playerCheckpoints)
        })

        mp.events.add(RaceAutomaticEventPageEvents.REMOVE_PAGE, () => {
            this._clearRaceList()
            this._removePage("race")
            this._togglePage("events")
        })

        mp.events.add(DerbyAutomaticEventPageEvents.DISPLAY_PAGE,
            (eventName: string, displayName: string,
             playersNames: string) => {
            this._addButton(eventName, displayName)
            this._togglePage(eventName)
            this._setDerbyData(playersNames)
        })

        mp.events.add(DerbyAutomaticEventPageEvents.UPDATE_PAGE,
            (playersNames: string) => {
            this._clearRaceList()
            this._setDerbyData(playersNames)
        })

        mp.events.add(DerbyAutomaticEventPageEvents.REMOVE_PAGE, () => {
            this._clearDerbyList()
            this._removePage("derby")
            this._togglePage("events")
        })

        mp.events.add(TeamDeathmatchAutomaticEventPageEvents.DISPLAY_PAGE,
            (eventName: string, displayName: string,
             weapons: string, teamAPlayersCount: string, teamBPlayersCount: string) => {
            this._addButton(eventName, displayName)
            this._togglePage(eventName)
            this._setTdmData(weapons, teamAPlayersCount, teamBPlayersCount)
        })

        mp.events.add(TeamDeathmatchAutomaticEventPageEvents.UPDATE_PAGE,
            (weapons: string, teamAPlayersCount: string, teamBPlayersCount: string) => {
                this._setTdmData(weapons, teamAPlayersCount, teamBPlayersCount)
            })

        mp.events.add(TeamDeathmatchAutomaticEventPageEvents.REMOVE_PAGE, () => {
            this._removePage("tdm")
            this._togglePage("events")
        })

        mp.events.add(HideAndSeekAutomaticEventPageEvents.DISPLAY_PAGE,
            (eventName: string, displayName: string,
             playersNames: string, lookingPlayerName: string) => {
            this._addButton(eventName, displayName)
            this._togglePage(eventName)
            this._clearHideAndSeekList()
            this._setHideAndSeekData(playersNames, lookingPlayerName)
        })

        mp.events.add(HideAndSeekAutomaticEventPageEvents.UPDATE_PAGE,
            (playersNames: string, lookingPlayerName: string) => {
                this._clearHideAndSeekList()
                this._setHideAndSeekData(playersNames, lookingPlayerName)
        })

        mp.events.add(HideAndSeekAutomaticEventPageEvents.REMOVE_PAGE, () => {
            this._removePage("hideandseek")
            this._togglePage("events")
        })
    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            super.loadUI().then((loaded) => {
                this._currentWindow.execute(
                    `setEventsInTable('${JSON.stringify(this._automaticEventsDatas)}')`,
                )
                this._currentWindow.execute(
                    `setArenasInTable('${JSON.stringify(this._arenasDatas)}')`,
                )
                resolve(loaded)
            })
        })

    }

    public destroyUI() {
        return this._promiseFactory.create((resolve) => {
            super.destroyUI().then((loaded) => {
                resolve(loaded)
            })
        })
    }

    private _updateTableRow(eventName: string, automaticEventData: string) {
        this._currentWindow.execute(
            `updateRow('${eventName}', '${automaticEventData}')`,
        )
    }

    private _updateArenaTableRow(arenaName: string, arenaData: string) {
        this._currentWindow.execute(
            `updateArenaRow('${arenaName}', '${arenaData}')`,
        )
    }

    private _updateButton(eventName: string) {
        this._currentWindow.execute(
            `updateButton('${eventName}')`,
        )
    }

    private _updateArenaButton(arenaName: string) {
        this._currentWindow.execute(
            `updateArenaButton('${arenaName}')`,
        )
    }

    private _addButton(eventName: string, displayName: string) {
        this._currentWindow.execute(
            `addButtonToEventPage('${eventName}', '${displayName}')`,
        )
    }

    private _togglePage(eventName: string) {
        this._currentWindow.execute(
            `togglePage('${eventName}')`,
        )
    }

    private _clearRaceList() {
        this._currentWindow.execute(
            `clearRaceList()`,
        )
    }

    private _clearDerbyList() {
        this._currentWindow.execute(
            `clearDerbyList()`,
        )
    }

    private _clearHideAndSeekList() {
        this._currentWindow.execute(
            `clearHideAndSeekList()`,
        )
    }

    private _removePage(ev: string) {
        this._currentWindow.execute(
            `removePage('${ev}')`,
        )
    }

    private _setRaceData(
        playersWithTime: string, allCheckpoints: string,
        playerTime: string, playerChekpoints: string,
    ) {
        this._currentWindow.execute(
            `setRaceData(
                '${playersWithTime}', '${allCheckpoints}',
                '${playerTime}', '${playerChekpoints}'
            )`,
        )
    }

    private _setDerbyData(
        playersNames: string,
    ) {
        this._currentWindow.execute(
            `setDerbyData(
                '${playersNames}'
            )`,
        )
    }

    private _setHideAndSeekData(
        playersNames: string, lookingPlayerName: string,
    ) {
        this._currentWindow.execute(
            `setHideAndSeekData(
                '${playersNames}', '${lookingPlayerName}'
            )`,
        )
    }

    private _setTdmData(
        weapons: string, teamAPlayersCount: string, teamBPlayersCount: string,
    ) {
        this._currentWindow.execute(
            `setTdmData(
                '${weapons}', '${teamAPlayersCount}',
                '${teamBPlayersCount}'
            )`,
        )
    }
}
