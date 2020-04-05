import { EquipmentModuleEvent } from "client/modules/EquipmentModule/EquipmentModuleEvent"
import { GlobalShopModuleEvent } from "client/modules/GlobalShopModule/GlobalShopModuleEvent"
import { CommandListenerEvent } from "core/CommandListener/CommandListenerEvent"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerData } from "core/PlayerDataProps/PlayerData"
import { ActionsMenu } from "server/core/ActionsMenu/ActionsMenu"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { Setting } from "server/entity/Setting"
import { ShopTabData } from "server/entity/ShopTabData"
import { IShopManager } from "server/modules/ShopManager/IShopManager"
import { ICommand } from "../ICommand"

export class EqCommand implements ICommand {
    private _alias: string[] = null
    public get alias() {
        return this._alias
    }

    private _playerDataFactory: IPlayerDataFactory = null

    constructor(playerDataFactory: IPlayerDataFactory) {
        this._alias = ["eq"]
        this._playerDataFactory = playerDataFactory
        mp.events.add(ActionsMenu.PREFIX + ActionsMenu.SHOW_EQ, (player: PlayerMp) => {
            this.execute(player, [])
        })
    }

    public execute(player: PlayerMp, args: string[]) {
        const playerData: IPlayerData = this._playerDataFactory.create().load(player)
        player.call(EquipmentModuleEvent.SHOW_EQ, [JSON.stringify(playerData.items)])
    }
}
