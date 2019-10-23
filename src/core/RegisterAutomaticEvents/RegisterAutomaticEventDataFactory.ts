import { IRegisterAutomaticEventData } from "./IRegisterAutomaticEventData"
import {  RegisterAutomaticEventData } from "./RegisterAutomaticEventData"

export class RegisterAutomaticEventDataFactory {
    public create(name: string, maxPlayers: number) {
        return new RegisterAutomaticEventData(name, maxPlayers)
    }
}
