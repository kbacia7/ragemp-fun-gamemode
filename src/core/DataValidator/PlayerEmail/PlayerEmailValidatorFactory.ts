import { IRegExpFactory } from "core/RegExpFactory/IRegExpFactory"
import { PlayerEmailValidator } from "./PlayerEmailValidator"

export class PlayerEmailValidatorFactory {
    private _regExpFactory: IRegExpFactory = null
    constructor(regExpFactory: IRegExpFactory) {
        this._regExpFactory = regExpFactory
    }

    public create() {
        return new PlayerEmailValidator(this._regExpFactory)
    }
}
