import { IRegisterAutomaticEventData } from "./IRegisterAutomaticEventData"

export class RegisterAutomaticEventData implements IRegisterAutomaticEventData {
    public name: string
    public actualPlayers: number
    public maxPlayers: number
    public minPlayers: number

    constructor(name: string, maxPlayers: number, minPlayers: number) {
        this.name = name
        this.maxPlayers = maxPlayers
        this.minPlayers = minPlayers
        this.actualPlayers = 0
    }
}
