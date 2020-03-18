import { ChatModuleServerEvent } from "core/Chat/ChatModuleServerEvent"
import { IChatMessageData } from "core/Chat/MessageData/IChatMessageData"
import { IChatSpecialTabSender } from "./IChatSpecialTabSender"

export class NotificationTabSender implements IChatSpecialTabSender {
    public send(authorPlayer: PlayerMp, messageData: IChatMessageData) {
        authorPlayer.call(ChatModuleServerEvent.ADD_MESSAGE, [JSON.stringify(messageData)])
    }
}
