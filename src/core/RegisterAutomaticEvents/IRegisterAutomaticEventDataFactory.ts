import { IRegisterAutomaticEventData } from "./IRegisterAutomaticEventData"

export interface IRegisterAutomaticEventDataFactory {
    create: (name: string, maxPlayers: number, minPlayers: number) => IRegisterAutomaticEventData
}
