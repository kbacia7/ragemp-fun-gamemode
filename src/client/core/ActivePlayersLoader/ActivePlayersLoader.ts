import { ActivePlayersEvents } from "core/ActivePlayers/ActivePlayersEvents"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { PlayerData } from "core/PlayerDataProps/PlayerData"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import _ from "lodash"
import { IActivePlayersLoader } from "./IActivePlayersLoader"
export class ActivePlayersLoader implements IActivePlayersLoader {
    private _promiseFactory: IPromiseFactory<IPlayerData[]> = null
    private _playersData: IPlayerData[] = null

    constructor(promiseFactory: IPromiseFactory<IPlayerData[]>) {
        this._promiseFactory = promiseFactory
        mp.events.add(ActivePlayersEvents.LOAD_PLAYERS_TO_TABLE, (playersInJson: string) => {
            const players: IPlayerData[] = JSON.parse(playersInJson)
            this._playersData = players
        })
    }

    public load() {
        return this._promiseFactory.create((resolve) => {
            mp.events.callRemote(ActivePlayersEvents.GET_ACTIVE_PLAYERS)
            this._waitUntilPlayersDoneLoad().then((playersData: IPlayerData[]) => {
                resolve(playersData)
            })
        })

    }

    private _waitUntilPlayersDoneLoad(): Promise<IPlayerData[]> {
        return this._promiseFactory.create((resolve) => {
            const WAIT_TO_LOAD_TIMEOUT = 50
            const wait = () => {
                setTimeout(() => {
                    if (this._playersData) {
                        resolve(this._playersData)
                    } else {
                        wait()
                    }
                }, WAIT_TO_LOAD_TIMEOUT)

            }
            wait()

        })

    }
}
