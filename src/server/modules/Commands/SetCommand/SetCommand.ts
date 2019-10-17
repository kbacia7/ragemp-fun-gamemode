import { CommandListenerEvent } from "core/CommandListener/CommandListenerEvent"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { ICommand } from "../ICommand"

export class SetCommand implements ICommand {
    private _alias: string[] = null
    public get alias() {
        return this._alias
    }

    constructor(playerDataFactory: IPlayerDataFactory) {
        this._alias = ["set"]
    }

    public execute(player: PlayerMp, args: string[]) {
        if (args[0] === "armour") {
            player.armour = parseInt(args[1], 10)
        } else if (args[0] === "deaths") {
            player.setVariable(PlayerDataProps.KILLS, parseInt(args[1], 10))
        }
    }
}
