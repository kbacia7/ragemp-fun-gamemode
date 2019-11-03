import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"
/*tslint:disable:ordered-imports*/
import $ from "jquery"
import "bootstrap"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import "./style.less"
import { NotificationType } from "core/Notification/NotificationType"
import { NotificationTimeout } from "core/Notification/NotificationTimeout"
import { vsprintf } from "sprintf-js"

const promiseFactory = new PromiseFactory<string>()
const xmlFileRequest = new XMLFileRequest(promiseFactory)
const internationalizationSettings = new InternationalizationSettings("pl_PL")
const i18nTranslator = new I18nTranslate(internationalizationSettings, xmlFileRequest)
$(document).ready(() => {
    i18nTranslator.loadTranslations("translations")
})

const _global: any = (window || global) as any
_global.sendNotification = (i18nLabel: string, type: NotificationType, timeout: NotificationTimeout, args: string) => {
    let arrayOfArgs: string[] = []
    if (args.length > 2) {
        arrayOfArgs = JSON.parse(args)
    }
    const notificationElement: JQuery<HTMLElement> = $("#notification-alert-sample").clone()
    const randomId: string = makeId(32)
    let translatedLabel: string = i18nTranslator.translate(i18nLabel)
    if (arrayOfArgs.length > 0)  {
        translatedLabel = vsprintf(translatedLabel, arrayOfArgs)
    }

    notificationElement.attr("id", `notification-${randomId}`)
    notificationElement.addClass(`alert-${type}`)
    notificationElement.text(translatedLabel)
    notificationElement.removeClass("d-none")
    notificationElement.appendTo("body")
    setTimeout(() => {
        notificationElement.alert("close")
    }, timeout)

}

const makeId = (length) => {
    let result           = ""
    const characters       = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
 }
