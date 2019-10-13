import { ActivePlayers } from "core/ActivePlayers/ActivePlayers"
import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"
import { PlayerDataFactory } from "core/PlayerDataProps/PlayerDataFactory"
import _ from "lodash"
import { PlayerLoader } from "./modules/PlayerLoader/PlayerLoader"
mp.events.add("debug", (player: PlayerMp, text: string) => {
   /*tslint:disable:no-console*/
   console.log(text)
})

const playerDataFactory = new PlayerDataFactory()
const activePlayers: ActivePlayers = new ActivePlayers(playerDataFactory)
const playerLoader: PlayerLoader = new PlayerLoader(playerDataFactory)

mp.events.addCommand("hp", (player: PlayerMp) => {
   player.health = 100
})

mp.events.addCommand("armor", (player: PlayerMp) => {
   player.armour = 100
})
