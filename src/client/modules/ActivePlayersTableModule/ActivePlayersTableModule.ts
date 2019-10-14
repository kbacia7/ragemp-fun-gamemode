import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { Module } from "./../Module"

export class ActivePlayersTableModule extends Module {
    private _activePlayersLoader: IActivePlayersLoader = null
    private _activePlayersData: IPlayerData[] = null

    constructor(promiseFactory: IPromiseFactory<boolean>, activePlayersLoader: IActivePlayersLoader) {
        super(promiseFactory)
        this._name = "active-players"
        this._activePlayersLoader = activePlayersLoader
    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
            super.loadUI().then((loaded) => {
                if (loaded) {
                    resolve(true)
                    this._activePlayersLoader.load().then((playersData: IPlayerData[]) => {
                        this._activePlayersData = playersData
                        this._activePlayersTableIsReady()
                    })
                } else {
                    resolve(false)
                }
            })
        })

    }

    public destroyUI() {
        return this._promiseFactory.create((resolve) => {
            super.destroyUI().then((result) => {
                resolve(result)
            })
        })
    }

    private _activePlayersTableIsReady() {
        this._currentWindow.execute(`loadPlayers('${JSON.stringify(this._activePlayersData)}')`)
    }
}
