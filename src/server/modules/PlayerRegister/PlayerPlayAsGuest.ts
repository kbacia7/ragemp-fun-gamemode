import { IPlayerEmailValidatorFactory } from "core/DataValidator/PlayerEmail/IPlayerEmailValidatorFactory"
import { IPlayerLoginValidatorFactory } from "core/DataValidator/PlayerLogin/IPlayerLoginValidatorFactory"
import { PlayerDataProps } from "core/PlayerDataProps/PlayerDataProps"
import { IPlayerLoginData } from "core/PlayerRegister/IPlayerLoginData"
import { IPlayerRegiserData } from "core/PlayerRegister/IPlayerRegisterData"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import Knex = require("knex")
import { Player } from "server/entity/Player"

export class PlayerPlayAsGuest {
    private _knex: Knex = null
    private _playerLoginValidatorFactory: IPlayerLoginValidatorFactory = null

    constructor(
        knex: Knex,
        playerLoginValidatorFactory: IPlayerLoginValidatorFactory,

    ) {
        this._knex = knex
        this._playerLoginValidatorFactory = playerLoginValidatorFactory
        mp.events.add(PlayerRegisterEvent.PLAY_AS_GUEST, (player: PlayerMp, login: string) => {
            if (!this._playerLoginValidatorFactory.create().validate(login)) {
                player.call(PlayerRegisterEvent.UNKNOWN_ERROR)
            }  else {
                Player.query()
                    .select("login")
                    .where("login", "LIKE", login)
                    .then((players: Player[]) => {
                        if (players.length <= 0) {
                            player.call(PlayerRegisterEvent.PLAY_AS_GUEST_SUCCESS)
                            player.setVariable(PlayerDataProps.PLAY_AS_GUEST, true)
                            mp.events.call("playerStartPlay", player, login)
                        } else {
                            player.call(PlayerRegisterEvent.LOGIN_TAKEN_FOR_GUEST)
                        }
                    })
            }
        })
    }

}
