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
    i18nTranslator.loadTranslations("/translations")
    $("[data-i18n-translate]").toArray().forEach((element: HTMLElement) => {
        element.innerText = i18nTranslator.translate(element.getAttribute("data-i18n-translate"))
    })
})

const _global: any = (window || global) as any
_global.loadPlayerData = (playerDataInJson: string) => {
    const playerData: IPlayerData = JSON.parse(playerDataInJson)
    $("#player-profile-username").text(playerData.name)
    if (playerData.name.length > 12) {
        $("#player-profile-username").css({"font-size": "1rem", "margin-top": "0.5rem"})
    }
    $("#player-profile-username").css("color", playerData.nameColor)
    $("#player-profile-rank").text(playerData.rankName)
    $("#player-profile-level").text("1")
    $("#player-profile-money").text(`${playerData.money}$`)
    $("#player-profile-diamonds").text(playerData.diamonds.toString())
    $("#player-profile-online-time").text("00:00")
    $("#player-profile-kills").text(playerData.kills.toString())
    $("#player-profile-deaths").text(playerData.deaths.toString())
    $("#player-profile-ping").text(playerData.ping.toString())
}
