import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { PlayerDataLoaderEvents } from "core/PlayerDataLoader/PlayerDataLoaderEvents"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { Module } from "./../Module"

export class PlayerProfileModule extends Module {

    constructor(promiseFactory: IPromiseFactory<boolean>) {
        super(promiseFactory)
        this._name = "player-profile"
        mp.events.add("playerStartPlay", (playerDataInJson: string) => {
            this.loadUI()
        })

        mp.events.add(PlayerDataLoaderEvents.PROVIDE_PLAYER_DATA, (playerDataInJson: string) => {
            mp.events.callRemote("debug", playerDataInJson)
            this._currentWindow.execute(`loadPlayerData('${playerDataInJson}')`)
        })
    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            super.loadUI().then((loaded) => {
                mp.events.callRemote(PlayerDataLoaderEvents.GET_PLAYER_DATA)
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
