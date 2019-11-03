import { AutomaticEventType } from "./AutomaticEventType"

export interface IAutomaticEventData {
    minExp: number
    maxExp: number
    minMoney: number
    maxMoney: number
    minPlayers: number
    actualPlayers: number
    maxPlayers: number
    name: string
    displayName: string
    type: AutomaticEventType
}
