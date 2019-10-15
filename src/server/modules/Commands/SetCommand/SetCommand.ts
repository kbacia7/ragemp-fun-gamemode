import { CommandListenerEvent } from "core/CommandListener/CommandListenerEvent"
import { ICommand } from "../ICommand"

export class SetCommand implements ICommand {
    private _alias: string[] = null
    public get alias() {
        return this._alias
    }

    constructor() {
        this._alias = ["set"]
    }

    public execute(player: PlayerMp, args: string[]) {
        if (args[0] === "armour") {
            player.armour = parseInt(args[1], 10)
        }
    }
}
