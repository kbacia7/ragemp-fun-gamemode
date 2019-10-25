import {
    AutomaticEventLoadArenaNotImplemented,
} from "core/exception/AutomaticEvent/AutomaticEventLoadArenaNotImplemented"
import {
    AutomaticEventPreparePlayerNotImplemented,
} from "core/exception/AutomaticEvent/AutomaticEventPreparePlayerNotImplemented"
import { Dimension } from "server/core/Dimension/Dimension"
import { IAutomaticEvent } from "./IAutomaticEvent"
import { IAutomaticEventData } from "./IAutomaticEventData"

export class AutomaticEvent implements IAutomaticEvent {
    protected _automaticEventData: IAutomaticEventData
    protected _eventDimension: number = Dimension.EVENTS + this._automaticEventData.type
    public get automaticEventData() {
        return this._automaticEventData
    }

    constructor(automaticEventData: IAutomaticEventData) {
        this._automaticEventData = automaticEventData
    }

    public preparePlayer(playerMp) {
        throw new AutomaticEventPreparePlayerNotImplemented()
    }

    public loadArena() {
        throw new AutomaticEventLoadArenaNotImplemented()
    }
}
