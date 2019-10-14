import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"

export class Chat {
    constructor() {
        mp.events.add("playerChat", (player: PlayerMp, message: string) => {
            const senderColor: string = player.getVariable(PlayerDataProps.NAMECOLOR)
            const senderName: string = player.getVariable(PlayerDataProps.NAME)
            if (!message.includes("!{")) {
                mp.players.forEach((sendMessageTo: PlayerMp) => {
                    sendMessageTo.outputChatBox(`!{${senderColor}}${senderName}!{#FFFFFF}: ${message}`)
                })
            }
        })
    }
}
