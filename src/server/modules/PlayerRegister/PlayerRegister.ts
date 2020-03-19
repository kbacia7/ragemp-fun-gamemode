import { IPlayerEmailValidatorFactory } from "core/DataValidator/PlayerEmail/IPlayerEmailValidatorFactory"
import { IPlayerLoginValidatorFactory } from "core/DataValidator/PlayerLogin/IPlayerLoginValidatorFactory"
import { IPlayerRegiserData } from "core/PlayerRegister/IPlayerRegisterData"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { IncomingMessage } from "http"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { PlayerSaveResponses } from "server/core/API/PlayerSaveResponses"
import { Player } from "server/entity/Player"
import { IPlayerHashPassword } from "../../core/PlayerHashPassword/IPlayerHashPassword"
import { IPlayerHashPasswordFactory } from "../../core/PlayerHashPassword/IPlayerHashPasswordFactory"

export class PlayerRegister {
    private _apiManager: IAPIManager<Player> = null
    private _promiseFactory: IPromiseFactory<boolean> = null
    private _playerEmailValidatorFactory: IPlayerEmailValidatorFactory = null
    private _playerLoginValidatorFactory: IPlayerLoginValidatorFactory = null

    constructor(
        apiManager: IAPIManager<Player>,
        promiseFactory: IPromiseFactory<boolean>,
        playerEmailValidatorFactory: IPlayerEmailValidatorFactory,
        playerLoginValidatorFactory: IPlayerLoginValidatorFactory,
        playerHashPasswordFactory: IPlayerHashPasswordFactory,

    ) {
        this._apiManager = apiManager
        this._promiseFactory = promiseFactory
        this._playerEmailValidatorFactory = playerEmailValidatorFactory
        this._playerLoginValidatorFactory = playerLoginValidatorFactory
        mp.events.add(PlayerRegisterEvent.REGISTER, (player: PlayerMp, playerRegisterDataStr: string) => {
            const playerRegisterData: IPlayerRegiserData = JSON.parse(playerRegisterDataStr)
            const playerHashPassword: IPlayerHashPassword = playerHashPasswordFactory.create()
            playerRegisterData.password = playerHashPassword.hash(playerRegisterData.password)
            if (!this._playerLoginValidatorFactory.create().validate(playerRegisterData.login)) {
                player.call(PlayerRegisterEvent.UNKNOWN_ERROR)
            } else if (!this._playerEmailValidatorFactory.create().validate(playerRegisterData.email)) {
                player.call(PlayerRegisterEvent.UNKNOWN_ERROR)
            } else {
                this._apiManager.send(APIRequests.PLAYER_REGISTER, {
                    email: playerRegisterData.email,
                    login: playerRegisterData.login,
                    password: playerRegisterData.password,
                }).then((res: IncomingMessage) => {
                    let responseAsString: string = ""
                    res.on("data", (chunk) => {
                        responseAsString += chunk
                    })
                    res.on("end", () => {
                        const response: number = parseInt(responseAsString, 10)
                        switch (response) {
                            case PlayerSaveResponses.ALL_OK: {
                                player.call(PlayerRegisterEvent.CREATED)
                                this._apiManager.send(APIRequests.PLAYER_LOGIN, {
                                    login: playerRegisterData.login,
                                }).then((resFromPost: IncomingMessage) => {
                                   if (resFromPost.statusCode !== 200) {
                                    player.call(PlayerRegisterEvent.LOGIN_INCORRECT_DATA)
                                   } else {
                                    let responseInJson = ""
                                    resFromPost.on("data", (chunk) => {
                                        responseInJson += chunk
                                    })
                                    resFromPost.on("end", () => {
                                        const p: Player = JSON.parse(responseInJson)
                                        player.call(PlayerRegisterEvent.LOGGED_INTO_ACCOUNT)
                                        mp.events.call("playerStartPlay", player, playerRegisterData.login, p)
                                    })

                                   }
                                })
                                mp.events.call("playerStartPlay", player, playerRegisterData.login)
                                break
                            }
                            case PlayerSaveResponses.EMAIL_TAKEN: {
                                player.call(PlayerRegisterEvent.EMAIL_TAKEN)
                                break
                            }
                            case PlayerSaveResponses.LOGIN_TAKEN: {
                                player.call(PlayerRegisterEvent.LOGIN_TAKEN)
                                break
                            }
                            default: {
                                player.call(PlayerRegisterEvent.UNKNOWN_ERROR)
                                break
                            }
                        }
                    })
                })
            }
        })
    }
}
