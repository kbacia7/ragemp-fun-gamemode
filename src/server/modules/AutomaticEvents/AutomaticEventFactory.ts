import {
    AutomaticEventFactoryCreateNotImplemented,
} from "core/exception/AutomaticEventFactory/AutomaticEventLoadArenaNotImplemented"
import { AutomaticEvent } from "./AutomaticEvent"
import { IAutomaticEvent } from "./IAutomaticEvent"
import { IAutomaticEventData } from "./IAutomaticEventData"
import { IAutomaticEventFactory } from "./IAutomaticEventFactory"

export class AutomaticEventFactory implements IAutomaticEventFactory {
    public create(automaticEventData: IAutomaticEventData) {
        return new AutomaticEvent(automaticEventData)
    }
}
