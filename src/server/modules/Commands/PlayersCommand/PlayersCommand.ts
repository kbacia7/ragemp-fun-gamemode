import { CommandListenerEvent } from "core/CommandListener/CommandListenerEvent"
import { ICommand } from "../ICommand"

export class PlayersCommand implements ICommand {
    private _alias: string[] = null
    public get alias() {
        return this._alias
    }

    constructor() {
        this._alias = ["players", "stats"]
    }
    public execute(player: PlayerMp, args: string[]) {
        player.call(CommandListenerEvent.SEND, [this._alias[0], args])
    }
}
