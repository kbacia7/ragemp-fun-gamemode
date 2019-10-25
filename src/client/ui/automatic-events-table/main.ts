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
import {
    AutomaticEventsTableModuleEvents,
} from "client/modules/AutomaticEventsTableModule/AutomaticEventsTableModuleEvents"
import { IAutomaticEventData } from "server/modules/AutomaticEvents/IAutomaticEventData"

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
_global.setEventsInTable = (automaticEventsDatasStr: string) => {
    const automaticEventsDatas: IAutomaticEventData[] = JSON.parse(automaticEventsDatasStr)
    automaticEventsDatas.forEach((automaticEventData: IAutomaticEventData) => {
        const el: JQuery<HTMLElement> = $("#automatic-events-table-sample-row").clone()
        el.get(0).setAttribute("id", `automatic-events-table-${automaticEventData.name}-row`)
        el.find(".automatic-events-table-row-title").text(
            `${automaticEventData.displayName} (${automaticEventData.actualPlayers}/${automaticEventData.maxPlayers})`,
        )
        el.find(".automatic-events-table-row-save-button").on("click", () => {
            mp.trigger(AutomaticEventsTableModuleEvents.PLAYER_SAVE_ON_EVENT, automaticEventData.name)
        })
        el.removeClass("d-none")
        el.prependTo("#automatic-events-table-main")
    })
}

_global.updateRow = (eventName: string, automaticEventDataStr: string) => {
    const automaticEventData: IAutomaticEventData = JSON.parse(automaticEventDataStr)
    $(`#automatic-events-table-${eventName}-row`).find(".automatic-events-table-row-title").text(
        `${automaticEventData.displayName} (${automaticEventData.actualPlayers}/${automaticEventData.maxPlayers})`,
    )
}
