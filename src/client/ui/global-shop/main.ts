import { XMLFileRequest } from "core/FileRequest/XMLFileRequest"
import { I18nTranslate } from "core/i18n/I18nTranslate"
import { InternationalizationSettings } from "core/i18n/InternationalizationSettings"
/*tslint:disable:ordered-imports*/
import $ from "jquery"
import "bootstrap"
import { PromiseFactory } from "core/PromiseFactory/PromiseFactory"
import "./style.less"
import { RegExpFactory } from "core/RegExpFactory/RegExpFactory"
import { ShopTabData } from "server/entity/ShopTabData"
import { ShopTabFilterData } from "server/entity/ShopTabFilterData"
import { ShopEntity } from "server/entity/ShopEntity"
import { GlobalShopModuleEvent } from "client/modules/GlobalShopModule/GlobalShopModuleEvent"
import { Currency } from "server/modules/ShopManager/Currency"

const regExpFactory = new RegExpFactory()
const promiseFactory = new PromiseFactory<string>()
const xmlFileRequest = new XMLFileRequest(promiseFactory)
const internationalizationSettings = new InternationalizationSettings("pl_PL")
const i18nTranslator = new I18nTranslate(internationalizationSettings, xmlFileRequest)
const providedTabDataForTabs: {[name: string]: ShopTabData}  = {}
$(document).ready(() => {
    i18nTranslator.loadTranslations("/translations")
    $("[data-i18n-translate]").toArray().forEach((element: HTMLElement) => {
      element.innerText = i18nTranslator.translate(element.getAttribute("data-i18n-translate"))
    })
    $("[data-i18n-translate-placeholder]").toArray().forEach((element: HTMLElement) => {
        element.setAttribute(
            "placeholder",
            i18nTranslator.translate(element.getAttribute("data-i18n-translate-placeholder")),
        )
      })
    $("#global-shop").modal({backdrop: "static", keyboard: false})
    $(document).on("click", ".tab-filter, .tab-filter-link", (ev) => {
      let clickedFilter = $(ev.target).attr("data-shop-tab-filter")
      if (!clickedFilter || clickedFilter.length <= 0) {
          clickedFilter = $(ev.target).find(".nav-link").attr("data-shop-tab-filter")
      }
      setFilterActive(clickedFilter)
    })
    $(document).on("click", ".buy-diamonds, .buy-cash", (ev) => {
      let el = $(ev.target)
      let itemId = el.attr("data-shop-item-id")
      if (!itemId) {
        el = $(ev.target).parent()
        itemId = el.attr("data-shop-item-id")
      }
      const currency = el.hasClass("buy-diamonds") ? Currency.DIAMONDS : Currency.MONEY
      mp.trigger(GlobalShopModuleEvent.BUY, parseInt(itemId, 10), currency)
    })

    $(document).on("click", ".close-shop", () => {
      mp.trigger(GlobalShopModuleEvent.CLOSE)

    })

    $(document).on("click", "[data-shop-tab-for]", (ev) => {
      const clickedLink = $(ev.target)
      const dropdown = clickedLink.next(".dropdown-menu")
      const haveMenu = dropdown && dropdown.length > 0
      if (!haveMenu) {
        const tabName = clickedLink.attr("data-shop-tab-for")

        if (providedTabDataForTabs[tabName]) {
            return _global.provideTabData(JSON.stringify(providedTabDataForTabs[tabName]))
          } else {
            return mp.trigger(GlobalShopModuleEvent.NEED_DATA_FOR_TAB, tabName)
          }

        }

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
  if (tabData) {
    setTabActive(tabData.name)
    if (!providedTabDataForTabs[tabData.name]) {
      providedTabDataForTabs[tabData.name] = tabData
      loadDataForTab(tabData.name, tabData)
    }
    if (tabData.subcategories.length > 0) {
      tabData.subcategories.forEach((subTab: ShopTabData) => {
        if (!providedTabDataForTabs[subTab.name]) {
          providedTabDataForTabs[subTab.name] = subTab
        }
      })
    }
    if (tabData.filters.length > 0) {
      setFilterActive(tabData.filters[0].name)
    }

  }
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
    if (tabData.subcategories.length > 0) {
      tabData.subcategories.forEach((subtab: ShopTabData) => {
        const submenu = newTab.find(".dropdown-menu")
        const newSubcategory = submenu.find(".subcategory-sample").clone()
        newSubcategory.removeClass("subcategory-sample")
        newSubcategory.text(
          i18nTranslator.translate(subtab.display_name),
        )
        newSubcategory.attr("data-shop-tab-for", subtab.name)
        submenu.append(newSubcategory)
        const newSubContent = $("#shop-tab-content-sample").clone()
        newSubContent.removeAttr("id")
        newSubContent.attr("data-shop-tab-name", subtab.name)
        newSubContent.find(".tab-title").text(
          i18nTranslator.translate(subtab.title_display_name),
        )
        newSubContent.find(".tab-description").text(
          i18nTranslator.translate(subtab.description_display_name),
        )
        $("#shop-container").append(newSubContent)

      })
    } else {
      link.next(".dropdown-menu").remove()
      link.removeClass("dropdown-toggle")
      newTab.removeClass("dropright")
    }
    const newContent = $("#shop-tab-content-sample").clone()
    newContent.removeAttr("id")
    newContent.attr("data-shop-tab-name", tabData.name)
    $("#shop-container").append(newContent)
    $("#shop-tabs-main-list").append(newTab)
  })
}

const getActiveTab = () => {
  return $(".active-tab").attr("data-shop-tab-for")
}

const setFilterActive = (filterName: string) => {
  const tabName: string = getActiveTab()
  const tab = $(`[data-shop-tab-name='${tabName}']`)
  tab.find(".row").addClass("d-none")
  tab.find(`[data-shop-tab-row-for-filter='${filterName}']`).removeClass("d-none")
  tab.find(`[data-shop-tab-row-for-filter='${filterName}']`).find(".d-none").removeClass("d-none")
  $(`[data-shop-tab-name='${tabName}']`).find(".tab-filters").find(".active").removeClass("active")
  $(`[data-shop-tab-name='${tabName}']`).find(`[data-shop-tab-filter='${filterName}']`).addClass("active")
}

const loadDataForTab = (tabName: string, data: ShopTabData) => {
  // tslint:disable: no-console
  console.log(tabName)
  console.log(data)
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
      console.log(entity)
      console.log(loaded * columnSize % maxRowSize)
      if (loaded * columnSize % maxRowSize === 0) {
        if (rowToAppend) {
          tab.append(rowToAppend)
        }
        rowToAppend = rowSample.clone()
        rowToAppend.attr("data-shop-tab-row-for-filter", filter.name)
        rowToAppend.removeClass("row-sample")
      }
      const newColumn = columnSample.clone()
      newColumn.find(".buy-diamonds").attr("data-shop-item-id", entity.id)
      newColumn.find(".buy-cash").attr("data-shop-item-id", entity.id)
      const money = entity.money && entity.money > 0 ? entity.money : data.money
      const diamonds = entity.diamonds && entity.diamonds > 0 ? entity.diamonds : data.diamonds
      newColumn.find(`.item-cost-money`).text(money)
      newColumn.find(`.item-cost-diamonds`).text(diamonds)

      const image = newColumn.find(`.column-image`)
      let src = image.attr("src")
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
