import { IRegExpFactory } from "core/RegeXpFactory/IRegeXpFactory"
import { IDataValidator } from "../IDataValidator"

export class PlayerEmailValidator implements IDataValidator {
    private _regExpFactory: IRegExpFactory = null
    constructor(regExpFactory: IRegExpFactory) {
        this._regExpFactory = regExpFactory
    }

    public validate(text: string) {
        const regex: RegExp = this._regExpFactory.create([
            "^(([^<>()\\[\\]\\\.,;:\\s@\"]+",
            "(\\.[^<>()\\[\\]\\\.,;:\\s@\"]+)*)|(\".+\"))@",
            "((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$",
        ].join(""))
        return regex.test(text) && text.length > 0
    }

}
