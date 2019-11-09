import { IActivePlayersLoader } from "client/core/ActivePlayersLoader/IActivePlayersLoader"
import { PlayerDataLoaderEvents } from "core/PlayerDataLoader/PlayerDataLoaderEvents"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { AutomaticEventManagerEvents } from "server/modules/AutomaticEvents/AutomaticEventManagerEvents"
import { IAutomaticEventData } from "server/modules/AutomaticEvents/IAutomaticEventData"
import { Module } from "./../Module"
import { ChangePlayerPedModuleEvents } from "./ChangePlayerPedModuleEvents"

export class ChangePlayerPedModule extends Module {
    constructor(promiseFactory: IPromiseFactory<boolean>) {
        super(promiseFactory)
        this._name = "change-ped"

        mp.events.add(ChangePlayerPedModuleEvents.CHANGE_PED, (pedNumber: number) => {
            mp.players.local.model = pedNumber
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
