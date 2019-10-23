import { IRegisterAutomaticEventData } from "./IRegisterAutomaticEventData"

export class RegisterAutomaticEventData implements IRegisterAutomaticEventData {
    public name: string
    public actualPlayers: number
    public maxPlayers: number

    constructor(name: string, maxPlayers: number) {
        this.name = name
        this.maxPlayers = maxPlayers
        this.actualPlayers = 0
    }
}
