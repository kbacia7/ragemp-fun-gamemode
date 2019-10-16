import { IRegExpFactory } from "core/RegeXpFactory/IRegeXpFactory"
import { PlayerLoginValidator } from "./PlayerLoginValidator"

export class PlayerLoginValidatorFactory {
    private _regExpFactory: IRegExpFactory = null
    constructor(regExpFactory: IRegExpFactory) {
        this._regExpFactory = regExpFactory
    }

    public create() {
        return new PlayerLoginValidator(this._regExpFactory)
    }
}
