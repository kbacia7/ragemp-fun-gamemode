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
const promiseFactory = new PromiseFactory<string>()
const xmlFileRequest = new XMLFileRequest(promiseFactory)
const internationalizationSettings = new InternationalizationSettings("pl_PL")
const i18nTranslator = new I18nTranslate(internationalizationSettings, xmlFileRequest)
$(document).ready(() => {
    i18nTranslator.loadTranslations("translations")
    $("[data-i18n-translate]").toArray().forEach((element: HTMLElement) => {
      element.innerText =   i18nTranslator.translate(element.getAttribute("data-i18n-translate"))
    })
    $("#modal").modal("show")
})

const _global: any = (window || global) as any
_global.loadPlayers = (playersDataInJson: string) => {
    const players: IPlayerData[] = JSON.parse(playersDataInJson)
    players.forEach((playerData: IPlayerData) => {
        const trRow: HTMLElement = $("<tr>").get()[0]
        const thID: HTMLElement = $("<th>").get()[0]
        const tdName: HTMLElement = $("<td>").get()[0]
        const tdRank: HTMLElement = $("<td>").get()[0]
        const tdKills: HTMLElement = $("<td>").get()[0]
        const tdDeaths: HTMLElement = $("<td>").get()[0]
        const tdPing: HTMLElement = $("<td>").get()[0]
        const tdStatus: HTMLElement = $("<td>").get()[0]
        thID.innerText = playerData.id.toString()
        tdName.innerText = playerData.name
        tdName.style.color = playerData.nameColor
        tdRank.innerText =  playerData.rank
        tdKills.innerText = playerData.kills.toString()
        tdDeaths.innerText = playerData.deaths.toString()
        tdPing.innerText = playerData.ping.toString()
        tdStatus.innerText = i18nTranslator.translate("TABLE_PLAYER_STATUS_" + playerData.status)
        trRow.appendChild(thID)
        trRow.appendChild(tdName)
        trRow.appendChild(tdRank)
        trRow.appendChild(tdKills)
        trRow.appendChild(tdDeaths)
        trRow.appendChild(tdPing)
        trRow.appendChild(tdStatus)
        $("tbody").get()[0].appendChild(trRow)
    })
    $("#active-players-spinner").addClass("d-none")
    $("#active-players-table").removeClass("d-none")

}
