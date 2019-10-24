import { AutomaticEventType } from "./AutomaticEventType"

export interface IAutomaticEvent {
    minPlayers: number
    actualPlayers: number
    maxPlayers: number
    name: string
    displayName: string
    type: AutomaticEventType
    preparePlayer: (player: PlayerMp) => void
}
