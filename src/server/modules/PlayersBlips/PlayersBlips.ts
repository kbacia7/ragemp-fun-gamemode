import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { IPlayerDataFactory } from "core/PlayerDataProps/IPlayerDataFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { PlayerDataStatus } from "core/PlayerDataProps/PlayerDataStatus"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import random from "random"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { IBlipFactory } from "server/core/BlipFactory/IBlipFactory"
import { IVector3Factory } from "server/core/Vector3Factory/IVector3Factory"

export class PlayersBlips {
    constructor(blipFactory: IBlipFactory,
                vector3Factory: IVector3Factory) {
        let allBlips: BlipMp[] = []
        setInterval(() => {
            let i = 0
            mp.players.forEach((p: PlayerMp) => {
                if (i >= allBlips.length) {
                    allBlips.push(
                        blipFactory.create(
                            1, vector3Factory.create(0, 0, 0), undefined, undefined, random.int(1, 85), undefined,
                            undefined, undefined, undefined, 100,
                        ),
                    )
                }
                allBlips[i].dimension = p.dimension
                allBlips[i].position = p.position
                allBlips[i].name = p.getVariable(PlayerDataProps.NAME)
                i++
            })
            if (allBlips.length > mp.players.length) {
                for (let j =  mp.players.length; j < allBlips.length; j++) {
                    allBlips[j].destroy()
                }
                allBlips = allBlips.slice(0, mp.players.length)
            }
        }, 1000)

    }
}
