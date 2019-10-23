import { IRegisterAutomaticEventData } from "./IRegisterAutomaticEventData"
import {  RegisterAutomaticEventData } from "./RegisterAutomaticEventData"

export class RegisterAutomaticEventDataFactory {
    public create(name: string, maxPlayers: number, minPlayers: number) {
        return new RegisterAutomaticEventData(name, maxPlayers, minPlayers)
    }
}
