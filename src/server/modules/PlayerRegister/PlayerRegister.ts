import { IPlayerEmailValidatorFactory } from "core/DataValidator/PlayerEmail/IPlayerEmailValidatorFactory"
import { IPlayerLoginValidatorFactory } from "core/DataValidator/PlayerLogin/IPlayerLoginValidatorFactory"
import { IPlayerRegiserData } from "core/PlayerRegister/IPlayerRegisterData"
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import { IPromiseFactory } from "core/PromiseFactory/IPromiseFactory"
import Knex = require("knex")
import { Player } from "server/entity/Player"
import { IPlayerHashPassword } from "../../core/PlayerHashPassword/IPlayerHashPassword"
import { IPlayerHashPasswordFactory } from "../../core/PlayerHashPassword/IPlayerHashPasswordFactory"

export class PlayerRegister {
    private _knex: Knex = null
    private _promiseFactory: IPromiseFactory<boolean> = null
    private _playerEmailValidatorFactory: IPlayerEmailValidatorFactory = null
    private _playerLoginValidatorFactory: IPlayerLoginValidatorFactory = null

    constructor(
        knex: Knex,
        promiseFactory: IPromiseFactory<boolean>,
        playerEmailValidatorFactory: IPlayerEmailValidatorFactory,
        playerLoginValidatorFactory: IPlayerLoginValidatorFactory,
        playerHashPasswordFactory: IPlayerHashPasswordFactory,

    ) {
        this._knex = knex
        this._promiseFactory = promiseFactory
        this._playerEmailValidatorFactory = playerEmailValidatorFactory
        this._playerLoginValidatorFactory = playerLoginValidatorFactory
        mp.events.add(PlayerRegisterEvent.REGISTER, (player: PlayerMp, playerRegisterDataStr: string) => {
            const playerRegisterData: IPlayerRegiserData = JSON.parse(playerRegisterDataStr)
            const playerHashPassword: IPlayerHashPassword = playerHashPasswordFactory.create()
            playerRegisterData.password = playerHashPassword.hash(playerRegisterData.password, playerRegisterData.login)
            if (!this._playerLoginValidatorFactory.create().validate(playerRegisterData.login)) {
                player.call(PlayerRegisterEvent.UNKNOWN_ERROR)
            } else if (!this._playerEmailValidatorFactory.create().validate(playerRegisterData.email)) {
                player.call(PlayerRegisterEvent.UNKNOWN_ERROR)
            } else {
                Player.query()
                    .select("login")
                    .where("login", "LIKE", playerRegisterData.login).then((players: Player[]) => {
                        if (players.length > 0) {
                            player.call(PlayerRegisterEvent.LOGIN_TAKEN)
                        } else {
                            Player.query()
                                .select("email")
                                .where("email", "LIKE", playerRegisterData.email)
                                .then((playersWithThisMail: Player[]) => {
                                    if (playersWithThisMail.length > 0) {
                                        player.call(PlayerRegisterEvent.EMAIL_TAKEN)

                                    } else {
                                        this._addNewPlayerAccount(playerRegisterData).then((created) => {
                                            console.log(created)
                                            if (created) {
                                                player.call(PlayerRegisterEvent.CREATED)
                                                player.call(PlayerRegisterEvent.LOGGED_INTO_ACCOUNT)
                                                mp.events.call("playerStartPlay", player, playerRegisterData.login)
                                            } else {
                                                player.call(PlayerRegisterEvent.UNKNOWN_ERROR)
                                            }
                                        })
                                    }
                                })
                        }
                    })
            }
        })
    }

    private _addNewPlayerAccount(playerRegisterData: IPlayerRegiserData) {
        return this._promiseFactory.create((resolve) => {
            Player.query().insert({
                deaths: 0,
                email: playerRegisterData.email,
                kills: 0,
                login: playerRegisterData.login,
                password: playerRegisterData.password,
                rank: "Gracz",
            }).then((insertedPlayer: Player) => {
                if (insertedPlayer) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    }
}
