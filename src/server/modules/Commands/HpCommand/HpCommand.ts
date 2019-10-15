import { CommandListenerEvent } from "core/CommandListener/CommandListenerEvent"
import { ICommand } from "../ICommand"

export class HpCommand implements ICommand {
    private _alias: string[] = null
    public get alias() {
        return this._alias
    }

    constructor() {
        this._alias = ["hp", "health"]
    }

    public execute(player: PlayerMp, args: string[]) {
        player.health = parseInt(args[0], 10)
    }
}
