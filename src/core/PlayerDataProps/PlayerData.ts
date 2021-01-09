import { throws } from "assert"
import { Item } from "server/entity/Item"
import { Level } from "server/entity/Level"
import { PlayerItem } from "server/entity/PlayerItem"
import { Rank } from "server/entity/Rank"
import { ArenaType } from "server/modules/Arenas/ArenaType"
import { AutomaticEventType } from "server/modules/AutomaticEvents/AutomaticEventType"
import { IPlayerData } from "./IPlayerData"
import { PlayerDataProps } from "./PlayerDataProps"
import { PlayerDataStatus } from "./PlayerDataStatus"

export class PlayerData implements IPlayerData {
    private _id: number
    get id() {
        return this._id
    }

    private _databaseId: number
    get databaseId() {
        return this._databaseId
    }
    private _rank: Rank
    get rank() {
        return this._rank
    }

    private _rankName: string
    get rankName() {
        return this._rankName
    }

    private _items: PlayerItem[]
    get items() {
        return this._items
    }

    private _kills: number
    public get kills() {
        return this._kills
    }

    private _deaths: number
    public get deaths() {
        return this._deaths
    }

    private _money: number
    public get money() {
        return this._money
    }

    private _level: Level
    public get level() {
        return this._level
    }

    private _exp: number
    public get exp() {
        return this._exp
    }

    private _diamonds: number
    public get diamonds() {
        return this._diamonds
    }

    private _status: PlayerDataStatus
    public get status() {
        return this._status
    }

    private _ping: number
    public get ping() {
        return this._ping
    }

    private _startPlayTime: number
    public get startPlayTime() {
        return this._startPlayTime
    }

    private _onlineTime: number
    public get onlineTime() {
        return this._onlineTime
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

    private _onEvent: AutomaticEventType
    public get onEvent() {
        return this._onEvent
    }

    private _onArena: ArenaType
    public get onArena() {
        return this._onArena
    }

    private _nameColor: string
    public get nameColor() {
        return this._nameColor
    }
    public initialize(player: PlayerMp) {
        this._rankName = "Gracz"
        this._kills = 0
        this._id = player.id
        this._databaseId = 0
        this._deaths = 0
        this._status = PlayerDataStatus.ACTIVE
        this._ping = 0
        this._name = player.name
        this._isLogged = false
        this._playAsGuest = false
        this._savedOnEvents = []
        this._money = 0
        this._level = null
        this._exp = 0
        this._onlineTime = 0
        this._startPlayTime = 0
        this._items = []
        this._diamonds = 0
        this._onEvent = AutomaticEventType.NOTHING
        this._onArena = ArenaType.NOTHING
        this._nameColor = this._getRandomColor()

        player.setVariable(PlayerDataProps.RANK, this._rank)
        player.setVariable(PlayerDataProps.RANK_NAME, this._rankName)
        player.setVariable(PlayerDataProps.KILLS, this._kills)
        player.setVariable(PlayerDataProps.DEATHS, this._deaths)
        player.setVariable(PlayerDataProps.STATUS, this._status)
        player.setVariable(PlayerDataProps.PING, this.ping)
        player.setVariable(PlayerDataProps.NAME, this._name)
        player.setVariable(PlayerDataProps.ISLOGGED, this._isLogged)
        player.setVariable(PlayerDataProps.PLAY_AS_GUEST, this._playAsGuest)
        player.setVariable(PlayerDataProps.SAVED_ON_EVENTS, this._savedOnEvents)
        player.setVariable(PlayerDataProps.ON_EVENT, this._onEvent)
        player.setVariable(PlayerDataProps.ON_ARENA, this._onArena)
        player.setVariable(PlayerDataProps.NAMECOLOR, this._nameColor)
        player.setVariable(PlayerDataProps.ID, this._id)
        player.setVariable(PlayerDataProps.MONEY, this._money)
        player.setVariable(PlayerDataProps.LEVEL, this._level)
        player.setVariable(PlayerDataProps.EXP, this._exp)
        player.setVariable(PlayerDataProps.ONLINE_TIME, this._onlineTime)
        player.setVariable(PlayerDataProps.START_PLAY_TIME, this._startPlayTime)
        player.setVariable(PlayerDataProps.ITEMS, this._items)
        player.setVariable(PlayerDataProps.DIAMONDS, this._diamonds)
        player.setVariable(PlayerDataProps.DATABASE_ID, this._databaseId)

    }

    public load(player: PlayerMp) {
        this.sync(player)
        return this
    }

    public sync(player: PlayerMp) {
        this._rank = player.getVariable(PlayerDataProps.RANK)
        this._rankName =  player.getVariable(PlayerDataProps.RANK_NAME)
        this._kills = player.getVariable(PlayerDataProps.KILLS)
        this._deaths = player.getVariable(PlayerDataProps.DEATHS)
        this._status = player.getVariable(PlayerDataProps.STATUS)
        this._ping = player.getVariable(PlayerDataProps.PING)
        this._name = player.getVariable(PlayerDataProps.NAME)
        this._isLogged = player.getVariable(PlayerDataProps.ISLOGGED)
        this._diamonds = player.getVariable(PlayerDataProps.DIAMONDS)
        this._money = player.getVariable(PlayerDataProps.MONEY)
        this._level = player.getVariable(PlayerDataProps.LEVEL)
        this._exp = player.getVariable(PlayerDataProps.EXP)
        this._startPlayTime = player.getVariable(PlayerDataProps.START_PLAY_TIME)
        this._onlineTime = player.getVariable(PlayerDataProps.ONLINE_TIME)
        this._playAsGuest = player.getVariable(PlayerDataProps.PLAY_AS_GUEST)
        this._nameColor = player.getVariable(PlayerDataProps.NAMECOLOR)
        this._onEvent = player.getVariable(PlayerDataProps.ON_EVENT)
        this._onArena = player.getVariable(PlayerDataProps.ON_ARENA)
        this._savedOnEvents = player.getVariable(PlayerDataProps.SAVED_ON_EVENTS)
        this._id = player.id
        this._databaseId = player.getVariable(PlayerDataProps.DATABASE_ID)
        this._items = player.getVariable(PlayerDataProps.ITEMS)
    }

    public toJSON() {
        const obj: any = {}
        obj[PlayerDataProps.RANK] = this._rank
        obj[PlayerDataProps.RANK_NAME] = this._rankName
        obj[PlayerDataProps.KILLS] = this._kills
        obj[PlayerDataProps.DEATHS] = this._deaths
        obj[PlayerDataProps.STATUS] = this._status
        obj[PlayerDataProps.PING] = this._ping
        obj[PlayerDataProps.NAME] = this._name
        obj[PlayerDataProps.MONEY] = this._money
        obj[PlayerDataProps.LEVEL] = this._level
        obj[PlayerDataProps.EXP] = this._exp
        obj[PlayerDataProps.START_PLAY_TIME] = this._startPlayTime
        obj[PlayerDataProps.ONLINE_TIME] = this._onlineTime
        obj[PlayerDataProps.DIAMONDS] = this._diamonds
        obj[PlayerDataProps.ID] = this._id
        obj[PlayerDataProps.ISLOGGED] = this._isLogged
        obj[PlayerDataProps.PLAY_AS_GUEST] = this._playAsGuest
        obj[PlayerDataProps.SAVED_ON_EVENTS] = this._savedOnEvents
        obj[PlayerDataProps.ON_EVENT] = this._onEvent
        obj[PlayerDataProps.ON_ARENA] = this._onArena
        obj[PlayerDataProps.NAMECOLOR] = this._nameColor
        obj[PlayerDataProps.ITEMS] = this._items
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
