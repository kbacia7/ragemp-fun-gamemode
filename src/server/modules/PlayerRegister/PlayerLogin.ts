import { IPlayerEmailValidatorFactory } from "core/DataValidator/PlayerEmail/IPlayerEmailValidatorFactory"
import { IPlayerLoginValidatorFactory } from "core/DataValidator/PlayerLogin/IPlayerLoginValidatorFactory"
import { IPlayerLoginData } from "core/PlayerRegister/IPlayerLoginData"
import { IPlayerRegiserData } from "core/PlayerRegister/IPlayerRegisterData"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { IAPIManager } from "server/core/API/IAPIManager"
import { IPlayerHashPassword } from "../../core/PlayerHashPassword/IPlayerHashPassword"
import { IPlayerHashPasswordFactory } from "../../core/PlayerHashPassword/IPlayerHashPasswordFactory"
import { Player } from "server/entity/Player"
import { APIRequests } from "server/core/API/APIRequests"
import { IncomingMessage } from "http"

export class PlayerLogin {
    private _apiManager: IAPIManager<Player> = null
    private _playerLoginValidatorFactory: IPlayerLoginValidatorFactory = null

    constructor(
        apiManager: IAPIManager<Player>,
        playerLoginValidatorFactory: IPlayerLoginValidatorFactory,
        playerHashPasswordFactory: IPlayerHashPasswordFactory,

    ) {
        this._apiManager = apiManager
        this._playerLoginValidatorFactory = playerLoginValidatorFactory
        mp.events.add(PlayerRegisterEvent.LOGIN, (player: PlayerMp, playerLoginDataStr: string) => {
            const playerLoginData: IPlayerLoginData = JSON.parse(playerLoginDataStr)
            const playerHashPassword: IPlayerHashPassword = playerHashPasswordFactory.create()
            if (!this._playerLoginValidatorFactory.create().validate(playerLoginData.login)) {
                player.call(PlayerRegisterEvent.UNKNOWN_ERROR)
            } else {
                this._apiManager.send(APIRequests.PLAYER_LOGIN, {
                    login: playerLoginData.login,
                    password: playerHashPassword.hash(playerLoginData.password)
                }).then((res: IncomingMessage) => {
                   if(res.statusCode !== 200) {
                    player.call(PlayerRegisterEvent.LOGIN_INCORRECT_DATA)
                   } else {
                    let responseInJson = ""
                    res.on("data", (chunk) => {
                        responseInJson += chunk
                    })
                    res.on("end", () => {
                        const p: Player = JSON.parse(responseInJson)
                        player.call(PlayerRegisterEvent.LOGGED_INTO_ACCOUNT)
                        mp.events.call("playerStartPlay", player, playerLoginData.login, p)
                    })
                
                   }
                })
            }
        })
    }

}
