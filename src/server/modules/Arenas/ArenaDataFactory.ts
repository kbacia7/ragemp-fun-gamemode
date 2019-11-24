import {
    AutomaticEventLoadArenaNotImplemented,
} from "core/exception/AutomaticEvent/AutomaticEventLoadArenaNotImplemented"
import { Dimension } from "server/core/Dimension/Dimension"
import { Player } from "server/entity/Player"
import { ArenaData } from "./ArenaData"
import { ArenaType } from "./ArenaType"
import { IArenaDataFactory } from "./IArenaDataFactory"

export class ArenaDataFactory implements IArenaDataFactory {
    public create(
        name: string,
        displayName: string,
        type: ArenaType,
        actualPlayers: number,
        maxPlayers: number,
    ) {
        return new ArenaData(
            name, displayName, type, actualPlayers, maxPlayers,
        )
    }
}
