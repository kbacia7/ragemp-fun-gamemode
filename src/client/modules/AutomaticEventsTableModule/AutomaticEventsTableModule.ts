import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { eventNames } from "cluster"
import { PlayerDataLoaderEvents } from "core/PlayerDataLoader/PlayerDataLoaderEvents"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { AutomaticEventManagerEvents } from "server/modules/AutomaticEvents/AutomaticEventManagerEvents"
import { RaceAutomaticEventPageEvents } from "server/modules/AutomaticEvents/Events/Race/RaceAutomaticEventPageEvents"
import { IAutomaticEventData } from "server/modules/AutomaticEvents/IAutomaticEventData"
import { Module } from "./../Module"
import { AutomaticEventsTableModuleEvents } from "./AutomaticEventsTableModuleEvents"

export class AutomaticEventsTableModule extends Module {

    private _automaticEventsDatas: IAutomaticEventData[] = null
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        super(promiseFactory)
        this._name = "automatic-events-table"
        mp.events.add("playerStartPlay", (playerDataInJson: string) => {
            mp.events.callRemote(AutomaticEventManagerEvents.GET_AUTOMATIC_EVENTS)
        })

        mp.events.add(AutomaticEventManagerEvents.PROVIDE_AUTOMATIC_EVENTS, (automaticEventsDatas: string) => {
            this._automaticEventsDatas = JSON.parse(automaticEventsDatas)
            this.loadUI()
        })

        mp.events.add(AutomaticEventsTableModuleEvents.PLAYER_SAVE_ON_EVENT, (eventName: string) => {
            mp.events.callRemote(AutomaticEventManagerEvents.PLAYER_SAVE_TO_EVENT, eventName)
        })

        mp.events.add(AutomaticEventsTableModuleEvents.PLAYER_SIGNED_OFF_EVENT, (eventName: string) => {
            mp.events.callRemote(AutomaticEventManagerEvents.PLAYER_SIGNED_OFF_EVENT, eventName)
        })

        mp.events.add(AutomaticEventManagerEvents.UPDATE_EVENTS_TABLE,
            (eventName: string, automaticEventDataStr: string) => {
                this._updateTableRow(eventName, automaticEventDataStr)
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
    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            super.loadUI().then((loaded) => {
                this._currentWindow.execute(
                    `setEventsInTable('${JSON.stringify(this._automaticEventsDatas)}')`,
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

    private _updateButton(eventName: string) {
        this._currentWindow.execute(
            `updateButton('${eventName}')`,
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
}
