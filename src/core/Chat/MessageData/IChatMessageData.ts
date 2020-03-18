import { IPlayerData } from "core/PlayerDataProps/IPlayerData"

export interface IChatMessageData {
    playerData: IPlayerData,
    message: string,
    id: string,
    tab: string
    color?: string | null
}
