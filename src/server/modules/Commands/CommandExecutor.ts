import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { ICommand } from "./ICommand"

export class CommandExecutor {
    private _playerDataFactory: IPlayerDataFactory = null
    constructor(playerDataFactory: IPlayerDataFactory) {
        this._playerDataFactory = playerDataFactory
    }

    public addCommands(commands: ICommand[]) {
        commands.forEach((command) => {
            command.alias.forEach((commandAlias) => {
                mp.events.addCommand(commandAlias, (player: PlayerMp, text: string) => {
                    const playerData: IPlayerData = this._playerDataFactory.create().load(player)
                    if (playerData.isLogged) {
                        if (!text) {
                            text = ""
                        }
                        command.execute(player, text.split(" "))
                    }
                })
            })
        })
    }
}
