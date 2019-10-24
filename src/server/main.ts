import { ActivePlayers } from "core/ActivePlayers/ActivePlayers"
import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"

import Knex from "knex"
import _ from "lodash"
import dbConfig from "./knexfile"

import { PlayerEmailValidatorFactory } from "core/DataValidator/PlayerEmail/PlayerEmailValidatorFactory"
import { PlayerLoginValidatorFactory } from "core/DataValidator/PlayerLogin/PlayerLoginValidatorFactory"
import { PlayerDataFactory } from "core/PlayerDataProps/PlayerDataFactory"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import { RegExpFactory } from "core/RegExpFactory/RegExpFactory"
import { Model } from "objection"
import { NotificationSender } from "./core/NotificationSender/NotificationSender"
import { NotificationSenderFactory } from "./core/NotificationSender/NotificationSenderFactory"
import { PlayerHashPasswordFactory } from "./core/PlayerHashPassword/PlayerHashPasswordFactory"
import { Player } from "./entity/Player"
import { Setting } from "./entity/Setting"
import { AutomaticEvent } from "./modules/AutomaticEvents/AutomaticEvent"
import { AutomaticEventManager } from "./modules/AutomaticEvents/AutomaticEventManager"
import { AutomaticEventType } from "./modules/AutomaticEvents/AutomaticEventType"
import { Chat } from "./modules/Chat/Chat"
import { CommandExecutor } from "./modules/Commands/CommandExecutor"
import { HpCommand } from "./modules/Commands/HpCommand/HpCommand"
import { ICommand } from "./modules/Commands/ICommand"
import { PlayersCommand } from "./modules/Commands/PlayersCommand/PlayersCommand"
import { SetCommand } from "./modules/Commands/SetCommand/SetCommand"
import { PlayerDataLoader } from "./modules/PlayerDataLoader/PlayerDataLoader"
import { PlayerLoader } from "./modules/PlayerLoader/PlayerLoader"
import { PlayerLogin } from "./modules/PlayerRegister/PlayerLogin"
import { PlayerPlayAsGuest } from "./modules/PlayerRegister/PlayerPlayAsGuest"
import { PlayerRegister } from "./modules/PlayerRegister/PlayerRegister"
import { PlayerSave } from "./modules/PlayerSave/PlayerSave"

const knex = Knex({
   client: dbConfig.development.client,
   connection: dbConfig.development.connection,
})

// FIXME: Nie usuwać tego, bez tego Objection.js nie działa. Nie mam pojęcia czemu <shrug face here>
knex.select().table("players").then(() => {
   console.log("")
})
knex.select().table("settings").then(() => {
   console.log("")
})

Model.knex(knex)
Player.knex(knex)
Setting.knex(knex)

const playerDataFactory = new PlayerDataFactory()
const notificationSenderFactory = new NotificationSenderFactory()
const playerDataLoader = new PlayerDataLoader(playerDataFactory)
const activePlayers: ActivePlayers = new ActivePlayers(playerDataFactory)
const playerLoader: PlayerLoader = new PlayerLoader(knex, playerDataFactory)
const chat: Chat = new Chat(playerDataFactory, notificationSenderFactory)
const promiseBooleanFactory: PromiseFactory<boolean> = new PromiseFactory<boolean>()
const regExpFactory = new RegExpFactory()
const playerEmailValidatorFactory = new PlayerEmailValidatorFactory(regExpFactory)
const playerLoginValidatorFactory = new PlayerLoginValidatorFactory(regExpFactory)
const playerHashPasswordFactory = new PlayerHashPasswordFactory()
const playerRegister: PlayerRegister = new PlayerRegister(
   knex, promiseBooleanFactory, playerEmailValidatorFactory, playerLoginValidatorFactory,
   playerHashPasswordFactory,
)
const playerLogin: PlayerLogin = new PlayerLogin(
   knex, playerLoginValidatorFactory, playerHashPasswordFactory,
)
const playerPlayAsGuest: PlayerPlayAsGuest = new PlayerPlayAsGuest(
   knex, playerLoginValidatorFactory,
)
const playerSave: PlayerSave = new PlayerSave(
   knex, playerDataFactory,
)
const allCommands: ICommand[] = [
   new HpCommand(),
   new PlayersCommand(),
   new SetCommand(playerDataFactory),
]
const commandExecutor = new CommandExecutor(playerDataFactory)

// TODO: Usunąć to trzeba wraz z dodawaniem kolejnych eventów
const tmpRaceAutomaticEvent = new AutomaticEvent()
tmpRaceAutomaticEvent.name = "race"
tmpRaceAutomaticEvent.displayName = "Race"
tmpRaceAutomaticEvent.actualPlayers = 0
tmpRaceAutomaticEvent.maxPlayers = 0
tmpRaceAutomaticEvent.minPlayers = 1
tmpRaceAutomaticEvent.type = AutomaticEventType.RACE

const tmpTdmAutomaticEvent = new AutomaticEvent()
tmpTdmAutomaticEvent.name = "tdm"
tmpTdmAutomaticEvent.displayName = "TDM"
tmpTdmAutomaticEvent.actualPlayers = 0
tmpTdmAutomaticEvent.maxPlayers = 0
tmpTdmAutomaticEvent.minPlayers = 1
tmpTdmAutomaticEvent.type = AutomaticEventType.TDM

const tmpDerbyAutomaticEvent = new AutomaticEvent()
tmpDerbyAutomaticEvent.name = "derby"
tmpDerbyAutomaticEvent.displayName = "Derby"
tmpDerbyAutomaticEvent.actualPlayers = 0
tmpDerbyAutomaticEvent.maxPlayers = 0
tmpDerbyAutomaticEvent.minPlayers = 1
tmpDerbyAutomaticEvent.type = AutomaticEventType.DERBY

const tmpHideAndSeekAutomaticEvent = new AutomaticEvent()
tmpHideAndSeekAutomaticEvent.name = "hideandseek"
tmpHideAndSeekAutomaticEvent.displayName = "Hide&Seek"
tmpHideAndSeekAutomaticEvent.actualPlayers = 0
tmpHideAndSeekAutomaticEvent.maxPlayers = 0
tmpHideAndSeekAutomaticEvent.minPlayers = 1
tmpHideAndSeekAutomaticEvent.type = AutomaticEventType.HIDEANDSEEK

const automaticEventManager = new AutomaticEventManager(
   knex, notificationSenderFactory,
   {
      "tdm": tmpTdmAutomaticEvent,
      // tslint:disable-next-line: object-literal-sort-keys
      "race": tmpRaceAutomaticEvent,
      "derby": tmpDerbyAutomaticEvent,
      "hide&seek": tmpHideAndSeekAutomaticEvent,
   }, playerDataFactory,
)
commandExecutor.addCommands(allCommands)

mp.events.add("debug", (player: PlayerMp, text: string) => {
   console.log(text)
})
