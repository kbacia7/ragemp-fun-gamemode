import { IRegisterAutomaticEventData } from "core/RegisterAutomaticEvents/IRegisterAutomaticEventData"
import { IRegisterAutomaticEventDataFactory } from "core/RegisterAutomaticEvents/IRegisterAutomaticEventDataFactory"
import { RegisterAutomaticEvents } from "core/RegisterAutomaticEvents/RegisterAutomaticEvents"

export class AutomaticEventsDataProvider {
    private _registerAutomaticEventDataFactory: IRegisterAutomaticEventDataFactory
    constructor(registerAutomaticEventDataFactory: IRegisterAutomaticEventDataFactory) {
        this._registerAutomaticEventDataFactory = registerAutomaticEventDataFactory
        mp.events.add(RegisterAutomaticEvents.GET_AUTOMATIC_EVENTS, (playerMp: PlayerMp) => {
            const automaticEventsDatas: IRegisterAutomaticEventData[] = [
                this._registerAutomaticEventDataFactory.create("TDM", 5),
                this._registerAutomaticEventDataFactory.create("Race", 5),
                this._registerAutomaticEventDataFactory.create("Derby", 4),
                this._registerAutomaticEventDataFactory.create("Hide&Seek", 8),
            ]
            playerMp.call(RegisterAutomaticEvents.PROVIDE_AUTOMATIC_EVENTS, [JSON.stringify(automaticEventsDatas)])
        })
    }
}
