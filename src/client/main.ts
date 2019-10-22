import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import $ from "jquery"
import { ActivePlayersLoader } from "./core/ActivePlayersLoader/ActivePlayersLoader"
import { KeyboardManager } from "./core/KeyboardManager/KeyboardManager"
import { ActionsMenuModuleFactory } from "./modules/ActionsMenuModule/ActionsMenuModuleFactory"
import { IActionsMenuModuleFactory } from "./modules/ActionsMenuModule/IActionsMenuModuleFactory"
import { ActivePlayersTableModuleFactory } from "./modules/ActivePlayersTableModule/ActivePlayersTableModuleFactory"
import { CommandListenerModule } from "./modules/CommandListener/CommandListenerModule"
import { NotificationModule } from "./modules/Notification/NotificationModule"
import { IPlayerProfileModuleFactory } from "./modules/PlayerProfileModule/IPlayerProfileModuleFactory"
import { PlayerProfileModule } from "./modules/PlayerProfileModule/PlayerProfileModule"
import { PlayerProfileModuleFactory } from "./modules/PlayerProfileModule/PlayerProfileModuleFactory"
import { PlayerRegisterAndLoginModule } from "./modules/PlayerRegisterAndLoginModule/PlayerRegisterAndLoginModule"
const promisePlayersDataFactory: PromiseFactory<IPlayerData[]> = new PromiseFactory<IPlayerData[]>()
const promiseBooleanFactory: PromiseFactory<boolean> = new PromiseFactory<boolean>()
const activePlayersLoader: ActivePlayersLoader = new ActivePlayersLoader(promisePlayersDataFactory)
const activePlayersTableModuleFactory: ActivePlayersTableModuleFactory = new ActivePlayersTableModuleFactory(
   promiseBooleanFactory, activePlayersLoader,
)
const actionsMenuModuleFactory: IActionsMenuModuleFactory = new ActionsMenuModuleFactory(promiseBooleanFactory)
const keyboardManager: KeyboardManager = new KeyboardManager(activePlayersTableModuleFactory, actionsMenuModuleFactory)
const notificationsModule = new NotificationModule(promiseBooleanFactory)
const playerProfileModule: PlayerProfileModule = new PlayerProfileModule(promiseBooleanFactory)
const playerRegisterAndLoginModule = new PlayerRegisterAndLoginModule(promiseBooleanFactory)
const commandListenerModule = new CommandListenerModule(promiseBooleanFactory, activePlayersTableModuleFactory)
notificationsModule.loadUI()
mp.gui.chat.colors = true
