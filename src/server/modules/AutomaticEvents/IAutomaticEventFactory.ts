import { IAutomaticEvent } from "./IAutomaticEvent"
import { IAutomaticEventData } from "./IAutomaticEventData"

export interface IAutomaticEventFactory {
    create: (automaticEventData: IAutomaticEventData) => IAutomaticEvent
}
