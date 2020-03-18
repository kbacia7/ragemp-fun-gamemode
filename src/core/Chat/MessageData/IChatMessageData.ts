import { IPlayerData } from "core/PlayerDataProps/IPlayerData"

export interface IChatMessageData {
    extraParams?: string,
    sendDateTime: string,
    playerData: IPlayerData,
    message: string,
    id: string,
    tab: string
    color?: string | null
}
