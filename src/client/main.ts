import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import $ from "jquery"
import { ActivePlayersLoader } from "./core/ActivePlayersLoader/ActivePlayersLoader"
import { KeyboardManager } from "./core/KeyboardManager/KeyboardManager"
import { ActivePlayersTableModuleFactory } from "./modules/ActivePlayersTableModule/ActivePlayersTableModuleFactory"
import { NotificationModule } from "./modules/Notification/NotificationModule"
const promisePlayersDataFactory: PromiseFactory<IPlayerData[]> = new PromiseFactory<IPlayerData[]>()
const promiseBooleanFactory: PromiseFactory<boolean> = new PromiseFactory<boolean>()
const activePlayersLoader: ActivePlayersLoader = new ActivePlayersLoader(promisePlayersDataFactory)
const activePlayersTableModuleFactory: ActivePlayersTableModuleFactory = new ActivePlayersTableModuleFactory(
   promiseBooleanFactory, activePlayersLoader,
)
const keyboardManager: KeyboardManager = new KeyboardManager(activePlayersTableModuleFactory)
const notificationsModule = new NotificationModule(promiseBooleanFactory)
notificationsModule.loadUI()
mp.gui.chat.colors = true
