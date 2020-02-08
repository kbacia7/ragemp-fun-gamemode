import { IPlayerEmailValidatorFactory } from "core/DataValidator/PlayerEmail/IPlayerEmailValidatorFactory"
import { IPlayerLoginValidatorFactory } from "core/DataValidator/PlayerLogin/IPlayerLoginValidatorFactory"
import { IPlayerLoginData } from "core/PlayerRegister/IPlayerLoginData"
import { IPlayerRegiserData } from "core/PlayerRegister/IPlayerRegisterData"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { IAPIManager } from "server/core/API/IAPIManager"
import { IPlayerHashPassword } from "../../core/PlayerHashPassword/IPlayerHashPassword"
import { IPlayerHashPasswordFactory } from "../../core/PlayerHashPassword/IPlayerHashPasswordFactory"

export class PlayerLogin {
    private _apiManager: IAPIManager<object> = null
    private _playerLoginValidatorFactory: IPlayerLoginValidatorFactory = null

    constructor(
        apiManager: IAPIManager<object>,
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
               /* Player.query()
                    .select("password")
                    .where("login", "LIKE", playerLoginData.login)
                    .then((players: Player[]) => {
                        if (players.length > 0) {
                            if (playerHashPassword.compare(players[0].password, playerLoginData.password)) {
                                player.call(PlayerRegisterEvent.LOGGED_INTO_ACCOUNT)
                                mp.events.call("playerStartPlay", player, playerLoginData.login)
                            } else {
                                player.call(PlayerRegisterEvent.LOGIN_INCORRECT_DATA)
                            }
                        } else {
                            player.call(PlayerRegisterEvent.LOGIN_INCORRECT_DATA)
                        }
                    })*/
            }
        })
    }

}
