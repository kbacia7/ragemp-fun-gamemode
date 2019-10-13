import { IPlayerData } from "./IPlayerData"
import { IPlayerDataFactory } from "./IPlayerDataFactory"
import { PlayerData } from "./PlayerData"

export class PlayerDataFactory implements IPlayerDataFactory {
    public create() {
        return new PlayerData()
    }
}
