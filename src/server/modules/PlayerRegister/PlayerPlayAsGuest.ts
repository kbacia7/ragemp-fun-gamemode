import { IPlayerEmailValidatorFactory } from "core/DataValidator/PlayerEmail/IPlayerEmailValidatorFactory"
import { IPlayerLoginValidatorFactory } from "core/DataValidator/PlayerLogin/IPlayerLoginValidatorFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { IPlayerLoginData } from "core/PlayerRegister/IPlayerLoginData"
import { IPlayerRegiserData } from "core/PlayerRegister/IPlayerRegisterData"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import { IncomingMessage } from "http"
import { APIRequests } from "server/core/API/APIRequests"
import { IAPIManager } from "server/core/API/IAPIManager"
import { PlayerPlayAsGuestResponses } from "server/core/API/PlayerPlayAsGuestResponses"
import { Player } from "server/entity/Player"

export class PlayerPlayAsGuest {
    private _playerLoginValidatorFactory: IPlayerLoginValidatorFactory = null

    constructor(
        apiManager: IAPIManager<Player>,
        playerLoginValidatorFactory: IPlayerLoginValidatorFactory,

    ) {
        this._playerLoginValidatorFactory = playerLoginValidatorFactory
        mp.events.add(PlayerRegisterEvent.PLAY_AS_GUEST, (player: PlayerMp, login: string) => {
            if (!this._playerLoginValidatorFactory.create().validate(login)) {
                player.call(PlayerRegisterEvent.UNKNOWN_ERROR)
            }  else {
                apiManager.send(APIRequests.PLAY_AS_GUEST, {
                    login,
                }).then((res: IncomingMessage) => {
                    let responseAsString: string = ""
                    res.on("data", (chunk) => {
                        responseAsString += chunk
                    })
                    res.on("end", () => {
                        const response: number = parseInt(responseAsString)
                        switch (response) {
                            case PlayerPlayAsGuestResponses.ALL_OK: {
                                player.call(PlayerRegisterEvent.PLAY_AS_GUEST_SUCCESS)
                                player.setVariable(PlayerDataProps.PLAY_AS_GUEST, true)
                                mp.events.call("playerStartPlay", player, login)
                                break
                            }
                            case PlayerPlayAsGuestResponses.LOGIN_TAKEN: {
                                player.call(PlayerRegisterEvent.LOGIN_TAKEN_FOR_GUEST)
                                break
                            }
                        }
                    })
                })
            }
        })
    }

}
