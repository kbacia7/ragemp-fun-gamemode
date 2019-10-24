import { Player } from "server/entity/Player"
import { AutomaticEventType } from "./AutomaticEventType"

export class AutomaticEvent {
    public name: string
    public displayName: string
    public type: AutomaticEventType
    public minPlayers: number
    public actualPlayers: number
    public maxPlayers: number

    public preparePlayer(playerMp: PlayerMp) {
        playerMp.health = 50
    }
}
