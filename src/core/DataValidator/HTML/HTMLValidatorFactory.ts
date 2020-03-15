import { IRegExpFactory } from "core/RegExpFactory/IRegExpFactory"
import { HTMLValidator } from "./HTMLValidator"

export class HTMLValidatorFactory {
    private _regExpFactory: IRegExpFactory = null
    constructor(regExpFactory: IRegExpFactory) {
        this._regExpFactory = regExpFactory
    }

    public create() {
        return new HTMLValidator(this._regExpFactory)
    }
}
