import { IPlayerData } from "core/PlayerDataProps/IPlayerData"

export interface IActivePlayersLoader {
    load: () => Promise<IPlayerData[]>
}
