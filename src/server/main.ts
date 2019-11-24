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
import { BlipFactory } from "./core/BlipFactory/BlipFactory"
import { CheckpointFactory } from "./core/Checkpoint/CheckpointFactory"
import { NotificationSender } from "./core/NotificationSender/NotificationSender"
import { NotificationSenderFactory } from "./core/NotificationSender/NotificationSenderFactory"
import { PlayerHashPasswordFactory } from "./core/PlayerHashPassword/PlayerHashPasswordFactory"
import { Vector3Factory } from "./core/Vector3Factory/Vector3Factory"
import { VehicleFactory } from "./core/VehicleFactory/VehicleFactory"
import { Player } from "./entity/Player"
import { Setting } from "./entity/Setting"
import { ArenaDataFactory } from "./modules/Arenas/ArenaDataFactory"
import { ArenaManager } from "./modules/Arenas/ArenaManager"
import { DeathmatchArenaFactory } from "./modules/Arenas/Arenas/DM/DeathmatchArenaFactory"
import { HeavyDeathmatchArenaFactory } from "./modules/Arenas/Arenas/HeavyDM/HeavyDeathmatchArenaFactory"
import { SniperArenaFactory } from "./modules/Arenas/Arenas/Sniper/SniperArenaFactory"
import { ArenaType } from "./modules/Arenas/ArenaType"
import { AutomaticEventDataFactory } from "./modules/AutomaticEvents/AutomaticEventDataFactory"
import { AutomaticEventManager } from "./modules/AutomaticEvents/AutomaticEventManager"
import { AutomaticEventType } from "./modules/AutomaticEvents/AutomaticEventType"
import { DerbyAutomaticEventFactory } from "./modules/AutomaticEvents/Events/Derby/DerbyAutomaticEventFactory"
import { HideAndSeekAutomaticEventFactory } from "./modules/AutomaticEvents/Events/HideAndSeek/HideAndSeekAutomaticEventFactory"
import { RaceAutomaticEventFactory } from "./modules/AutomaticEvents/Events/Race/RaceAutomaticEventFactory"
import { RaceDataFactory } from "./modules/AutomaticEvents/Events/Race/RaceDataFactory"
import {
   TeamDeathmatchAutomaticEventFactory,
} from "./modules/AutomaticEvents/Events/TDM/TeamDeathmatchAutomaticEventFactory"
import { IAutomaticEventData } from "./modules/AutomaticEvents/IAutomaticEventData"
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
import { PlayerSpawnManager } from "./modules/PlayerSpawnManager/PlayerSpawnManager"
import { OneShootOneDieArenaFactory } from "./modules/Arenas/Arenas/OneShoot/OneShootOneDieArenaFactory"

const knex = Knex({
   client: dbConfig.development.client,
   connection: dbConfig.development.connection,
   debug: true,
})
declare const _VERSION_: any
console.log(`Script version: ${_VERSION_}`)

knex.raw("SELECT 1").then(() => {
   console.log("Connected to database")
}).catch((err) => {
   console.log("Can't connect to database!")
   console.log(err)
})
Model.knex(knex)

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
const automaticEventDataFactory = new AutomaticEventDataFactory()
const arenaDataFactory = new ArenaDataFactory()
const vehicleFactory = new VehicleFactory()
const checkpointFactory = new CheckpointFactory()
const blipFactory = new BlipFactory()
const vector3Factory = new Vector3Factory()
const raceDataFactory = new RaceDataFactory()
const playerSpawnManager: PlayerSpawnManager = new PlayerSpawnManager(knex, vector3Factory, playerDataFactory)

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
const raceAutomaticEventFactory = new RaceAutomaticEventFactory(
   vehicleFactory, vector3Factory, checkpointFactory, blipFactory,
   notificationSenderFactory, playerDataFactory, raceDataFactory,
)
const tdmAutomaticEventFactory = new TeamDeathmatchAutomaticEventFactory(
   vector3Factory, blipFactory,
   notificationSenderFactory, playerDataFactory,
)

const derbyAutomaticEventFactory = new DerbyAutomaticEventFactory(
   vehicleFactory, vector3Factory, notificationSenderFactory, playerDataFactory,
)

const hideAndSeekAutomaticEventFactory = new HideAndSeekAutomaticEventFactory(
   vector3Factory, notificationSenderFactory, playerDataFactory,
)

const deathmatchArenaFactory = new DeathmatchArenaFactory(
   vector3Factory, notificationSenderFactory, playerDataFactory,
)

const heavyDeathmatchArenaFactory = new HeavyDeathmatchArenaFactory(
   vector3Factory, notificationSenderFactory, playerDataFactory,
)

const sniperArenaFactory = new SniperArenaFactory(
   vector3Factory, notificationSenderFactory, playerDataFactory,
)

const oneShootArenaFactory = new OneShootOneDieArenaFactory(
   vector3Factory, notificationSenderFactory, playerDataFactory,
)

const mappedArenasToFactories = {
   dm: deathmatchArenaFactory,
   heavydm: heavyDeathmatchArenaFactory,
   oneshoot: oneShootArenaFactory,
   sniper: sniperArenaFactory,

}
const mappedArenasToTypes = {
   dm: ArenaType.DM,
   heavydm: ArenaType.HEAVYDM,
   oneshoot:ArenaType.ONESHOOT,
   sniper: ArenaType.SNIPER,
}

const arenaManager = new ArenaManager(
   knex, notificationSenderFactory,
   ["dm", "heavydm", "sniper", "oneshoot"],
   playerDataFactory, arenaDataFactory, mappedArenasToTypes,
   mappedArenasToFactories,
)

const mappedEventsToFactories = {
   derby: derbyAutomaticEventFactory,
   hideandseek: hideAndSeekAutomaticEventFactory,
   race: raceAutomaticEventFactory,
   tdm: tdmAutomaticEventFactory,
}
const mappedEventsToTypes = {
   derby: AutomaticEventType.DERBY,
   hideandseek: AutomaticEventType.HIDEANDSEEK,
   race: AutomaticEventType.RACE,
   tdm: AutomaticEventType.TDM,
}

const automaticEventManager = new AutomaticEventManager(
   knex, notificationSenderFactory,
   ["tdm", "hideandseek", "race", "derby"],
   playerDataFactory, automaticEventDataFactory, mappedEventsToTypes, mappedEventsToFactories,
)
commandExecutor.addCommands(allCommands)

mp.events.add("debug", (player: PlayerMp, text: string) => {
   console.log(text)
})
