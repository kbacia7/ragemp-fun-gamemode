import { IPlayerData } from "./IPlayerData"

export interface IPlayerDataFactory {
    create: () => IPlayerData
}
