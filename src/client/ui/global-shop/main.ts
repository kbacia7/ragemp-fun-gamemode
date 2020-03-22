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
import { PlayerRegisterEvent } from "core/PlayerRegister/PlayerRegisterEvent"
import {
    PlayerRegisterAndLoginModuleEvent,
} from "client/modules/PlayerRegisterAndLoginModule/PlayerRegisterAndLoginModuleEvent"
import { IPlayerRegiserData } from "core/PlayerRegister/IPlayerRegisterData"
import { stringify } from "querystring"
import { PlayerEmailValidator } from "core/DataValidator/PlayerEmail/PlayerEmailValidator"
import { RegExpFactory } from "core/RegExpFactory/RegExpFactory"
import { PlayerLoginValidator } from "core/DataValidator/PlayerLogin/PlayerLoginValidator"
import { PlayerPasswordValidator } from "core/DataValidator/PlayerPassword/PlayerPasswordValidator"
import { ShopTabData } from "server/entity/ShopTabData"
import { ShopTabFilterData } from "server/entity/ShopTabFilterData"
import { ShopEntity } from "server/entity/ShopEntity"

const regExpFactory = new RegExpFactory()
const promiseFactory = new PromiseFactory<string>()
const xmlFileRequest = new XMLFileRequest(promiseFactory)
const internationalizationSettings = new InternationalizationSettings("pl_PL")
const i18nTranslator = new I18nTranslate(internationalizationSettings, xmlFileRequest)
const emailValidator = new PlayerEmailValidator(regExpFactory)
const loginValidator = new PlayerLoginValidator(regExpFactory)
const passwordValidator = new PlayerPasswordValidator()
$(document).ready(() => {
    i18nTranslator.loadTranslations("/translations")
    $("[data-i18n-translate]").toArray().forEach((element: HTMLElement) => {
      element.innerText =   i18nTranslator.translate(element.getAttribute("data-i18n-translate"))
    })
    $("[data-i18n-translate-placeholder]").toArray().forEach((element: HTMLElement) => {
        element.setAttribute(
            "placeholder",
            i18nTranslator.translate(element.getAttribute("data-i18n-translate-placeholder")),
        )
      })
    $("#global-shop").modal({backdrop: "static", keyboard: false})
    // tslint:disable-next-line: no-console

    $(document).on("click", ".tab-filter, .tab-filter-link", (ev) => {
      let clickedFilter = $(ev.target).attr("data-shop-tab-filter")
      if (!clickedFilter || clickedFilter.length <= 0) {
          clickedFilter = $(ev.target).find(".nav-link").attr("data-shop-tab-filter")
      }
      setFilterActive(clickedFilter)
    })

})

const _global: any = (window || global) as any

const setTabActive = (tabName: string) => {
  $(`[data-shop-tab-name]`).addClass("d-none")
  $(`[data-shop-tab-for]`).removeClass("active-tab")
  $(`[data-shop-tab-for='${tabName}']`).addClass("active-tab")
  $(`[data-shop-tab-name='${tabName}']`).removeClass("d-none")
}

_global.provideTabData = (tabDataAsJson: string) => {
  const tabData: ShopTabData = JSON.parse(tabDataAsJson)
  loadDataForTab(tabData.name, tabData)
  setTabActive(tabData.name)
  setFilterActive(tabData.filters[0].name)
}

_global.provideTabs = (tabsAsJson: string) => {
  const tabsData: ShopTabData[] = JSON.parse(tabsAsJson)
  const tabElement = $("#tab-shop-tab-sample")
  tabsData.forEach((tabData: ShopTabData) => {
    const newTab = tabElement.clone()
    newTab.removeAttr("id")
    const link = newTab.find(".nav-link")
    link.attr("data-shop-tab-for", tabData.name)
    link.text(
      i18nTranslator.translate(tabData.display_name),
    )
    $("#shop-tabs-main-list").append(newTab)

    const newContent = $("#shop-tab-content-sample").clone()
    newContent.removeAttr("id")
    newContent.attr("data-shop-tab-name", tabData.name)
    $("#shop-container").append(newContent)
  })
}

const getActiveTab = () => {
  return $(".active-tab").attr("data-shop-tab-for")
}

const setFilterActive = (filterName: string) => {
  const tabName: string = getActiveTab()
  // tslint:disable-next-line: no-console
  console.log(tabName)
  const tab = $(`[data-shop-tab-name='${tabName}']`)
  tab.find(".row").addClass("d-none")
  tab.find(`[data-shop-tab-row-for-filter='${filterName}']`).removeClass("d-none")
  tab.find(`[data-shop-tab-row-for-filter='${filterName}']`).find(".d-none").removeClass("d-none")
  $(`[data-shop-tab-name='${tabName}']`).find(".tab-filters").find(".active").removeClass("active")
  $(`[data-shop-tab-name='${tabName}']`).find(`[data-shop-tab-filter='${filterName}']`).addClass("active")
}

const loadDataForTab = (tabName: string, data: ShopTabData) => {
  const tab = $(`[data-shop-tab-name="${tabName}"]`)
  const columnSize = data.column_size
  const isCustomSize = !columnSize.toString().includes(".0")

  const maxRowSize = 12
  const oneColumnSizePercent = 8.3
  const rowSample = tab.find(`.row-sample`)

  const columnSample =  tab.find(`.column-sample`)
  if (isCustomSize) {
    const w = `${columnSize * oneColumnSizePercent}%`
    columnSample.css("width", w)
    columnSample.css("flex", `0 0 ${w}`)
    columnSample.css("max-width", w)
  } else {
    columnSample.removeClass("col-2")
    columnSample.addClass(`col-${parseInt(columnSize.toString(), 10)}`)
  }

  const filterSample = tab.find(`.filter-sample`)
  data.filters.forEach((filter: ShopTabFilterData) => {
    const newFilter = filterSample.clone()
    newFilter.removeClass("filter-sample")
    const link = newFilter.find(".tab-filter-link")
    link.text(
      i18nTranslator.translate(filter.display_name),
    )
    link.attr("data-shop-tab-filter", filter.name)
    tab.find(".tab-filters").append(newFilter)

    let loaded = 0
    let rowToAppend = null
    filter.entities.forEach((entity: ShopEntity) => {
      if (loaded * columnSize % maxRowSize === 0) {
        if (rowToAppend) {
          tab.append(rowToAppend)
        }
        rowToAppend = rowSample.clone()
        rowToAppend.attr("data-shop-tab-row-for-filter", filter.name)
        rowToAppend.removeClass("row-sample")
      }
      const newColumn = columnSample.clone()
      newColumn.find(`.item-cost-money`).text(entity.money)
      newColumn.find(`.item-cost-diamonds`).text(entity.diamonds)

      const image = newColumn.find(`.column-image`)
      let src = image.attr("src")
      src = src.replace("[TAB_NAME]", data.name)
      src = src.replace("[FILTER_NAME]", filter.name)
      src = src.replace("[FILENAME]", entity.filename)
      newColumn.removeClass("column-sample")
      image.attr("src", src)
      rowToAppend.append(newColumn)
      loaded++
    })
    if (loaded * columnSize % 12 !== 0) {
      tab.append(rowToAppend)
    }
  })
}
