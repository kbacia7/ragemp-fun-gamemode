import { IAutomaticEventData } from "./IAutomaticEventData"

export interface IAutomaticEvent {
    automaticEventData: IAutomaticEventData
    preparePlayer: (playerMp) => void
    loadArena: ()  => void
}
