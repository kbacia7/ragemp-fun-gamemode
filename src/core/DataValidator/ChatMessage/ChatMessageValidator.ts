import { IRegExpFactory } from "core/RegExpFactory/IRegExpFactory"
import { IDataValidator } from "../IDataValidator"

export class ChatMessageValidator implements IDataValidator {
    private _regExpFactory: IRegExpFactory = null
    constructor(regExpFactory: IRegExpFactory) {
        this._regExpFactory = regExpFactory
    }

    public validate(text: string) {
        return text.length < 200
    }

}
