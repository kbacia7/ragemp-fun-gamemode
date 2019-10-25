import {
    AutomaticEventLoadArenaNotImplemented,
} from "core/exception/AutomaticEvent/AutomaticEventLoadArenaNotImplemented"
import { Dimension } from "server/core/Dimension/Dimension"
import { Player } from "server/entity/Player"
import { AutomaticEventData } from "./AutomaticEventData"
import { AutomaticEventType } from "./AutomaticEventType"
import { IAutomaticEventData } from "./IAutomaticEventData"
import { IAutomaticEventDataFactory } from "./IAutomaticEventDataFactory"

export class AutomaticEventDataFactory implements IAutomaticEventDataFactory {
    public create(
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
    ) {
        return new AutomaticEventData(
            name, displayName, type, minPlayers, actualPlayers, maxPlayers,
            minExp, maxExp, minMoney, maxMoney,
        )
    }
}
