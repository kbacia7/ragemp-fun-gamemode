import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { PlayerDataLoaderEvents } from "core/PlayerDataLoader/PlayerDataLoaderEvents"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { AutomaticEventManagerEvents } from "server/modules/AutomaticEvents/AutomaticEventManagerEvents"
import { IAutomaticEvent } from "server/modules/AutomaticEvents/IAutomaticEvent"
import { Module } from "./../Module"
import { AutomaticEventsTableModuleEvents } from "./AutomaticEventsTableModuleEvents"

export class AutomaticEventsTableModule extends Module {

    private _automaticEventsDatas: IAutomaticEvent[] = null
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

        mp.events.add(AutomaticEventManagerEvents.UPDATE_EVENTS_TABLE,
            (eventName: string, automaticEventDataStr: string) => {
                this._updateTableRow(eventName, automaticEventDataStr)
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
}
