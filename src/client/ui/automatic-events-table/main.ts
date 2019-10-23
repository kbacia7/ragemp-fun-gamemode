import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"
/*tslint:disable:ordered-imports*/
import $ from "jquery"
import "bootstrap"
import { FileSystemRequest } from "core/FileRequest/FileSystemRequest"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import { IPlayerData } from "core/PlayerDataProps/IPlayerData"
import "./style.less"
import { ActionsMenu } from "server/core/ActionsMenu/ActionsMenu"
import { ActionsMenuModuleEvents } from "client/modules/ActionsMenuModule/ActionsMenuModuleEvents"
import { IRegisterAutomaticEventData } from "core/RegisterAutomaticEvents/IRegisterAutomaticEventData"

$(document).ready(() => {
    const promiseFactory = new PromiseFactory<string>()
    const xmlFileRequest = new XMLFileRequest(promiseFactory)
    const internationalizationSettings = new InternationalizationSettings("pl_PL")
    const i18nTranslator = new I18nTranslate(internationalizationSettings, xmlFileRequest)
    i18nTranslator.loadTranslations("translations")
    $("[data-i18n-translate]").toArray().forEach((element: HTMLElement) => {
        element.innerText = i18nTranslator.translate(element.getAttribute("data-i18n-translate"))
    })
})

const _global: any = (window || global) as any
_global.setEventsInTable = (automaticEventsDatas: string) => {
    const registeredAutomaticEventsDatas: IRegisterAutomaticEventData[] = JSON.parse(automaticEventsDatas)
    registeredAutomaticEventsDatas.forEach((automaticEventData: IRegisterAutomaticEventData) => {
        const el: JQuery<HTMLElement> = $("#automatic-events-table-sample-row").clone()
        el.find(".automatic-events-table-row-title").text(
            `${automaticEventData.name} (${automaticEventData.actualPlayers}/${automaticEventData.maxPlayers})`,
        )
        el.removeClass("d-none")
        el.prependTo("#automatic-events-table-main")
    })
}
