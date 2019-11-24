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
import { IRaceData } from "server/modules/AutomaticEvents/Events/Race/IRaceData"
import * as luxon from "luxon"

const promiseFactory = new PromiseFactory<string>()
const xmlFileRequest = new XMLFileRequest(promiseFactory)
const internationalizationSettings = new InternationalizationSettings("pl_PL")
const i18nTranslator = new I18nTranslate(internationalizationSettings, xmlFileRequest)
$(document).ready(() => {
    i18nTranslator.loadTranslations("translations")
    $("[data-i18n-translate]").toArray().forEach((element: HTMLElement) => {
        element.innerText = i18nTranslator.translate(element.getAttribute("data-i18n-translate"))
    })

    $("#automatic-event-table-tabs").on("click", "[id^=tabs]", (event) => {
        const id: string = event.target.id
        if (id && id.length > 0) {
            const pageName: string = id.split("-")[1]
            if (pageName !== "sample") {
                $(".active").removeClass("active")
                $(`#${id}`).addClass("active")
                $("[id$='-page']").addClass("d-none")
                $(`#${pageName}-page`).removeClass("d-none")
            }
        }
    })
    _global.togglePage("events")
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
        const clickedButton = el.find(".automatic-events-table-row-save-button")
        clickedButton.on("click", () => {
            if (clickedButton.hasClass("automatic-event-saved")) {
                mp.trigger(AutomaticEventsTableModuleEvents.PLAYER_SIGNED_OFF_EVENT, automaticEventData.name)
                clickedButton.removeClass("automatic-event-saved")
                clickedButton.removeClass("btn-info")
                clickedButton.addClass("btn-primary")
                clickedButton.text(i18nTranslator.translate("AUTOMATIC_EVENTS_ARENA_SAVE"))
            } else {
                mp.trigger(AutomaticEventsTableModuleEvents.PLAYER_SAVE_ON_EVENT, automaticEventData.name)
                clickedButton.removeClass("btn-primary")
                clickedButton.addClass("btn-info")
                clickedButton.addClass("automatic-event-saved")
                clickedButton.text(i18nTranslator.translate("AUTOMATIC_EVENTS_ARENA_SAVED"))
            }

        })
        el.removeClass("d-none")
        el.prependTo("#events-page")
    })
}

_global.updateRow = (eventName: string, automaticEventDataStr: string) => {
    const automaticEventData: IAutomaticEventData = JSON.parse(automaticEventDataStr)
    $(`#automatic-events-table-${eventName}-row`).find(".automatic-events-table-row-title").text(
        `${automaticEventData.displayName} (${automaticEventData.actualPlayers}/${automaticEventData.maxPlayers})`,
    )
}

_global.updateButton = (eventName: string) => {
    const button = $(`#automatic-events-table-${eventName}-row`).find(".automatic-events-table-row-save-button")
    button.removeClass("automatic-event-saved")
    button.removeClass("btn-info")
    button.addClass("btn-primary")
    button.text(i18nTranslator.translate("AUTOMATIC_EVENTS_ARENA_SAVE"))
}

_global.addButtonToEventPage = (evName: string, displayName: string) => {
    const clonedButton = $("#tabs-sample").clone()
    clonedButton.removeClass("d-none")
    clonedButton.removeAttr("id")
    const link =  clonedButton.find(".nav-link")
    link.attr("id", `tabs-${evName}`)
    link.text(displayName)
    $("#automatic-event-table-tabs").append(clonedButton)
}

_global.togglePage = (evName: string) => {
    $(".active").removeClass("active")
    $(`#tabs-${evName}`).addClass("active")
    $("[id$='-page']").addClass("d-none")
    $(`#${evName}-page`).removeClass("d-none")
}

_global.clearRaceList = () => {
    $("#race-page-players-list").children("li:not(#race-page-player-sample)").remove()
}

_global.setRaceData = (
    playersWithTimeStr: string, allCheckpoints: string,
    playerTime: string, playerChekpoints: string,
) => {
    const playersWithTime = JSON.parse(playersWithTimeStr)
    playerTime = luxon.DateTime.fromMillis(parseInt(playerTime, 10)).toFormat("mm:ss.SSS")
    playersWithTime.forEach((raceData: IRaceData) => {
        const el = $("#race-page-player-sample").clone()
        el.removeAttr("id")
        el.removeClass("d-none")
        const ms = luxon.DateTime.fromMillis(raceData.timeInMs).toFormat("mm:ss.SSS")
        el.text(`${raceData.name} (${ms})`)
        $("#race-page-players-list").append(el)
    })
    $("#race-page-info-checkpoints").text(playerChekpoints)
    $("#race-page-info-checkpoints-all").text(allCheckpoints)
    $("#race-page-info-time").text(playerTime)
}

_global.clearDerbyList = () => {
    $("#derby-page-players-list").children("li:not(#derby-page-player-sample)").remove()
}

_global.setDerbyData = (
    playersNamesStr: string,
) => {
    const playersNames: string[] = JSON.parse(playersNamesStr)
    playersNames.forEach((playerName: string) => {
        const el = $("#derby-page-player-sample").clone()
        el.removeAttr("id")
        el.removeClass("d-none")
        el.text(`${playerName}`)
        $("#derby-page-players-list").append(el)
    })
}

_global.clearHideAndSeekList = () => {
    $("#hideandseek-page-players-list").children("li:not(#hideandseek-page-player-sample)").remove()
}

_global.setHideAndSeekData = (
    playersListStr: string, lookingPlayerName: string,
) => {
    const playersList: string[] = JSON.parse(playersListStr)
    playersList.forEach((playerName: string) => {
        const el = $("#hideandseek-page-player-sample").clone()
        el.removeAttr("id")
        el.removeClass("d-none")
        const isLooking = playerName === lookingPlayerName
        if (isLooking) {
            el.addClass("font-weight-bold")
        }
        el.text(`${playerName}`)
        $("#hideandseek-page-players-list").append(el)
    })
}

_global.clearHideAndSeekList = () => {
    $("#hideandseek-page-players-list").children("li:not(#hideandseek-page-player-sample)").remove()
}

_global.setTdmData = (
    weapons: string, teamAPlayersCount: string, teamBPlayersCount: string,
) => {
    $("#tdm-page-weapons").text(weapons)
    $("#tdm-page-players-a").text(teamAPlayersCount)
    $("#tdm-page-players-b").text(teamBPlayersCount)
}

_global.removePage = (evName: string) => {
    $(`#tabs-${evName}`).parent("li").first().remove()
    $(`#${evName}-page`).addClass("d-none")
}
