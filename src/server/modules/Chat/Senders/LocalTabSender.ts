import { ChatModuleServerEvent } from "core/Chat/ChatModuleServerEvent"
import { IChatMessageData } from "core/Chat/MessageData/IChatMessageData"
import { IChatSpecialTabSender } from "./IChatSpecialTabSender"

export class LocalTabSender implements IChatSpecialTabSender {
    public send(authorPlayer: PlayerMp, messageData: IChatMessageData) {

        mp.players.forEach((sendMessageTo: PlayerMp) => {
            const x = authorPlayer.position.x - sendMessageTo.position.x
            const y = authorPlayer.position.y - sendMessageTo.position.y
            const z = authorPlayer.position.z - sendMessageTo.position.z
            const distance = Math.sqrt(x * x + y * y + z * z)
            if (distance < 30) {
                sendMessageTo.call(ChatModuleServerEvent.ADD_MESSAGE, [JSON.stringify(messageData)])
            }
        })
    }
}
