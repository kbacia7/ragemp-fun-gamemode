import { ActivePlayers } from "core/ActivePlayers/ActivePlayers"
import { PlayerEmailValidatorFactory } from "core/DataValidator/PlayerEmail/PlayerEmailValidatorFactory"
import { PlayerLoginValidatorFactory } from "core/DataValidator/PlayerLogin/PlayerLoginValidatorFactory"
import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"
import { PlayerDataFactory } from "core/PlayerDataProps/PlayerDataFactory"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import { RegExpFactory } from "core/RegExpFactory/RegExpFactory"
import _ from "lodash"
import config from "./config.json"
import { APIManager } from "./core/API/APIManager"
import { IAPISetting } from "./core/API/IAPISetting"
import { BlipFactory } from "./core/BlipFactory/BlipFactory"
import { CheckpointFactory } from "./core/Checkpoint/CheckpointFactory"
import { NotificationSender } from "./core/NotificationSender/NotificationSender"
import { NotificationSenderFactory } from "./core/NotificationSender/NotificationSenderFactory"
import { PlayerHashPasswordFactory } from "./core/PlayerHashPassword/PlayerHashPasswordFactory"
import { Vector3Factory } from "./core/Vector3Factory/Vector3Factory"
import { VehicleFactory } from "./core/VehicleFactory/VehicleFactory"
import { ArenaDataFactory } from "./modules/Arenas/ArenaDataFactory"
import { ArenaManager } from "./modules/Arenas/ArenaManager"
import { DeathmatchArenaFactory } from "./modules/Arenas/Arenas/DM/DeathmatchArenaFactory"
import { HeavyDeathmatchArenaFactory } from "./modules/Arenas/Arenas/HeavyDM/HeavyDeathmatchArenaFactory"
import { OneShootOneDieArenaFactory } from "./modules/Arenas/Arenas/OneShoot/OneShootOneDieArenaFactory"
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
import { RaceArena } from "./entity/RaceArena"
import { TeamDeathmatchArena } from "./entity/TeamDeathmatchArena"
import { DerbyArena } from "./entity/DerbyArena"
import { HideAndSeekArena } from "./entity/HideAndSeekArena"
import { DMArena } from "./entity/DMArena"
import { HeavyDMArena } from "./entity/HeavyDMArena"
import { SniperArena } from "./entity/SniperArena"
import { OneShootArena } from "./entity/OneShootArena"
import { Player } from "./entity/Player"
import { Setting } from "./entity/Setting"
import { PlayerSpawn } from "./entity/PlayerSpawn"

declare const _VERSION_: any
console.log(`Script version: ${_VERSION_}`)

const apiSetting: IAPISetting = config
const playerPromiseFactory = new PromiseFactory<Player>()
const playerApiManager = new APIManager<Player>(playerPromiseFactory, apiSetting)
const playerDataFactory = new PlayerDataFactory()
const notificationSenderFactory = new NotificationSenderFactory()
const playerDataLoader = new PlayerDataLoader(playerDataFactory)
const activePlayers: ActivePlayers = new ActivePlayers(playerDataFactory)
const playerLoader: PlayerLoader = new PlayerLoader(playerApiManager, playerDataFactory)
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

const playerSpawnPromiseFactory = new PromiseFactory<PlayerSpawn>()
const playerSpawnApiManager = new APIManager<PlayerSpawn>(playerSpawnPromiseFactory, apiSetting)
const playerSpawnManager: PlayerSpawnManager = new PlayerSpawnManager(
   playerSpawnApiManager, vector3Factory, playerDataFactory
)

const playerHashPasswordFactory = new PlayerHashPasswordFactory()
const playerRegister: PlayerRegister = new PlayerRegister(
   playerApiManager, promiseBooleanFactory, playerEmailValidatorFactory, playerLoginValidatorFactory,
   playerHashPasswordFactory,
)
const playerLogin: PlayerLogin = new PlayerLogin(
   playerApiManager, playerLoginValidatorFactory, playerHashPasswordFactory,
)
const playerPlayAsGuest: PlayerPlayAsGuest = new PlayerPlayAsGuest(
   playerApiManager, playerLoginValidatorFactory,
)
const playerSave: PlayerSave = new PlayerSave(
   playerApiManager, playerDataFactory,
)
const allCommands: ICommand[] = [
   new HpCommand(),
   new PlayersCommand(),
   new SetCommand(playerDataFactory),
]
const racePromiseFactory = new PromiseFactory<RaceArena>()
const raceApiManager = new APIManager<RaceArena>(racePromiseFactory, apiSetting)

const commandExecutor = new CommandExecutor(playerDataFactory)
const raceAutomaticEventFactory = new RaceAutomaticEventFactory(
   raceApiManager, vehicleFactory, vector3Factory, checkpointFactory, blipFactory,
   notificationSenderFactory, playerDataFactory, raceDataFactory,
)

const tdmPromiseFactory = new PromiseFactory<TeamDeathmatchArena>()
const tdmApiManager = new APIManager<TeamDeathmatchArena>(tdmPromiseFactory, apiSetting)
const tdmAutomaticEventFactory = new TeamDeathmatchAutomaticEventFactory(
   tdmApiManager, vector3Factory, blipFactory,
   notificationSenderFactory, playerDataFactory,
)

const derbyPromiseFactory = new PromiseFactory<DerbyArena>()
const derbyApiManager = new APIManager<DerbyArena>(derbyPromiseFactory, apiSetting)
const derbyAutomaticEventFactory = new DerbyAutomaticEventFactory(
   derbyApiManager, vehicleFactory, vector3Factory, notificationSenderFactory, playerDataFactory,
)

const hideAndSeekPromiseFactory = new PromiseFactory<HideAndSeekArena>()
const hideAndSeekApiManager = new APIManager<HideAndSeekArena>(hideAndSeekPromiseFactory, apiSetting)
const hideAndSeekAutomaticEventFactory = new HideAndSeekAutomaticEventFactory(
   hideAndSeekApiManager, vector3Factory, notificationSenderFactory, playerDataFactory,
)

const deathmatchPromiseFactory = new PromiseFactory<DMArena>()
const deathmatchApiManager = new APIManager<DMArena>(deathmatchPromiseFactory, apiSetting)
const deathmatchArenaFactory = new DeathmatchArenaFactory(
   deathmatchApiManager, vector3Factory, notificationSenderFactory, playerDataFactory,
)

const heavyDMPromiseFactory = new PromiseFactory<HeavyDMArena>()
const heavyDMApiManager = new APIManager<HeavyDMArena>(heavyDMPromiseFactory, apiSetting)
const heavyDeathmatchArenaFactory = new HeavyDeathmatchArenaFactory(
   heavyDMApiManager, vector3Factory, notificationSenderFactory, playerDataFactory,
)

const sniperPromiseFactory = new PromiseFactory<SniperArena>()
const sniperApiManager = new APIManager<SniperArena>(sniperPromiseFactory, apiSetting)
const sniperArenaFactory = new SniperArenaFactory(
   sniperApiManager, vector3Factory, notificationSenderFactory, playerDataFactory,
)

const oneShootPromiseFactory = new PromiseFactory<OneShootArena>()
const oneShootApiManager = new APIManager<OneShootArena>(oneShootPromiseFactory, apiSetting)
const oneShootArenaFactory = new OneShootOneDieArenaFactory(
   oneShootApiManager, vector3Factory, notificationSenderFactory, playerDataFactory,
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
   oneshoot: ArenaType.ONESHOOT,
   sniper: ArenaType.SNIPER,
}

const settingPromiseFactory = new PromiseFactory<Setting>()
const settingApiManager = new APIManager<Setting>(settingPromiseFactory, apiSetting)

const arenaManager = new ArenaManager(
   settingApiManager, notificationSenderFactory,
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
   settingApiManager, notificationSenderFactory,
   ["tdm", "hideandseek", "race", "derby"],
   playerDataFactory, automaticEventDataFactory, mappedEventsToTypes, mappedEventsToFactories,
)
commandExecutor.addCommands(allCommands)

mp.events.add("debug", (player: PlayerMp, text: string) => {
   console.log(text)
})
