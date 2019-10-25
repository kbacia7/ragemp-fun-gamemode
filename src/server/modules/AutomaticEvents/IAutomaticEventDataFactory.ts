import { AutomaticEventType } from "./AutomaticEventType"
import { IAutomaticEventData } from "./IAutomaticEventData"

export interface IAutomaticEventDataFactory {
    create: (
        name: string,
        displayName: string,
        type: AutomaticEventType,
        minPlayers: number,
        actualPlayers: number,
        maxPlayers: number,
        minExp: number,
        maxExp: number,
        minMoney: number,
        maxMoney: number,
    ) => IAutomaticEventData
}
