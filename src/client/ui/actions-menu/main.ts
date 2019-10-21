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

$(document).ready(() => {
    const promiseFactory = new PromiseFactory<string>()
    const xmlFileRequest = new XMLFileRequest(promiseFactory)
    const internationalizationSettings = new InternationalizationSettings("pl_PL")
    const i18nTranslator = new I18nTranslate(internationalizationSettings, xmlFileRequest)
    i18nTranslator.loadTranslations("translations")
    $("[data-i18n-translate]").toArray().forEach((element: HTMLElement) => {
        element.innerText = i18nTranslator.translate(element.getAttribute("data-i18n-translate"))
    })
    $(".btn-group, .dropdown").hover(
        () => {
            $(">.dropdown-menu", this).stop(true, true).fadeIn("fast")
            $(this).addClass("open")
        },
        () => {
            $(">.dropdown-menu", this).stop(true, true).fadeOut("fast")
            $(this).removeClass("open")
        },
    )
    $(".dropdown-item").on("click", (ev) => {
        const triggerEvent: string = ev.target.getAttribute("data-actions-menu-event")
        if (triggerEvent && triggerEvent.length > 0) {
            mp.trigger(ActionsMenuModuleEvents.TRIGGER_EVENT, triggerEvent)
        }
    })
    $("#modal").modal("show")
})
