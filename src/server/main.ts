import { ActivePlayers } from "core/ActivePlayers/ActivePlayers"
import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"
import { PlayerDataFactory } from "core/PlayerDataProps/PlayerDataFactory"
import Knex from "knex"
import _ from "lodash"
import dbConfig from "./knexfile"

import { PlayerLoader } from "./modules/PlayerLoader/PlayerLoader"
const playerDataFactory = new PlayerDataFactory()
const activePlayers: ActivePlayers = new ActivePlayers(playerDataFactory)
const playerLoader: PlayerLoader = new PlayerLoader(playerDataFactory)

const knex = Knex({
   client: dbConfig.development.client,
   connection: dbConfig.development.connection,
})

mp.events.addCommand("hp", (player: PlayerMp) => {
   player.health = 100
})

mp.events.addCommand("armor", (player: PlayerMp) => {
   player.armour = 100
})

mp.events.add("debug", (player: PlayerMp, text: string) => {
   console.log(text)
})
