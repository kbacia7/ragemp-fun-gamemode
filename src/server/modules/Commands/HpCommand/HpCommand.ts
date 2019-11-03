import { CommandListenerEvent } from "core/CommandListener/CommandListenerEvent"
import { ActionsMenu } from "server/core/ActionsMenu/ActionsMenu"
import { ICommand } from "../ICommand"

export class HpCommand implements ICommand {
    private _alias: string[] = null
    public get alias() {
        return this._alias
    }

    constructor() {
        this._alias = ["hp", "health"]
        mp.events.add(ActionsMenu.PREFIX + ActionsMenu.HP_COMMAND_SUFFIX, (player: PlayerMp) => {
            this.execute(player, ["100"])
        })
    }

    public execute(player: PlayerMp, args: string[]) {
        player.health = parseInt(args[0], 10)
        console.log(`X: ${player.position.x} Y: ${player.position.y} Z: ${player.position.z}
         Rotation: ${player.heading}`)
    }
}
