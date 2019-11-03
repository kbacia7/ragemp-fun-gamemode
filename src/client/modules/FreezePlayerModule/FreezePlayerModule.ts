import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { PlayerDataLoaderEvents } from "core/PlayerDataLoader/PlayerDataLoaderEvents"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { AutomaticEventManagerEvents } from "server/modules/AutomaticEvents/AutomaticEventManagerEvents"
import { IAutomaticEventData } from "server/modules/AutomaticEvents/IAutomaticEventData"
import { Module } from "./../Module"
import { FreezePlayerModuleEvents } from "./FreezePlayerModuleEvents"

export class FreezePlayerModule extends Module {
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        super(promiseFactory)
        this._name = "freeze-player"

        mp.events.add(FreezePlayerModuleEvents.FREEZE_PLAYER, () => {
            mp.players.local.freezePosition(true)
        })

        mp.events.add(FreezePlayerModuleEvents.UNFREEZE_PLAYER, () => {
            mp.players.local.freezePosition(false)
        })
    }

    public loadUI() {
        return this._promiseFactory.create((resolve) => {
           resolve(true)
        })

    }

    public destroyUI() {
        return this._promiseFactory.create((resolve) => {
            resolve(true)
         })
    }

}
