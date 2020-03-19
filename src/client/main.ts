import { HTMLEscapeCharacters } from "core/Chat/Escape/EscapeCharacters"
import { ChatMessageValidator } from "core/DataValidator/ChatMessage/ChatMessageValidator"
import { HTMLValidator } from "core/DataValidator/HTML/HTMLValidator"
import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import { RegExpFactory } from "core/RegExpFactory/RegExpFactory"
import $ from "jquery"
import { ActivePlayersLoader } from "./core/ActivePlayersLoader/ActivePlayersLoader"
import { KeyboardManager } from "./core/KeyboardManager/KeyboardManager"
import { ActionsMenuModuleFactory } from "./modules/ActionsMenuModule/ActionsMenuModuleFactory"
import { IActionsMenuModuleFactory } from "./modules/ActionsMenuModule/IActionsMenuModuleFactory"
import { ActivePlayersTableModuleFactory } from "./modules/ActivePlayersTableModule/ActivePlayersTableModuleFactory"
import { AutomaticEventsTableModule } from "./modules/AutomaticEventsTableModule/AutomaticEventsTableModule"
import { ChangePlayerPedModule } from "./modules/ChangePlayerPedModule/ChangePlayerPedModule"
import { ChatModule } from "./modules/Chat/ChatModule"
import { CommandListenerModule } from "./modules/CommandListener/CommandListenerModule"
import { FreezePlayerModule } from "./modules/FreezePlayerModule/FreezePlayerModule"
import { NotificationModule } from "./modules/Notification/NotificationModule"
import { PlayerProfileModule } from "./modules/PlayerProfileModule/PlayerProfileModule"
import { PlayerRegisterAndLoginModule } from "./modules/PlayerRegisterAndLoginModule/PlayerRegisterAndLoginModule"

const promisePlayersDataFactory: PromiseFactory<IPlayerData[]> = new PromiseFactory<IPlayerData[]>()
const promiseBooleanFactory: PromiseFactory<boolean> = new PromiseFactory<boolean>()
const activePlayersLoader: ActivePlayersLoader = new ActivePlayersLoader(promisePlayersDataFactory)
const activePlayersTableModuleFactory: ActivePlayersTableModuleFactory = new ActivePlayersTableModuleFactory(
   promiseBooleanFactory, activePlayersLoader,
)
const actionsMenuModuleFactory: IActionsMenuModuleFactory = new ActionsMenuModuleFactory(promiseBooleanFactory)
const notificationsModule = new NotificationModule(promiseBooleanFactory)
const playerProfileModule: PlayerProfileModule = new PlayerProfileModule(promiseBooleanFactory)
const automaticEventsTableModule: AutomaticEventsTableModule = new AutomaticEventsTableModule(promiseBooleanFactory)
const playerRegisterAndLoginModule = new PlayerRegisterAndLoginModule(promiseBooleanFactory)
const freezePlayerModule = new FreezePlayerModule(promiseBooleanFactory)
const changePlayerPedModule = new ChangePlayerPedModule(promiseBooleanFactory)
const regexpFactory = new RegExpFactory()
const htmlValidator = new HTMLValidator(regexpFactory)
const chatMessageValidator = new ChatMessageValidator(regexpFactory)
const commandListenerModule = new CommandListenerModule(promiseBooleanFactory, activePlayersTableModuleFactory)
const htmlEscapeCharacters = new HTMLEscapeCharacters()
const chatModule = new ChatModule(promiseBooleanFactory, htmlValidator, chatMessageValidator, htmlEscapeCharacters)
const keyboardManager: KeyboardManager = new KeyboardManager(
   activePlayersTableModuleFactory, actionsMenuModuleFactory, chatModule,
)
notificationsModule.loadUI()
mp.gui.chat.show(false)
