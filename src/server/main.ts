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
import { IRegisterAutomaticEventDataFactory } from "core/RegisterAutomaticEvents/IRegisterAutomaticEventDataFactory"
import { RegisterAutomaticEventDataFactory } from "core/RegisterAutomaticEvents/RegisterAutomaticEventDataFactory"
import { Model } from "objection"
import { emitKeypressEvents } from "readline"
import { NotificationSender } from "./core/NotificationSender/NotificationSender"
import { PlayerHashPasswordFactory } from "./core/PlayerHashPassword/PlayerHashPasswordFactory"
import { Player } from "./entity/Player"
import { AutomaticEventsDataProvider } from "./modules/AutomaticEvents/AutomaticEventsDataProvider"
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

Model.knex(knex)
Player.knex(knex)

const playerDataFactory = new PlayerDataFactory()
const notificationSender = new NotificationSender()
const playerDataLoader = new PlayerDataLoader(playerDataFactory)
const activePlayers: ActivePlayers = new ActivePlayers(playerDataFactory)
const playerLoader: PlayerLoader = new PlayerLoader(knex, playerDataFactory)
const chat: Chat = new Chat(playerDataFactory, notificationSender)
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
const registerAutomaticEventDataFactory: IRegisterAutomaticEventDataFactory = new RegisterAutomaticEventDataFactory()
const allCommands: ICommand[] = [
   new HpCommand(),
   new PlayersCommand(),
   new SetCommand(playerDataFactory),
]
const commandExecutor = new CommandExecutor(playerDataFactory)
const automaticEventsDataProvider = new AutomaticEventsDataProvider(registerAutomaticEventDataFactory)
commandExecutor.addCommands(allCommands)

mp.events.add("debug", (player: PlayerMp, text: string) => {
   console.log(text)
})
