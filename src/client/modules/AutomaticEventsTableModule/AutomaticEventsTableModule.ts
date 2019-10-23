import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { PlayerDataLoaderEvents } from "core/PlayerDataLoader/PlayerDataLoaderEvents"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { IRegisterAutomaticEventData } from "core/RegisterAutomaticEvents/IRegisterAutomaticEventData"
import { RegisterAutomaticEvents } from "core/RegisterAutomaticEvents/RegisterAutomaticEvents"
import { Module } from "./../Module"

export class AutomaticEventsTableModule extends Module {

    private _registeredAutomaticEventsDatas: IRegisterAutomaticEventData[] = null
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        super(promiseFactory)
        this._name = "automatic-events-table"
        mp.events.add("playerStartPlay", (playerDataInJson: string) => {
            mp.events.callRemote(RegisterAutomaticEvents.GET_AUTOMATIC_EVENTS)
        })

        mp.events.add(RegisterAutomaticEvents.PROVIDE_AUTOMATIC_EVENTS, (registerAutomaticEventsDatas: string) => {
            this._registeredAutomaticEventsDatas = JSON.parse(registerAutomaticEventsDatas)
            this.loadUI()
        })
    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            super.loadUI().then((loaded) => {
                this._currentWindow.execute(
                    `setEventsInTable('${JSON.stringify(this._registeredAutomaticEventsDatas)}')`,
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
}
