import { GlobalShopModuleEvent } from "client/modules/GlobalShopModule/GlobalShopModuleEvent"
import { CommandListenerEvent } from "core/CommandListener/CommandListenerEvent"
import { ActionsMenu } from "server/core/ActionsMenu/ActionsMenu"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"
import { Setting } from "server/entity/Setting"
import { ShopTabData } from "server/entity/ShopTabData"
import { IShopManager } from "server/modules/ShopManager/IShopManager"
import { ICommand } from "../ICommand"

export class TeleportCommand implements ICommand {
    private _vector3Factory: IVector3Factory = null
    private _alias: string[] = null
    private _x: number = 0
    private _y: number = 0
    private _z: number = 0
    private _heading: number = 0
    public get alias() {
        return this._alias
    }

    constructor(vector3Factory: IVector3Factory, alias: string, x: number, y: number, z: number, heading: number) {
        this._alias = [alias]
        this._x = x
        this._y = y
        this._z = z
        this._heading = heading
        this._vector3Factory = vector3Factory
        mp.events.add(ActionsMenu.PREFIX + `TELEPORT_${alias}`, (player: PlayerMp) => {
            this.execute(player, [])
        })
    }

    public execute(player: PlayerMp, args: string[]) {
        player.position = this._vector3Factory.create(this._x, this._y, this._z)
        player.heading = this._heading
    }
}
