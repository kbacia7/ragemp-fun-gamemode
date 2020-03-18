import { IRegExpFactory } from "core/RegExpFactory/IRegExpFactory"
import { ChatMessageValidator } from "./ChatMessageValidator"

export class ChatMessageValidatorFactory {
    private _regExpFactory: IRegExpFactory = null
    constructor(regExpFactory: IRegExpFactory) {
        this._regExpFactory = regExpFactory
    }

    public create() {
        return new ChatMessageValidator(this._regExpFactory)
    }
}
