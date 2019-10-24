import { AutomaticEventType } from "server/modules/AutomaticEvents/AutomaticEventType"
import { IPlayerData } from "./IPlayerData"
import { PlayerDataProps } from "./PlayerDataProps"
import { PlayerDataStatus } from "./PlayerDataStatus"

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

    private _status: PlayerDataStatus
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

    private _isLogged: boolean
    public get isLogged() {
        return this._isLogged
    }

    private _playAsGuest: boolean
    public get playAsGuest() {
        return this._playAsGuest
    }

    private _savedOnEvents: AutomaticEventType[]
    public get savedOnEvents() {
        return this._savedOnEvents
    }

    private _nameColor: string
    public get nameColor() {
        return this._nameColor
    }

    private _ped: number
    public get ped() {
        return this._ped
    }

    public initialize(player: PlayerMp) {
        this._rank = "Gracz"
        this._kills = 0
        this._id = player.id
        this._deaths = 0
        this._status = PlayerDataStatus.ACTIVE
        this._ping = player.ping
        this._name = player.name
        this._isLogged = false
        this._playAsGuest = false
        this._savedOnEvents = []
        this._ped = 0
        this._nameColor = this._getRandomColor()

        player.setVariable(PlayerDataProps.RANK, this._rank)
        player.setVariable(PlayerDataProps.KILLS, this._kills)
        player.setVariable(PlayerDataProps.DEATHS, this._deaths)
        player.setVariable(PlayerDataProps.STATUS, this._status)
        player.setVariable(PlayerDataProps.PING, this.ping)
        player.setVariable(PlayerDataProps.NAME, this._name)
        player.setVariable(PlayerDataProps.ISLOGGED, this._isLogged)
        player.setVariable(PlayerDataProps.PLAY_AS_GUEST, this._playAsGuest)
        player.setVariable(PlayerDataProps.SAVED_ON_EVENTS, this._savedOnEvents)
        player.setVariable(PlayerDataProps.NAMECOLOR, this._nameColor)
        player.setVariable(PlayerDataProps.ID, this._id)
        player.setVariable(PlayerDataProps.PED, this._ped)

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
        this._isLogged = player.getVariable(PlayerDataProps.ISLOGGED)
        this._playAsGuest = player.getVariable(PlayerDataProps.PLAY_AS_GUEST)
        this._nameColor = player.getVariable(PlayerDataProps.NAMECOLOR)
        this._savedOnEvents = player.getVariable(PlayerDataProps.SAVED_ON_EVENTS)
        this._id = player.id
        this._ped = player.getVariable(PlayerDataProps.PED)
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
        obj[PlayerDataProps.ISLOGGED] = this._isLogged
        obj[PlayerDataProps.PLAY_AS_GUEST] = this._playAsGuest
        obj[PlayerDataProps.SAVED_ON_EVENTS] = this._savedOnEvents
        obj[PlayerDataProps.NAMECOLOR] = this._nameColor
        obj[PlayerDataProps.PED] = this._ped
        return obj
    }

    private _getRandomColor() {
        const letters = "0123456789ABCDEF"
        let color = "#"
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    }
}
