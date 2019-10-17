import { IPlayerHashPassword } from "./IPlayerHashPassword"
import { IPlayerHashPasswordFactory } from "./IPlayerHashPasswordFactory"
import { PlayerHashPassword } from "./PlayerHashPassword"

export class PlayerHashPasswordFactory implements IPlayerHashPasswordFactory {
    public create() {
        return new PlayerHashPassword()
    }
}
