import { ChatModuleServerEvent } from "core/Chat/ChatModuleServerEvent"
import { IChatMessageData } from "core/Chat/MessageData/IChatMessageData"
import { IChatSpecialTabSender } from "./IChatSpecialTabSender"

export class GlobalTabSender implements IChatSpecialTabSender {
    public send(authorPlayer: PlayerMp, messageData: IChatMessageData) {
        mp.players.forEach((sendMessageTo: PlayerMp) => {
            sendMessageTo.call(ChatModuleServerEvent.ADD_MESSAGE, [JSON.stringify(messageData)])
        })
    }
}
