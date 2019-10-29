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
    protected _eventDimension: number = 0
    public get automaticEventData() {
        return this._automaticEventData
    }

    constructor(automaticEventData: IAutomaticEventData) {
        this._automaticEventData = automaticEventData
        this._eventDimension = Dimension.EVENTS * this.automaticEventData.type + 1
    }

    public start() {
        throw new AutomaticEventLoadArenaNotImplemented()
    }

    public preparePlayer(playerMp) {
        throw new AutomaticEventPreparePlayerNotImplemented()
    }

    public loadArena() {
        throw new AutomaticEventLoadArenaNotImplemented()
    }
}
