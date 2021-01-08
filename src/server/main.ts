import { ActivePlayers } from "core/ActivePlayers/ActivePlayers"
import { ChatSpecialTabs } from "core/Chat/ChatSpecialTabs"
import { EmojiList } from "core/Chat/EmojiList/EmojiList"
import { HTMLEscapeCharacters } from "core/Chat/Escape/EscapeCharacters"
import { ChatMessageValidator } from "core/DataValidator/ChatMessage/ChatMessageValidator"
import { HTMLValidator } from "core/DataValidator/HTML/HTMLValidator"
import { HTMLValidatorFactory } from "core/DataValidator/HTML/HTMLValidatorFactory"
import { IHTMLValidatorFactory } from "core/DataValidator/HTML/IHTMLValidatorFactory"
import { PlayerEmailValidatorFactory } from "core/DataValidator/PlayerEmail/PlayerEmailValidatorFactory"
import { PlayerLoginValidatorFactory } from "core/DataValidator/PlayerLogin/PlayerLoginValidatorFactory"
import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"
import { PlayerDataFactory } from "core/PlayerDataProps/PlayerDataFactory"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import { RegExpFactory } from "core/RegExpFactory/RegExpFactory"
import { IncomingMessage } from "http"
import _ from "lodash"
import {  Settings } from "luxon"
import random from "random"
import config from "./config.json"
import { APIManager } from "./core/API/APIManager"
import { IAPISetting } from "./core/API/IAPISetting"
import { BlipFactory } from "./core/BlipFactory/BlipFactory"
import { CheckpointFactory } from "./core/Checkpoint/CheckpointFactory"
import { NotificationSender } from "./core/NotificationSender/NotificationSender"
import { NotificationSenderFactory } from "./core/NotificationSender/NotificationSenderFactory"
import { NotificationSenderFromClient } from "./core/NotificationSender/NotificationSenderFromClient"
import { ObjectFactory } from "./core/ObjectFactory/ObjectFactory"
import { PlayerHashPasswordFactory } from "./core/PlayerHashPassword/PlayerHashPasswordFactory"
import { Vector3Factory } from "./core/Vector3Factory/Vector3Factory"
import { VehicleFactory } from "./core/VehicleFactory/VehicleFactory"
import { DerbyArena } from "./entity/DerbyArena"
import { DMArena } from "./entity/DMArena"
import { HeavyDMArena } from "./entity/HeavyDMArena"
import { HideAndSeekArena } from "./entity/HideAndSeekArena"
import { Item } from "./entity/Item"
import { Lootbox } from "./entity/Lootbox"
import { ServerObject } from "./entity/Object"
import { OneShootArena } from "./entity/OneShootArena"
import { Player } from "./entity/Player"
import { PlayerSpawn } from "./entity/PlayerSpawn"
import { RaceArena } from "./entity/RaceArena"
import { Setting } from "./entity/Setting"
import { ShopTabData } from "./entity/ShopTabData"
import { SniperArena } from "./entity/SniperArena"
import { TeamDeathmatchArena } from "./entity/TeamDeathmatchArena"
import { Vehicle } from "./entity/Vehicle"
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
import { GlobalTabSender } from "./modules/Chat/Senders/GlobalTabSender"
import { LocalTabSender } from "./modules/Chat/Senders/LocalTabSender"
import { NotificationTabSender } from "./modules/Chat/Senders/NotificationTabSender"
import { CommandExecutor } from "./modules/Commands/CommandExecutor"
import { EqCommand } from "./modules/Commands/EqCommand/EqCommand"
import { HpCommand } from "./modules/Commands/HpCommand/HpCommand"
import { ICommand } from "./modules/Commands/ICommand"
import { PlayersCommand } from "./modules/Commands/PlayersCommand/PlayersCommand"
import { SetCommand } from "./modules/Commands/SetCommand/SetCommand"
import { ShopCommand } from "./modules/Commands/ShopCommand/ShopCommand"
import { LootboxManager } from "./modules/LootboxManager/LootboxManager"
import { ObjectsLoader } from "./modules/ObjectsLoader/ObjectsLoader"
import { PlayerDataLoader } from "./modules/PlayerDataLoader/PlayerDataLoader"
import { PlayerEquipManager } from "./modules/PlayerEquipManager/PlayerEquipManager"
import { PlayerLoader } from "./modules/PlayerLoader/PlayerLoader"
import { PlayerLogin } from "./modules/PlayerRegister/PlayerLogin"
import { PlayerPlayAsGuest } from "./modules/PlayerRegister/PlayerPlayAsGuest"
import { PlayerRegister } from "./modules/PlayerRegister/PlayerRegister"
import { PlayerSave } from "./modules/PlayerSave/PlayerSave"
import { PlayersBlips } from "./modules/PlayersBlips/PlayersBlips"
import { PlayerSpawnManager } from "./modules/PlayerSpawnManager/PlayerSpawnManager"
import { SkinItemBuyAction } from "./modules/ShopManager/BuyActions/SkinItemBuyAction"
import { SkinOnceChangeBuyAction } from "./modules/ShopManager/BuyActions/SkinOnceChangeBuyAction"
import { VehicleSpawnBuyAction } from "./modules/ShopManager/BuyActions/VehicleSpawnBuyAction"
import { WeaponItemBuyAction } from "./modules/ShopManager/BuyActions/WeaponItemBuyAction"
import { WeaponOnceSpawnBuyAction } from "./modules/ShopManager/BuyActions/WeaponOnceSpawnBuyAction"
import { IShopManager } from "./modules/ShopManager/IShopManager"
import { ShopManager } from "./modules/ShopManager/ShopManager"
import { VehiclesLoader } from "./modules/VehiclesLoader/VehiclesLoader"

declare const _VERSION_: any
console.log(`Script version: ${_VERSION_}`)

const apiSetting: IAPISetting = config
const playerPromiseFactory = new PromiseFactory<Player[]>()
const promiseForApiPosts = new PromiseFactory<IncomingMessage>()
const playerApiManager = new APIManager<Player>(playerPromiseFactory, promiseForApiPosts, apiSetting)
const playerDataFactory = new PlayerDataFactory()

const shopDataPromiseFactory = new PromiseFactory<ShopTabData[]>()
const shopDataApiManager = new APIManager<ShopTabData>(shopDataPromiseFactory, promiseForApiPosts, apiSetting)
const notificationTabSender = new NotificationTabSender()
const notificationSenderFactory = new NotificationSenderFactory(notificationTabSender)
const notificationSenderFromClient = new NotificationSenderFromClient(notificationSenderFactory)
const playerDataLoader = new PlayerDataLoader(playerDataFactory)
const activePlayers: ActivePlayers = new ActivePlayers(playerDataFactory)
const playerLoader: PlayerLoader = new PlayerLoader(playerApiManager, playerDataFactory)
const regExpFactory = new RegExpFactory()
const htmlValidator = new HTMLValidator(regExpFactory)
const chatMessageValidator = new ChatMessageValidator(regExpFactory)
const htmlEscapeCharacters = new HTMLEscapeCharacters()
const emojiList = new EmojiList(regExpFactory)
const injectedSendersForTabs = {
   [ChatSpecialTabs.GLOBAL]: new GlobalTabSender(),
   [ChatSpecialTabs.LOCAL]: new LocalTabSender(),
}
const commandExecutor = new CommandExecutor(playerDataFactory)
const chat: Chat = new Chat(
   playerDataFactory, notificationSenderFactory, htmlValidator,
   chatMessageValidator, htmlEscapeCharacters, emojiList, commandExecutor, injectedSendersForTabs,
)
const promiseBooleanFactory: PromiseFactory<boolean> = new PromiseFactory<boolean>()
const playerEmailValidatorFactory = new PlayerEmailValidatorFactory(regExpFactory)
const playerLoginValidatorFactory = new PlayerLoginValidatorFactory(regExpFactory)
const automaticEventDataFactory = new AutomaticEventDataFactory()
const arenaDataFactory = new ArenaDataFactory()
const vehicleFactory = new VehicleFactory()
const checkpointFactory = new CheckpointFactory()
const blipFactory = new BlipFactory()
const vector3Factory = new Vector3Factory()
const raceDataFactory = new RaceDataFactory()
const playerSpawnPromiseFactory = new PromiseFactory<PlayerSpawn[]>()
const playerSpawnApiManager = new APIManager<PlayerSpawn>(playerSpawnPromiseFactory, promiseForApiPosts, apiSetting)
const playerSpawnManager: PlayerSpawnManager = new PlayerSpawnManager(
   playerSpawnApiManager, vector3Factory, playerDataFactory,
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

const promiseShopTabDataFactory = new PromiseFactory<ShopTabData[]>()
const promiseForShopInitialize = new PromiseFactory<[ShopTabData, ShopTabData[]]>()
const promiseSingleShopTabDataFactory = new PromiseFactory<ShopTabData>()
const shopTabDataApiManager = new APIManager<ShopTabData>(promiseShopTabDataFactory, promiseForApiPosts, apiSetting)
const shopManager: IShopManager = new ShopManager(
   shopTabDataApiManager,
   promiseForShopInitialize,
   promiseSingleShopTabDataFactory,
   playerDataFactory,
   notificationSenderFactory,
   {
      "skins-once": new SkinOnceChangeBuyAction(),
      "skins-spawns": new SkinItemBuyAction(playerApiManager, playerDataFactory),
      "vehicles-spawn": new VehicleSpawnBuyAction(vehicleFactory),
      "weapons-once": new WeaponOnceSpawnBuyAction(),
      "weapons-spawns": new WeaponItemBuyAction(playerApiManager, playerDataFactory),
   },
)
const playerEquipManager = new PlayerEquipManager(playerApiManager, playerDataFactory)

const lootboxPromiseFactory = new PromiseFactory<Lootbox[]>()
const lootboxApiManager = new APIManager<Lootbox>(lootboxPromiseFactory, promiseForApiPosts, apiSetting)
const itemPromiseFactory = new PromiseFactory<Item[]>()
const itemApiManager = new APIManager<Item>(itemPromiseFactory, promiseForApiPosts, apiSetting)
const lootboxManager = new LootboxManager(lootboxApiManager, itemApiManager, playerDataFactory)

const allCommands: ICommand[] = [
   new HpCommand(),
   new PlayersCommand(),
   new SetCommand(playerDataFactory),
   new ShopCommand(shopDataApiManager, shopManager),
   new EqCommand(playerDataFactory),
]
const racePromiseFactory = new PromiseFactory<RaceArena[]>()
const raceApiManager = new APIManager<RaceArena>(racePromiseFactory, promiseForApiPosts, apiSetting)

const raceAutomaticEventFactory = new RaceAutomaticEventFactory(
   raceApiManager, vehicleFactory, vector3Factory, checkpointFactory, blipFactory,
   notificationSenderFactory, playerDataFactory, raceDataFactory,
)

const tdmPromiseFactory = new PromiseFactory<TeamDeathmatchArena[]>()
const tdmApiManager = new APIManager<TeamDeathmatchArena>(tdmPromiseFactory, promiseForApiPosts, apiSetting)
const tdmAutomaticEventFactory = new TeamDeathmatchAutomaticEventFactory(
   tdmApiManager, vector3Factory, blipFactory,
   notificationSenderFactory, playerDataFactory,
)

const derbyPromiseFactory = new PromiseFactory<DerbyArena[]>()
const derbyApiManager = new APIManager<DerbyArena>(derbyPromiseFactory, promiseForApiPosts, apiSetting)
const derbyAutomaticEventFactory = new DerbyAutomaticEventFactory(
   derbyApiManager, vehicleFactory, vector3Factory, notificationSenderFactory, playerDataFactory,
)

const hideAndSeekPromiseFactory = new PromiseFactory<HideAndSeekArena[]>()
const hideAndSeekApiManager = new APIManager<HideAndSeekArena>(
   hideAndSeekPromiseFactory, promiseForApiPosts, apiSetting,
)
const hideAndSeekAutomaticEventFactory = new HideAndSeekAutomaticEventFactory(
   hideAndSeekApiManager, vector3Factory, notificationSenderFactory, playerDataFactory,
)

const deathmatchPromiseFactory = new PromiseFactory<DMArena[]>()
const deathmatchApiManager = new APIManager<DMArena>(deathmatchPromiseFactory, promiseForApiPosts, apiSetting)
const deathmatchArenaFactory = new DeathmatchArenaFactory(
   deathmatchApiManager, vector3Factory, notificationSenderFactory, playerDataFactory,
)

const heavyDMPromiseFactory = new PromiseFactory<HeavyDMArena[]>()
const heavyDMApiManager = new APIManager<HeavyDMArena>(heavyDMPromiseFactory, promiseForApiPosts, apiSetting)
const heavyDeathmatchArenaFactory = new HeavyDeathmatchArenaFactory(
   heavyDMApiManager, vector3Factory, notificationSenderFactory, playerDataFactory,
)

const sniperPromiseFactory = new PromiseFactory<SniperArena[]>()
const sniperApiManager = new APIManager<SniperArena>(sniperPromiseFactory, promiseForApiPosts, apiSetting)
const sniperArenaFactory = new SniperArenaFactory(
   sniperApiManager, vector3Factory, notificationSenderFactory, playerDataFactory,
)

const oneShootPromiseFactory = new PromiseFactory<OneShootArena[]>()
const oneShootApiManager = new APIManager<OneShootArena>(oneShootPromiseFactory, promiseForApiPosts, apiSetting)
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
const settingPromiseFactory = new PromiseFactory<Setting[]>()
const settingApiManager = new APIManager<Setting>(settingPromiseFactory, promiseForApiPosts, apiSetting)
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
const serverObjectPromiseFactory = new PromiseFactory<ServerObject[]>()
const serverObjectApiManager = new APIManager<ServerObject>(serverObjectPromiseFactory, promiseForApiPosts, apiSetting)
const objectFactory = new ObjectFactory()
const objectsLoader = new ObjectsLoader(serverObjectApiManager, objectFactory, vector3Factory)

const vehiclePromiseFactory = new PromiseFactory<Vehicle[]>()
const vehicleApiManager = new APIManager<Vehicle>(vehiclePromiseFactory, promiseForApiPosts, apiSetting)
const vehicleLoader = new VehiclesLoader(vehicleApiManager, vehicleFactory, vector3Factory)

const automaticEventManager = new AutomaticEventManager(
   settingApiManager, notificationSenderFactory,
   ["tdm", "hideandseek", "race", "derby"],
   playerDataFactory, automaticEventDataFactory, mappedEventsToTypes, mappedEventsToFactories,
)
const playersBlips = new PlayersBlips(blipFactory, vector3Factory)
commandExecutor.addCommands(allCommands)

mp.events.add("debug", (player: PlayerMp, text: string) => {
   console.log(text)
})
