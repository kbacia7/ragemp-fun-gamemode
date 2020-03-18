import { IChatMessageData } from "core/Chat/MessageData/IChatMessageData"

export interface IChatSpecialTabSender {
    send: (authorPlayer: PlayerMp, messageData: IChatMessageData) => void
}
