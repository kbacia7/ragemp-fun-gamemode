import { ActivePlayers } from "core/ActivePlayers/ActivePlayers"
import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"
import { PlayerDataFactory } from "core/PlayerDataProps/PlayerDataFactory"
import Knex from "knex"
import _ from "lodash"
import dbConfig from "./knexfile"

import { NotificationSender } from "./core/NotificationSender/NotificationSender"
import { Chat } from "./modules/Chat/Chat"
import { CommandExecutor } from "./modules/Commands/CommandExecutor"
import { HpCommand } from "./modules/Commands/HpCommand/HpCommand"
import { ICommand } from "./modules/Commands/ICommand"
import { PlayersCommand } from "./modules/Commands/PlayersCommand/PlayersCommand"
import { SetCommand } from "./modules/Commands/SetCommand/SetCommand"
import { PlayerLoader } from "./modules/PlayerLoader/PlayerLoader"
const playerDataFactory = new PlayerDataFactory()
const notificationSender = new NotificationSender()
const activePlayers: ActivePlayers = new ActivePlayers(playerDataFactory)
const playerLoader: PlayerLoader = new PlayerLoader(playerDataFactory)
const chat: Chat = new Chat(notificationSender)
const commandExecutor = new CommandExecutor()

const knex = Knex({
   client: dbConfig.development.client,
   connection: dbConfig.development.connection,
})

const allCommands: ICommand[] = [
   new HpCommand(),
   new PlayersCommand(),
   new SetCommand(),
]
commandExecutor.addCommands(allCommands)

mp.events.add("debug", (player: PlayerMp, text: string) => {
   console.log(text)
})
