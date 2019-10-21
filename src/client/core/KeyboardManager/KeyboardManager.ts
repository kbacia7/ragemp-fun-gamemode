import { IActionsMenuModuleFactory } from "client/modules/ActionsMenuModule/IActionsMenuModuleFactory"
import {
    IActivePlayersTableModuleFactory,
} from "client/modules/ActivePlayersTableModule/IActivePlayersTableModuleFactory"
import { Module } from "client/modules/Module"
import { IActivePlayersLoader } from "../ActivePlayersLoader/IActivePlayersLoader"
import { Keys } from "./Keys"

export class KeyboardManager {
    private _activePlayersTableModule: Module = null
    private _actionsMenuModule: Module = null
    constructor(
        activePlayersTableModuleFactory: IActivePlayersTableModuleFactory,
        actionsMenuModuleFactory: IActionsMenuModuleFactory,
    ) {
        this._activePlayersTableModule = activePlayersTableModuleFactory.create()
        mp.keys.bind(Keys.F2, true, () => {
            this._activePlayersTableModule.loadUI()
        })
        mp.keys.bind(Keys.F2, false, () => {
            this._activePlayersTableModule.destroyUI()
        })

        this._actionsMenuModule = actionsMenuModuleFactory.create()
        mp.keys.bind(Keys.F, true, () => {
            this._actionsMenuModule.loadUI()
        })
        mp.keys.bind(Keys.F, false, () => {
            this._actionsMenuModule.destroyUI()
        })
    }
}
