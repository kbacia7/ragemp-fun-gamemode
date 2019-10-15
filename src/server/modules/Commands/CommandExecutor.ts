import { ICommand } from "./ICommand"

export class CommandExecutor {
    public addCommands(commands: ICommand[]) {
        commands.forEach((command) => {
            console.log("o")
            command.alias.forEach((commandAlias) => {
                console.log("a")
                mp.events.addCommand(commandAlias, (player: PlayerMp, text: string) => {
                    if (!text) {
                        text = ""
                    }
                    command.execute(player, text.split(" "))
                })
            })
        })
    }
}
