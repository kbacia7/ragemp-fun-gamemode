import { IRegExpFactory } from "core/RegExpFactory/IRegExpFactory"
import { IDataValidator } from "../IDataValidator"

export class HTMLValidator implements IDataValidator {
    private _regExpFactory: IRegExpFactory = null
    constructor(regExpFactory: IRegExpFactory) {
        this._regExpFactory = regExpFactory
    }

    public validate(text: string) {
        const regex: RegExp = this._regExpFactory.create("<\/?[a-z][\s\S]*>", "")
        return regex.test(text) && text.length > 0
    }

}
