import { AutomaticEvent } from "./AutomaticEvent"
import { IAutomaticEvent } from "./IAutomaticEvent"
import { IAutomaticEventData } from "./IAutomaticEventData"

export interface IAutomaticEventFactory {
    create: (automaticEventData: IAutomaticEventData) => AutomaticEvent
}
