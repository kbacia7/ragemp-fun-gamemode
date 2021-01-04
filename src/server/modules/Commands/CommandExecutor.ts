import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { ICommand } from "./ICommand"

export class CommandExecutor {
    private _playerDataFactory: IPlayerDataFactory = null
    private _allRegisteredCommands: {} = {}
    constructor(playerDataFactory: IPlayerDataFactory) {
        this._playerDataFactory = playerDataFactory
        this._allRegisteredCommands = {}
    }

    public addCommands(commands: ICommand[]) {
        commands.forEach((command) => {
            command.alias.forEach((commandAlias) => {
                this._allRegisteredCommands[commandAlias] = command
            })
        })
    }

    public executeCommand(player: PlayerMp, alias: string, args: string[]) {
        if (alias in this._allRegisteredCommands) {
            this._allRegisteredCommands[alias].execute(player, args)
        }
    }
}
