import { IPlayerData } from "./IPlayerData"
import { PlayerDataProps } from "./PlayerDataProps"

export class PlayerData implements IPlayerData {
    private _id: number
    get id() {
        return this._id
    }

    private _rank: string
    get rank() {
        return this._rank
    }

    private _kills: number
    public get kills() {
        return this._kills
    }

    private _deaths: number
    public get deaths() {
        return this._deaths
    }

    private _status: string
    public get status() {
        return this._status
    }

    private _ping: number
    public get ping() {
        return this._ping
    }

    private _name: string
    public get name() {
        return this._name
    }

    public initialize(player: PlayerMp) {
        this._rank = "Gracz"
        this._kills = 0
        this._id = player.id
        this._deaths = 0
        this._status = "Aktywny"
        this._ping = player.ping
        this._name = player.name

        player.setVariable(PlayerDataProps.RANK, this._rank)
        player.setVariable(PlayerDataProps.KILLS, this._kills)
        player.setVariable(PlayerDataProps.DEATHS, this._deaths)
        player.setVariable(PlayerDataProps.STATUS, this._status)
        player.setVariable(PlayerDataProps.PING, this.ping)
        player.setVariable(PlayerDataProps.NAME, this._name)
        player.setVariable(PlayerDataProps.ID, this._id)

    }

    public load(player: PlayerMp) {
        this.sync(player)
        return this
    }

    public sync(player: PlayerMp) {
        this._rank = player.getVariable(PlayerDataProps.RANK)
        this._kills = player.getVariable(PlayerDataProps.KILLS)
        this._deaths = player.getVariable(PlayerDataProps.DEATHS)
        this._status = player.getVariable(PlayerDataProps.STATUS)
        this._ping = player.ping
        this._name = player.getVariable(PlayerDataProps.NAME)
        this._id = player.id
    }

    public toJSON() {
        const obj: any = {}
        obj[PlayerDataProps.RANK] = this._rank
        obj[PlayerDataProps.KILLS] = this._kills
        obj[PlayerDataProps.DEATHS] = this._deaths
        obj[PlayerDataProps.STATUS] = this._status
        obj[PlayerDataProps.PING] = this._ping
        obj[PlayerDataProps.NAME] = this._name
        obj[PlayerDataProps.ID] = this._id
        return obj
    }
}
